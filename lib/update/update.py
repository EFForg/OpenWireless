#!/usr/bin/env python

import re, pycurl, json, StringIO, tempfile, hashlib, subprocess, sys, os
import systemwide_lock

openwrt_release_file = "/etc/openwrt_release"
# openwrt_release_file = "openwrt_release"
keyring = "/lib/update/testtest.gpg"
update_url = "https://s.eff.org/files/ow-testtest/update4.json.asc"
sysupgrade_command = ["/usr/bin/sudo", "sysupgrade", "-v", "-n"]

def failed(why):
    sys.stderr.write("Failed %s\n" % why)
    systemwide_lock.release_lock()
    sys.exit(1)

class Updater(object):
    def __init__(self):
        self.firmware = None
        self.current = None
        with open(openwrt_release_file) as f:
            for line in f:
                m = re.match(r'^DISTRIB_RELEASE_DATE="(\d+)"$', line)
                if m and len(m.groups()) == 1:
                    self.current = int(m.groups()[0])
                    break
            else:
                failed("to find current version in /etc/openwrt_release")
        self.purported_manifest = None
        self.manifest = None

    def get_manifest(self):
        buffer = StringIO.StringIO()
        curl = pycurl.Curl()
        curl.setopt(pycurl.PROXYPORT, 9050)
        curl.setopt(pycurl.PROXY, "localhost")
        curl.setopt(pycurl.PROXYTYPE, 6)   # == PROXYTYPE_SOCKS4A
        curl.setopt(pycurl.CAINFO, "/etc/ssl/certs/StartCom_Certification_Authority.crt")
        curl.setopt(pycurl.URL, update_url)
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
        command = ["gpg", "--keyring", keyring, "--no-default-keyring", "--status-fd", str(out_fd), "--decrypt"]
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
        if not self.manifest or not self.manifest.has_key("url"):
            return None
        url = self.manifest["url"]
        fd, fname = tempfile.mkstemp()
        with open(fname, "w") as buffer:
            curl = pycurl.Curl()
            curl.setopt(pycurl.URL, self.manifest["url"].encode("ascii"))
            curl.setopt(pycurl.WRITEFUNCTION, buffer.write)
            curl.setopt(pycurl.CAINFO, "/etc/ssl/certs/StartCom_Certification_Authority.crt")
            try:
                curl.perform()
            except Exception, e:
                print e
                return False
            else:
                self.firmware = fname
                return True

    def valid_firmware(self):
        if not (self.manifest.has_key("sha256") and self.manifest.has_key("size") and self.manifest.has_key("timestamp")):
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
        return not subprocess.call(sysupgrade_command + [self.firmware])

    def extract_manifest(self, what):
        try:
            extracted_version = json.loads(what)
            if not isinstance(extracted_version, dict):
                failed("to extract a JSON-structured update manifest")
            else:
                return extracted_version
        except ValueError, e:
            failed("to extract a JSON-structured update manifest")
        failed("not reached")

    def parse_manifest(self):
        if not self.purported_manifest:
            raise Exception, "cannot get manifest"
        if self.valid_sig():
            self.manifest = self.extract_manifest(self.signed_manifest)
            return True
        else:
            return False

if __name__ == '__main__':
    advise_only = False
    if len(sys.argv) > 1 and sys.argv[1] == 'check':
        advise_only = True
        print "Advise-only mode (checking whether update is available)"
    try:
        if not systemwide_lock.get_lock():
            failed("to acquire update lock")
        u = Updater()
        print "Getting update metadata..."
        if not u.get_manifest():
            failed("to download update metadata")
        print u.purported_manifest
        print "Validating update signature..."
        if not u.parse_manifest():  # includes signature validity checking
            failed("to validate signature of update metdata")
        print "Checking whether to update..."
        if advise_only:
            # In this case, the update script is being run merely to check
            # and inform the user whether an update is available, not to
            # install it.
            systemwide_lock.release_lock()
            if u.is_newer():
                print "An update is available."
                sys.exit(0)
            else:
                print "No installable update is available."
                sys.exit(1)
        if u.is_newer():
            print "Downloading new firmware image..."
            if not u.download_file():
                failed("to download firmware image")
            print "Validating downloaded image..."
            if u.valid_firmware():
                print "Installing image..."
                if not u.do_update():
                    failed("to install update")
                subprocess.call(["/usr/bin/sudo", "/sbin/reboot"])
            else:
                failed("to validate downloaded firmware image")
        else:
            print "No update was needed."
    except Exception, e:
        failed("to update for an undetermined reason.")
    finally:
        systemwide_lock.release_lock()
