#!/usr/bin/python
import unittest
import tempfile
import os
import time

import sys
sys.path.insert(0, './routerapi/')

import auth

class TestAuth(unittest.TestCase):
  def setUp(self):
    self.path = tempfile.mkdtemp()
    os.chmod(self.path, 0700)
    self.auth = auth.Auth(self.path)

  def test_check_sane(self):
    insane_path = tempfile.mkdtemp()
    os.chmod(insane_path, 0777)
    self.assertRaises(Exception, auth.Auth, insane_path)

  def test_equal(self):
    self.assertTrue(auth.constant_time_equals("alpha", "alpha"))

  def test_length_differs(self):
    self.assertFalse(auth.constant_time_equals("alpha", "alph"))

  def test_inequal(self):
    self.assertFalse(auth.constant_time_equals("alpha", "beta"))

  def test_password(self):
    self.auth.save_password("Passw0rd")
    self.assertTrue(os.path.isfile(os.path.join(self.path, "password")))
    self.assertTrue(self.auth.is_password("Passw0rd"))
    self.assertFalse(self.auth.is_password("badpass"))

  def test_password(self):
    self.auth.save_password("Passw0rd")
    self.assertTrue(os.path.isfile(os.path.join(self.path, "password")))
    self.assertTrue(self.auth.is_password("Passw0rd"))

  def test_write(self):
    filename = os.path.join(self.path, "foo")
    self.auth.write(filename, "bar")
    self.assertTrue(os.path.exists(filename))
    self.assertTrue(os.stat(filename).st_mode == 33152)
    with open(filename) as f:
      self.assertEqual("bar", f.read())

  def test_is_authentication_token(self):
    filename = self.auth.token_filename
    with open(filename, "w") as f:
      f.write("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa %d" %
                (time.time() + 86555))
    self.assertTrue(self.auth.is_authentication_token(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))
    self.assertFalse(self.auth.is_authentication_token(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab"))

  def test_expired_authentication_token(self):
    filename = self.auth.token_filename
    with open(filename, "w") as f:
      f.write("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa %d" %
        (time.time() - 100))
    self.assertFalse(self.auth.is_authentication_token(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))

  def test_regenerate_authentication_token(self):
    token = self.auth.regenerate_authentication_token()
    filename = self.auth.token_filename
    with open(filename, "r") as f:
      (read_token, expiry) = f.read().split(' ')
      self.assertEqual(token, read_token)
    self.assertTrue(self.auth.is_authentication_token(token))

if __name__ == '__main__':
  unittest.main()
