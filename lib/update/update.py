#!/usr/bin/env python2.7

import re, pycurl, json, StringIO, tempfile, hashlib, subprocess, sys, os
import systemwide_lock
import time


def failed(why):
    sys.stderr.write("Failed %s\n" % why)
    systemwide_lock.release_lock()
    sys.exit(1)

class UpdateError(Exception):
    '''Exception raised if an error occures while updating.
    '''
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return ("Failed " + self.message)

class Updater(object):

    openwrt_release_file = "/etc/openwrt_release"
    keyring = "/etc/update_key.gpg"
    update_url = "https://s.eff.org/files/openwireless/update.json.asc"
    sysupgrade_command = ["/usr/bin/sudo", "sysupgrade", "-v", "-n"]
    update_check_file = "/etc/last_update_check"
    ca_file = "/etc/ssl/certs/StartCom_Certification_Authority.crt"
    
    def __init__(self):
        self.firmware = None
        self.current = None
        with open(self.openwrt_release_file) as f:
            for line in f:
                m = re.match(r'^DISTRIB_RELEASE_DATE="(\d+)"$', line)
                if m and len(m.groups()) == 1:
                    self.current = int(m.groups()[0])
                    break
        if self.current is None:
            raise UpdateError("to find current version in " + self.openwrt_release_file)
        self.purported_manifest = None
        self.manifest = None

    def get_manifest(self):
        '''Download the manifest from eff.org.
        Returns True on success and False if the download failed.
        '''
        buffer = StringIO.StringIO()
        curl = pycurl.Curl()
        curl.setopt(pycurl.PROXYPORT, 9050)
        curl.setopt(pycurl.PROXY, "localhost")
        curl.setopt(pycurl.PROXYTYPE, 6)   # == PROXYTYPE_SOCKS4A
        curl.setopt(pycurl.CAINFO, self.ca_file)
        curl.setopt(pycurl.URL, self.update_url)
        curl.setopt(pycurl.WRITEFUNCTION, buffer.write)
        try:
            curl.perform()
        except Exception, e:
            print e
            return False
        else:
            self.purported_manifest = buffer.getvalue()
        return True

    def valid_sig(self):
        """Is self.purported_manifest correctly signed by a trusted key?"""
        if not self.purported_manifest:
            return False
        in_fd, out_fd = os.pipe()
        command = ["gpg", "--keyring", self.keyring, "--no-default-keyring",
                   "--status-fd", str(out_fd), "--decrypt"]
        p = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        proc_stdout, proc_stderr = p.communicate(self.purported_manifest)
        if p.returncode != 0:
            return False
        print "verification reported successful"
        status = os.read(in_fd, 65536).split("\n")
        print "status_fd output = ", status
        print "proc_stdout = ", proc_stdout
        print "all nonempty lines start with [GNUPG:]? ", all(bool(re.match(r"^\[GNUPG:\]", L) or not L) for L in status)
        if not all(bool(re.match(r"^\[GNUPG:\]", L) or not L) for L in status):
            return False
        if not any(re.match(r"^\[GNUPG:\] GOODSIG ", L) for L in status):
            return False
        if not any(re.match(r"^\[GNUPG:\] VALIDSIG ", L) for L in status):
            return False
        self.signed_manifest = proc_stdout
        return True

    def download_file(self):
        '''Downloads the update image to a temporary file and saves its
        location to the attribute `firmware`.
        '''
        if not self.manifest or not self.manifest.has_key("url"):
            return None
        url = self.manifest["url"]
        fd, fname = tempfile.mkstemp()
        with open(fname, "w") as buffer:
            curl = pycurl.Curl()
            curl.setopt(pycurl.URL, self.manifest["url"].encode("ascii"))
            curl.setopt(pycurl.WRITEFUNCTION, buffer.write)
            curl.setopt(pycurl.CAINFO, self.ca_file)
            try:
                curl.perform()
            except Exception, e:
                print e
                return False
            else:
                self.firmware = fname
                return True

    def valid_firmware(self):
        if not self.manifest:
            return False
        if not ("sha256" in self.manifest and "size" in self.manifest and "timestamp" in self.manifest):
            return False
        if not self.is_newer():
            return False
        s = hashlib.sha256()
        filesize = 0
        BLOCKSIZE = 2**20
        with open(self.firmware, "r") as f:
            while True:
                data = f.read(BLOCKSIZE)
                if not data: break
                s.update(data)
                filesize += len(data)
        return filesize == self.manifest["size"] and s.hexdigest() == self.manifest["sha256"]

    def is_newer(self):
        return self.manifest["timestamp"] > self.current

    def do_update(self):
        if not self.firmware:
            return False
        # This is unlikely to actually return if successful, because the
        # sysupgrade command itself will likely kill the upgrader process
        # and also reboot the device.
        return not subprocess.call(self.sysupgrade_command + [self.firmware])

    def extract_manifest(self, what):
        try:
            extracted_version = json.loads(what)
            if not isinstance(extracted_version, dict):
                raise UpdateError("to extract a JSON-structured update manifest")
            else:
                return extracted_version
        except ValueError, e:
            raise UpdateError("to extract a JSON-structured update manifest")
        raise UpdateError("not reached")

    def parse_manifest(self):
        if not self.purported_manifest:
            raise UpdateError("to get the manifest")
        if self.valid_sig():
            self.manifest = self.extract_manifest(self.signed_manifest)
            return True
        else:
            return False

    @staticmethod
    def __update_check_file(newer):
        """Store the current time (in Javascript format) in the file that
        tracks when we last checked for updates.
        """
        msg = "Updating " + self.update_check_file + " to indicate "
        if not newer:
            flag = "   N"
            msg += "no installable"
        else:
            flag = "   Y"
            msg += "an"
        msg += " update is available."
        with open(self.update_check_file, "w") as checkfile:
            checkfile.write(repr(time.time()*1000) + flag)
        return True

    def check_for_updates(self, advise_only=False):
        """Checks for new software version. If advise_only is True it doesn't
        call do_update() otherwise True is returned if a new firmware version
        is available and False if it is the current.
        """
        if not self.purported_manifest:
            print "Getting update metadata..."
            if not self.get_manifest():
                raise UpdateError("to download update metadata")
        print self.purported_manifest

        if not self.manifest:
            print "Validating update signature..."
            if not self.parse_manifest():
                # Parsing includes signature validity checking
                raise UpdateError("to validate signature of update metdata")

        print "Checking whether to update..."
        newer = self.is_newer()
        self.__update_check_file(newer)
        if advise_only:
            # In this case, the update script is being run merely to check
            # and inform the user whether an update is available, not to
            # install it.
            return newer

        print "Downloading new firmware image..."
        if not self.download_file():
            raise UpdateError("to download firmware image")

        print "Validating downloaded image..."
        if not self.valid_firmware():
            raise UpdateError("to validate downloaded firmware image")

        print "Installing image..."
        return self.do_update()


if __name__ == '__main__':
    advise_only = False
    if len(sys.argv) > 1 and sys.argv[1] == 'check':
        advise_only = True
        print "Advise-only mode (checking whether update is available)"
    try:
        if not systemwide_lock.get_lock():
            failed("to acquire update lock")
        u = Updater()
        result = u.check_for_updates(advise_only)
        if advise_only:
            # Release lock is called in the finally block
            if result:
                # update is available
                sys.exit(0)
            # current version
            sys.exit(1)
        else:
            if not result:
                failed("to install update")
            # Reboot if the installation completed but we're still alive
            subprocess.call(["/usr/bin/sudo", "/sbin/reboot"])
    except UpdateError as why:
        # Catch "trusted" exception
        failed(why.message)
    except Exception, e:
        print e
        failed("to update for an undetermined reason.")
    finally:
        systemwide_lock.release_lock()
