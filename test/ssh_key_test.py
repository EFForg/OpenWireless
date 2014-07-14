#!/usr/bin/python
import unittest
import tempfile
import os
import sys
import StringIO
import mock

sys.path.insert(0, os.path.join(
  os.path.dirname(os.path.realpath(__file__)),
  "..", "routerapi"))

import uci
import ssh_key

SMALL_KEY = ("ssh-rsa "
      "AAAAB3NzaC1yc2EAAAADAQABAAAAgQC1KpfJOcoQiHQYoA/zaeqGcj0tYpq7/"
      "T29YZoZHzLpxBlFNB7hzwkphfuAL53CO073+YEChT6+YTd4i4aPjN0Ttg4Xkb"
      "3eSvsrgG45KsFrGlqLs4rWgM4+ae/BZ6kaGgoOPzbAG/QWAudsWv8DLj4NyuC"
      "tRruwsDLi6NiBLQg7HQ== my@address")
INVALID_KEY = SMALL_KEY * 20

class TestSshKey(unittest.TestCase):
  def setUp(self):
    self.dropbear = tempfile.mkdtemp()
    self.authorized_keys = os.path.join(self.dropbear, "authorized_keys")
    os.environ.clear()
    # Send stdout/stdin to a buffer so we can check output
    self.saved_stdout, sys.stdout = sys.stdout, StringIO.StringIO()
    self.saved_stdin, sys.stdin = sys.stdin, StringIO.StringIO()

  def remove(self, filename):
    if os.path.exists(filename):
      os.remove(filename)

  def tearDown(self):
    self.remove(self.authorized_keys)
    os.rmdir(self.dropbear)
    sys.stdout = self.saved_stdout
    sys.stdin = self.saved_stdin

  def assertError(self, error):
    self.assertEqual("""Status: 403 NOT-OKAY
Content-Type: application/json

{"error": "%s"}
""" % error, sys.stdout.getvalue())

  def assertSuccess(self, content):
    self.assertEqual("Content-Type: application/json\n\n%s\n" % content,
      sys.stdout.getvalue())

  @mock.patch('uci.get', mock.Mock(return_value = 'true'))
  def test_key_locked(self):
    uci.get = mock.Mock(return_value = 'true')
    with open(self.authorized_keys, 'w') as f:
      self.assertTrue(ssh_key.key_locked(self.authorized_keys))

  @mock.patch('uci.get', mock.Mock(return_value = None))
  def test_key_uploaded_no_login_not_locked(self):
    with open(self.authorized_keys, 'w') as f:
      self.assertFalse(ssh_key.key_locked(self.authorized_keys))

  @mock.patch('uci.get', mock.Mock(return_value = None))
  def test_key_not_uploaded_no_login_not_locked(self):
    self.assertFalse(ssh_key.key_locked(self.authorized_keys))

  @mock.patch('uci.get', mock.Mock(return_value = 'true'))
  def test_key_not_uploaded_but_login_success_not_locked(self):
    self.assertFalse(ssh_key.key_locked(self.authorized_keys))

  @mock.patch('uci.get', mock.Mock(return_value = None))
  def test_set_ssh_key(self):
    with self.assertRaises(SystemExit):
      ssh_key.jsonrpc_set_ssh_key({'params': [SMALL_KEY]},
        authorized_keys = self.authorized_keys)
    self.assertEqual(SMALL_KEY, open(self.authorized_keys).read())
    self.assertFalse(ssh_key.key_locked(self.authorized_keys))
    self.assertSuccess('{"comment": "my@address"}')

  @mock.patch('ssh_key.key_locked', mock.Mock(return_value = True))
  def test_set_ssh_key_already_locked(self):
    with self.assertRaises(SystemExit):
      ssh_key.jsonrpc_set_ssh_key({'params': [SMALL_KEY]},
        authorized_keys = self.authorized_keys)
    self.assertFalse(os.path.exists(self.authorized_keys))
    self.assertError('SSH key already stored and used. Cannot modify.')

  def test_set_ssh_key_private(self):
    with self.assertRaises(SystemExit):
      ssh_key.jsonrpc_set_ssh_key({
        'params': [ '-----BEGIN RSA PRIVATE KEY-----' ]
        }, authorized_keys = self.authorized_keys)
    self.assertFalse(os.path.exists(self.authorized_keys))
    self.assertError('That looks like a private key. Try ~/.ssh/id_rsa.pub')

  def test_set_ssh_key_multiline(self):
    with self.assertRaises(SystemExit):
      ssh_key.jsonrpc_set_ssh_key({
        'params': [ 'multiline\nssh\nkey' ]
        }, authorized_keys = self.authorized_keys)
    self.assertFalse(os.path.exists(self.authorized_keys))
    self.assertError('Multiline key not allowed.')

  def test_set_ssh_key_multiline(self):
    with self.assertRaises(SystemExit):
      ssh_key.jsonrpc_set_ssh_key({
        'params': [ INVALID_KEY ]
        }, authorized_keys = self.authorized_keys)
    self.assertFalse(os.path.exists(self.authorized_keys))
    self.assertError('SSH key did not match expected format '
      '\\"ssh-rsa <BASE64_KEY> COMMENT\\".')

  def test_get_key_info_empty(self):
    self.assertEqual({"exists": False},
      ssh_key.ssh_key_info(authorized_keys = self.authorized_keys))

  def test_get_key_info_exists(self):
    with open(self.authorized_keys, 'w') as f:
      f.write(SMALL_KEY)
    self.assertEqual(
      {"comment": "my@address",
       "locked": False,
       "exists": True,
       "contents": SMALL_KEY
      }, ssh_key.ssh_key_info(authorized_keys = self.authorized_keys))

  @mock.patch('ssh_key.key_locked', mock.Mock(return_value = True))
  def test_get_key_info_locked(self):
    with open(self.authorized_keys, 'w') as f:
      f.write(SMALL_KEY)
    self.assertEqual(
      {"comment": "my@address",
       "locked": True,
       "exists": True,
       "contents": SMALL_KEY
      }, ssh_key.ssh_key_info(authorized_keys = self.authorized_keys))

  def test_get_key_info_invalid(self):
    with open(self.authorized_keys, 'w') as f:
      f.write(INVALID_KEY)
    with self.assertRaises(SystemExit):
      ssh_key.ssh_key_info(authorized_keys = self.authorized_keys)
    self.assertError('Unrecognized SSH key format in %s' % self.authorized_keys)

if __name__ == '__main__':
  unittest.main()
