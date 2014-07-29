#!/usr/bin/env python2.7
import unittest
import os
import sys
import StringIO

import mock

sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "..", "routerapi"))

import set_private_ssid
import uci

def setInput(input):
      sys.stdin.write(input)
      sys.stdin.seek(0)

class TestSetPrivateSsid(unittest.TestCase):
    def setUp(self):
        # Send stdout/stdin to a buffer so we can check output
        self.saved_stdout, sys.stdout = sys.stdout, StringIO.StringIO()
        self.saved_stdin, sys.stdin = sys.stdin, StringIO.StringIO()

    def tearDown(self):
        sys.stdout = self.saved_stdout
        sys.stdin = self.saved_stdin

    @mock.patch('uci.set', mock.Mock(return_value = True))
    @mock.patch('uci.commit', mock.Mock(return_value = True))
    @mock.patch('os.fork', mock.Mock(return_value = 0))
    @mock.patch('common.reset_wifi', mock.Mock(return_value = True))
    def test_set_private_ssid(self):
        setInput("""{"jsonrpc":"2.0","method":"set_private_ssid",
            "params":["MyNet","wifi passphrase"],"id":1}""")
        self.assertRaises(SystemExit, set_private_ssid.jsonrpc_set_private_ssid)
        calls = [
          mock.call('wireless.@wifi-iface[2].ssid', 'MyNet'),
          mock.call('wireless.@wifi-iface[2].key', 'wifi passphrase'),
          mock.call('openwireless.setup_state', 'complete')
        ]
        uci.set.assert_has_calls(calls, any_order = True)
        uci.commit.assert_called_once_with('wireless')
        uci.commit.assert_called_once_with('openwireless')
        os.fork.assert_called_once()
        common.reset_wifi.assert_called_once()

    @mock.patch('uci.set', mock.Mock(return_value = True))
    @mock.patch('uci.commit', mock.Mock(return_value = True))
    @mock.patch('os.fork', mock.Mock(return_value = 9876))
    def test_set_private_ssid(self):
        setInput("""{"jsonrpc":"2.0","method":"set_private_ssid",
            "params":["MyNet","wifi passphrase"],"id":1}""")
        self.assertRaises(SystemExit, set_private_ssid.jsonrpc_set_private_ssid)
        self.assertEqual(sys.stdout.getvalue(),
            """Content-Type: application/json

{"ssid": "MyNet"}
""")
        os.fork.assert_called_once()

if __name__ == '__main__':
    unittest.main()
