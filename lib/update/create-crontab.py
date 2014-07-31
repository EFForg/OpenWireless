#!/usr/bin/env python2.7
"""
Install a crontab that:
  - stores accumulated bandwidth usage each each hour,
  - checks for system updates at random times each hour,
  - tries to update the OS at a random time between 3:00 and 5:00.
"""
import os
import random
import subprocess

CRONTABS = '/var/spool/cron/crontabs'
try:
    os.makedirs(CRONTABS)
except OSError:
    pass

if not os.path.isfile(os.path.join(CRONTABS, 'root')):
    crontab = """
0 * * * * /usr/bin/env python2.7 /www/cgi-bin/routerapi/accumulate_bytes
0 3 * * * /usr/bin/env python2.7 /lib/update/delayed-action.py 7200 /lib/update/update.py
0 0,1,2,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23 * * * /usr/bin/env python2.7 /lib/update/delayed-action.py 3600 /usr/bin/env python2.7 /lib/update/update.py check
"""
    subprocess.Popen(['/usr/bin/crontab', '-'],
      stdin = subprocess.PIPE).communicate(crontab)
