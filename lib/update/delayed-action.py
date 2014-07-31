#!/usr/bin/env python

import time, random, subprocess, sys

time.sleep(random.randint(0, int(sys.argv[1])))
subprocess.call(sys.argv[2:])
