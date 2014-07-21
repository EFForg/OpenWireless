#!/usr/bin/env python2.7
"""
Install a crontab that:
  - stores accumulated bandwidth usage at a certain minute each hour,
    randomly chosen at first boot.
  - checks for system updates a minute after that.
"""
import os
import random
import subprocess

CRONTABS = '/var/spool/cron/crontabs'
try:
    os.makedirs(CRONTABS)
except OSError:
    pass
# Choose a random minute so that all routers don't check for updates
# simultaenous. Choose up to 58, so that we can safely do minute + 1.
minute = int(random.uniform(0, 58))
if not os.path.isfile(os.path.join(CRONTABS, 'root')):
    # Temporary hack: We would like to check for updates hourly, then install
    # them at a time convenient for the user. Right now the update metadata is
    # triggering an update every time it is fetched, so we only want to check
    # for updates a maximum of once per day. We check at 1200 UTC, which is 5am
    # EDT / 2am PDT.
    crontab = ("""
%d * * * * python /www/cgi-bin/routerapi/accumulate_bytes
%d 12 * * * python /lib/update/update.py
""") % (minute, minute + 1)
    subprocess.Popen(['/usr/bin/crontab', '-'],
      stdin = subprocess.PIPE).communicate(crontab)
