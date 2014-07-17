#!/usr/bin/python
"""
Install a crontab that checks for updates at a random minute each hour.
"""
import os
import random
import subprocess

CRONTABS = '/var/spool/cron/crontabs'
try:
    os.makedirs(CRONTABS)
except OSError:
    pass
minute = int(random.uniform(0, 60))
if not os.path.isfile(os.path.join(CRONTABS, 'root')):
    cronline = '%d * * * * python /lib/update/update.py\n' % minute
    subprocess.Popen(['/usr/bin/crontab', '-'],
      stdin = subprocess.PIPE).communicate(cronline)
