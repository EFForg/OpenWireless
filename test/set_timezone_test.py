#!/usr/bin/env python2.7

import unittest, sys, os
import StringIO

sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "..", "routerapi"))

from set_timezone import jsonrpc_set_timezone

# TODO: Use mktemp rather than storing in current dir.
TZ_PATH = "./TZ"

def setInput(input):
    sys.stdin.write(input)
    sys.stdin.seek(0)

class SetTimezoneTest(unittest.TestCase):
    def setUp(self):
        open(TZ_PATH, "w").close()
        # Send stdout/stdin to a buffer so we can check output
        self.saved_stdout, sys.stdout = sys.stdout, StringIO.StringIO()
        self.saved_stdin, sys.stdin = sys.stdin, StringIO.StringIO()

    def tearDown(self):
        os.remove(TZ_PATH)
        sys.stdout = self.saved_stdout
        sys.stdin = self.saved_stdin

    def test_set_timezone(self):
        setInput('{"jsonrpc":"2.0","method":"set_timezone","params":["America/Los_Angeles"],"id":1}')

        with self.assertRaises(SystemExit):
            jsonrpc_set_timezone(".")

        with open(TZ_PATH, "r") as tz_file:
            tz_data = tz_file.read()

        self.assertEqual(tz_data, "PST8PDT,M3.2.0,M11.1.0")

if __name__ == '__main__':
    unittest.main()

