#!/usr/bin/env python2.7
import unittest
import tempfile
import os
import sys
import StringIO

import mock

sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "..", "routerapi"))

import change_password_first_time
import uci

def setInput(input):
      sys.stdin.write(input)
      sys.stdin.seek(0)

class TestChangePasswordFirstTime(unittest.TestCase):
    def setUp(self):
        self.etc = tempfile.mkdtemp()
        self.auth_path = os.path.join(self.etc, 'auth')
        os.mkdir(self.auth_path)
        os.chmod(self.auth_path, 0700)
        # Send stdout/stdin to a buffer so we can check output
        self.saved_stdout, sys.stdout = sys.stdout, StringIO.StringIO()
        self.saved_stdin, sys.stdin = sys.stdin, StringIO.StringIO()

    def remove(self, filename):
        try:
            os.remove(os.path.join(self.etc, filename))
        except OSError:
            pass

    def tearDown(self):
        self.remove('auth/auth_token')
        self.remove('auth/password')
        os.rmdir(self.auth_path)
        os.rmdir(self.etc)
        sys.stdout = self.saved_stdout
        sys.stdin = self.saved_stdin

    @mock.patch('uci.set', mock.Mock(return_value = True))
    @mock.patch('uci.commit', mock.Mock(return_value = True))
    def test_change_password_first_time(self):
        setInput('{"jsonrpc":"2.0","method":"setpassword","params":["username","password"],"id":1}')
        change_password_first_time.jsonrpc_change_password_first_time(self.auth_path)
        self.assertTrue(
            os.path.isfile(os.path.join(self.auth_path, 'password')))
        uci.set.assert_called_once_with('openwireless.setup_state', 'setup-private-net')
        uci.commit.assert_called_once_with('openwireless')

if __name__ == '__main__':
    unittest.main()
