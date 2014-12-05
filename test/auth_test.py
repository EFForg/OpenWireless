#!/usr/bin/env python2.7
import unittest
import tempfile
import re
import os
import time
import sys
import StringIO

sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "..", "routerapi"))

import common
import auth
from mock import patch, call

class TestAuth(unittest.TestCase):
    def setUp(self):
        self.patcher = patch("audit.Audit")
        self.audit = self.patcher.start()
        self.path = tempfile.mkdtemp()
        os.chmod(self.path, 0700)
        self.auth = auth.Auth(self.path)
        self.auth_token = 'a3d9e77af80187d548e36a2d597005e3f23fab16'
        expiry = int(time.time()) + 86400
        with open(os.path.join(self.path, 'auth_token'), 'w') as f:
            f.write("%s %d" % (self.auth_token, expiry))
        os.environ.clear()

    def remove(self, filename):
        try:
            os.remove(os.path.join(self.path, filename))
        except OSError:
            pass

    def tearDown(self):
        self.remove('auth_token')
        self.remove('foo')
        self.remove('password')
        self.remove('rate_limit')
        os.rmdir(self.path)

    def test_check_sane(self):
        insane_path = tempfile.mkdtemp()
        os.chmod(insane_path, 0777)
        self.assertRaises(Exception, auth.Auth, insane_path)
        os.rmdir(insane_path)

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
        self.assertFalse(self.auth.save_password("2Short"))
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

    def test_check_request_logged_out(self):
        os.environ['REQUEST_URI'] = '/cgi-bin/routerapi/login'
        # Should not exit
        self.assertTrue(auth.check_request(self.path))

    def test_check_request_logged_out_auth_required(self):
        os.environ['REQUEST_URI'] = '/cgi-bin/routerapi/dashboard'

        out = StringIO.StringIO()
        saved_stdout = sys.stdout
        try:
            sys.stdout = out
            self.assertRaises(SystemExit, auth.check_request, self.path)
            self.assertEqual("""Status: 403 Forbidden
Content-Type: application/json
Set-Cookie: logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT
Set-Cookie: auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT
Set-Cookie: csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT

{"error": "Not authenticated."}
""",
                out.getvalue())
        finally:
            sys.stdout = saved_stdout

    def test_check_request_logged_in(self):
        os.environ['HTTP_COOKIE'] = 'auth=%s' % self.auth_token
        os.environ['REQUEST_URI'] = '/cgi-bin/routerapi/dashboard'
        # Should not exit
        self.assertTrue(auth.check_request(self.path))

    def test_check_request_logged_in_post_csrf(self):
        """A logged-in POST with no CSRF token present. Should fail."""
        os.environ['HTTP_COOKIE'] = 'auth=%s' % self.auth_token
        os.environ['REQUEST_URI'] = '/cgi-bin/routerapi/dashboard'
        os.environ['REQUEST_METHOD'] = 'POST'

        out = StringIO.StringIO()
        saved_stdout = sys.stdout
        try:
            sys.stdout = out
            self.assertRaises(SystemExit, auth.check_request, self.path)
            self.assertEqual("""Status: 403 NOT-OKAY
Content-Type: application/json

{"error": "Invalid CSRF token."}
""",
                out.getvalue())
        finally:
            sys.stdout = saved_stdout

    def test_check_request_logged_in_valid_post(self):
        os.environ['HTTP_COOKIE'] = 'auth=%s' % self.auth_token
        os.environ['REQUEST_URI'] = '/cgi-bin/routerapi/dashboard'
        os.environ['REQUEST_METHOD'] = 'POST'
        os.environ['HTTP_X_CSRF_TOKEN'] = self.auth.get_csrf_token()
        # Should not exit
        self.assertTrue(auth.check_request(self.path))

    def test_logout_headers(self):
        self.assertEqual("""Set-Cookie: logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT
Set-Cookie: auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT
Set-Cookie: csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT
""",
                self.auth.logout_headers())

    def test_login_headers(self):
        tokens = auth.Tokens(auth_token = "foo", csrf_token = "bar")
        os.environ["HTTPS"] = "True"
        cookies = self.auth.login_headers(tokens)
        expected_cookies = ('Set-Cookie: logged_in=true; path=/\n'
            'Set-Cookie: auth=foo; path=/; HttpOnly; secure;\n'
            'Set-Cookie: csrf_token=bar; path=/; secure;\n')
        self.assertEquals(cookies, expected_cookies)

    def test_login_headers_can_be_unsecure(self):
        tokens = auth.Tokens(auth_token = "foo", csrf_token = "bar")
        cookies = self.auth.login_headers(tokens)
        expected_cookies = ('Set-Cookie: logged_in=true; path=/\n'
            'Set-Cookie: auth=foo; path=/; HttpOnly;\n'
            'Set-Cookie: csrf_token=bar; path=/;\n')
        self.assertEquals(cookies, expected_cookies)

    def test_successful_authentication(self):
        self.auth.save_password('foobarbaz')
        tokens = self.auth.authenticate('foobarbaz', "address")
        self.assertTrue(self.auth.is_authentication_token(tokens.auth_token))
        self.assertTrue(self.auth.is_csrf_token(tokens.csrf_token))

    def test_invalid_password(self):
        self.auth.save_password('foobarbaz')
        tokens = self.auth.authenticate('totally not foobarbaz', "address")
        self.assertIsNone(tokens)

    def test_authentication_should_write_audit_record(self):
        self.auth.save_password('foobarbaz')
        self.auth.authenticate('foobarbaz', "address")

        self.assertEquals(self.audit.method_calls, [call.record_login("address")])

if __name__ == '__main__':
    unittest.main()
