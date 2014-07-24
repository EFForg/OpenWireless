#!/usr/bin/env python2.7

import subprocess, time

lockfile = "/var/lock/update"

def get_lock(lockfile=lockfile):
    p = subprocess.Popen(["lock", lockfile])
    got_lock = False
    for i in range(4):
        if p.poll() == 0:
            got_lock = True
            break
        time.sleep(0.5)
    else:
        p.kill()
        if p.wait() == 0:
            got_lock = True
    return got_lock

def release_lock(lockfile=lockfile):
    c = subprocess.call(["lock", "-u", lockfile])
