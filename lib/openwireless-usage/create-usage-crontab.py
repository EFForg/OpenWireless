#!/usr/bin/env python2.7
""" Install a crontab that checks if the router has been reset and updates openwireless usage """

import os
import random
import subprocess

CRONTABS = '/var/spool/cron/crontabs'
try:
    os.makedirs(CRONTABS)
except OSError:
    pass
if not os.path.isfile(os.path.join(CRONTABS, 'root')):
    cronline = '* 1 * * * python /www/cgi-bin/routerapi/accumulate_bytes\n'
    subprocess.Popen(['/usr/bin/crontab', '-'],
      stdin = subprocess.PIPE).communicate(cronline)
