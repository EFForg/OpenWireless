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
# simultaneously. Choose up to 58, so that we can safely do minute + 1.
minute = int(random.uniform(0, 58))
if not os.path.isfile(os.path.join(CRONTABS, 'root')):
    crontab = ("""
%d * * * * /usr/bin/env python2.7 /www/cgi-bin/routerapi/accumulate_bytes
%d 4 * * * /usr/bin/env python2.7 /lib/update/update.py
%d 0,1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23 * * * /usr/bin/env python2.7 /lib/update/update.py check
""") % (minute, minute + 1, minute)
    subprocess.Popen(['/usr/bin/crontab', '-'],
      stdin = subprocess.PIPE).communicate(crontab)
