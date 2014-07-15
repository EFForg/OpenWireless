"""
Mock out run.py, which is a thin wrapper around subprocess.check_output.
"""
import random
import time

def check_output(arg_list):
  if arg_list[:3] == ['/usr/bin/sudo', '/usr/sbin/iptaccount', '-l']:
    return """

libxt_ACCOUNT_cl userspace accounting tool v1.3

Showing table: total-wan
Run #0 - 1 item found
IP: 0.0.0.0 SRC packets: 13965 bytes: %ld DST packets: 0 bytes: 0
Finished.
""" % int(time.time() * 100000 + random.uniform(0, 40000))
  elif arg_list == ['/usr/bin/sudo', '/bin/ping', '-c1', 'eff.org']:
    return """
PING eff.org (69.50.225.155): 56 data bytes
64 bytes from 69.50.225.155: seq=0 ttl=49 time=91.893 ms

--- eff.org ping statistics ---
1 packets transmitted, 1 packets received, 0% packet loss
round-trip min/avg/max = 91.893/91.893/91.893 ms
"""
  else:
    return "Didn't recognize command"
