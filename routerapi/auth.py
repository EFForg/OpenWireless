"""
Authentication module.

Password checking and update, authentication token checking,
authentication token rotation and expiration.

This module is auto-imported by __init__.py and provides authentication
checking to all scripts by default. Only a few scripts explicitly listed
below are exempt.

If you need to manually reset the administrator password to '1234', run:

echo -n '$p5k2$37$qKJc7Nma$sdWXq2XCicPdW1KnbKipGSTGqxszqPrx' \
        > /etc/auth/password

If you've exceeded the rate limit for failed logins, reset it with:

rm /etc/auth/password.
"""

import hashlib
import json
import os
import sys
import time

import pbkdf2

import common

REQUEST_URI = 'REQUEST_URI'
REQUEST_METHOD = 'REQUEST_METHOD'
LOGGED_OUT_ENDPOINTS = [
    '/cgi-bin/routerapi/login',
    '/cgi-bin/routerapi/change_password_first_time',
    '/cgi-bin/routerapi/setup_state'
]

def default_path():
    """
    The default path for auth files.

    Since auth is imported by common, not all functions from common are available
    yet, so we have to duplicate common.get_etc().
    """
    return os.path.join(os.environ.get('OVERRIDE_ETC', '/etc'), 'auth')

def check_request(auth_dir = default_path()):
    """
    When processing a CGI request, validate that request is authenticated and, if
    it's a POST request, has a CSRF token.
    """
    if (REQUEST_URI in os.environ and
            not os.environ[REQUEST_URI] in LOGGED_OUT_ENDPOINTS):
        a = Auth(auth_dir)
        a.check_authentication()
        if REQUEST_METHOD in os.environ and os.environ[REQUEST_METHOD] == "POST":
            a.check_csrf()
    return True

def constant_time_equals(a, b):
    """Return True iff a == b, and do it in constant time."""
    a = bytearray(a)
    b = bytearray(b)
    if len(a) != len(b):
        return False

    result = 0
    for x, y in zip(a, b):
        result |= x ^ y
    return result == 0

class Auth:
    """Password setting/checking, authentication tokens, and CSRF prevention."""
    SESSION_DURATION = 86400 # One day in seconds
    TOKEN_LENGTH = 20 # number of random bytes, pre-hex encoding
    AUTH_COOKIE_NAME = 'auth'
    CSRF_COOKIE_NAME = 'csrf_token'
    HTTP_X_CSRF_TOKEN = 'HTTP_X_CSRF_TOKEN'
    RATE_LIMIT_DURATION = 86400 # One day in seconds
    RATE_LIMIT_COUNT = 10
    LOGGED_IN_COOKIE_NAME = 'logged_in'

    def __init__(self, path = default_path()):
        self.path = path
        self.token_filename = os.path.join(self.path, 'auth_token')
        self.password_filename = os.path.join(self.path, 'password')
        self.rate_limit_filename = os.path.join(self.path, 'rate_limit')
        if not os.path.isdir(self.path):
            os.mkdir(self.path, 0700)
        self.check_sane()

    def check_sane(self):
        """
        Check that the authentication data directory is owned by current user,
        with safe permissions. throw exception if not.
        """
        st = os.stat(self.path)
        if st.st_uid != os.getuid():
            raise Exception('Auth dir %s not owned by user %d.' % (
                self.path, os.getuid()))
        # Mode 16832 is equal to (stat.S_IFDIR | stat.S_IRWXU)
        # In other words, a directory with mode bits rwx------
        if st.st_mode != 16832:
            raise Exception('Auth dir %s not a dir or wrong permissions.' % self.path)

    def write(self, filename, data):
        """
        Save data into file, with mode bits rw-------.
        """
        owner_rw = 0600
        fd = os.open(filename, os.O_WRONLY | os.O_CREAT, owner_rw)
        # In case file existed already with wrong permissions, fix them.
        os.chmod(filename, owner_rw)
        os.write(fd, data)
        os.close(fd)

    def rate_limit_remaining(self):
        """
        Return the number of failed passwords the can be entered before
        logins attempts are disabled for a day.

        The rate limit information is stored as a count of failed attempts so far.

        If there have been no failed attempts, or they were more than a day ago,
        treat that as zero failed attempts.
        """
        if os.path.isfile(self.rate_limit_filename):
            st = os.stat(self.rate_limit_filename)
            if time.time() - st.st_ctime > self.RATE_LIMIT_DURATION:
                return self.RATE_LIMIT_COUNT
            else:
                with open(self.rate_limit_filename, 'r') as f:
                    failed_login_attempts = int(f.read())
                return max(0, self.RATE_LIMIT_COUNT - failed_login_attempts)
        else:
            return self.RATE_LIMIT_COUNT

    def increment_rate_limit(self):
        """On failed login attempt, increment the number of failed attempts."""
        attempts = self.RATE_LIMIT_COUNT - self.rate_limit_remaining()
        attempts += 1
        self.write(self.rate_limit_filename, "%d" % attempts)

    def password_exists(self):
        """Return whether a password file exists."""
        return os.path.isfile(self.password_filename)

    def is_password(self, candidate):
        """
        Returns true iff the candidate password equals the stored one.
        """
        if self.rate_limit_remaining() > 0:
            with open(self.password_filename, 'r') as f:
                hashed = f.read().strip()
            b_valid = bytearray(hashed)
            b_guess = bytearray(pbkdf2.crypt(candidate, unicode(hashed)), 'utf-8')
            if constant_time_equals(b_valid, b_guess):
                return True
            else:
                # Increment rate limit on failures.
                self.increment_rate_limit()
                return False
        else:
            common.render_error('Too many failed login attempts. Try again tomorrow.')

    def save_password(self, new_password):
        """
        Store a new password.
        """
        # 55 iterations takes about 100 ms on a Netgear WNDR3800 or about 8ms on a
        # Core2 Duo at 1200 MHz.
        hashed = pbkdf2.crypt(new_password, iterations=55)
        self.write(self.password_filename, hashed)

    def get_csrf_token(self):
        """
        Generate a CSRF prevention token. We derive this token as the SHA256 hash
        of the auth token, which ensures the two are bound together, preventing
        cookie forcing attacks.

        Returns a valid CSRF prevention token.
        """
        h = hashlib.new('sha256')
        h.update(self.__current_authentication_token())
        return h.hexdigest()

    def is_csrf_token(self, candidate_csrf_token):
        """
        Validate a presented CSRF token. Note that we validate by re-hashing the
        auth_token, rather than comparing directly to the csrf_token cookie. This
        prevents cookie forcing by requiring that the auth token and CSRF token be
        related.
        """
        valid_token = bytearray(self.get_csrf_token())
        candidate = bytearray(candidate_csrf_token)
        return constant_time_equals(valid_token, candidate)

    def check_csrf(self):
        """
        Get a CSRF token from CGI request headers and validate it. If validation
        fails, render an error and exit early.

        In our current JSONRPC style, we can send custom headers, so we look for the
        CSRF token in a header. We may switch to a form-submission-based approach,
        in which case we would need to update this code to look for a CSRF token in
        the POST parameters.
        """
        if (self.HTTP_X_CSRF_TOKEN in os.environ and
                self.is_csrf_token(os.environ[self.HTTP_X_CSRF_TOKEN])):
            pass
        else:
            common.render_error('Invalid CSRF token.')

    def login_headers(self):
        """
        Return the HTTP headers required to log the user in. Specifically, set the
        auth cookie, the csrf token cookie, and an unsecured cookie logged_in=true,
        indicating the user is logged in even if the current request context doesn't
        have the auth cookies. The server should redirect users with the logged-in
        cookie to the HTTPS version of the site.

        Calling this method immediately regenerates the stored auth token,
        invalidating other active sessions.
        """
        auth_token = self.regenerate_authentication_token()
        csrf_token = self.get_csrf_token()
        # Set the secure flag on the cookie if the login occurred over HTTPS.
        secure = ''
        if 'HTTPS' in os.environ:
            secure = ' secure;'
        return ('Set-Cookie: %s=true; path=/\n'
                        'Set-Cookie: %s=%s; path=/; HttpOnly;%s\n'
                        'Set-Cookie: %s=%s; path=/;%s\n' % (
                        self.LOGGED_IN_COOKIE_NAME,
                        self.AUTH_COOKIE_NAME, auth_token, secure,
                        self.CSRF_COOKIE_NAME, csrf_token, secure))

    def logout_headers(self):
        """
        Return the HTTP headers required to log the user out.

        Specifically, delete and invalidate the auth token and CSRF token.
        """
        self.regenerate_authentication_token()
        return ('Set-Cookie: %s=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT\n'
                        'Set-Cookie: %s=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT\n'
                        'Set-Cookie: %s=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT\n' % (
                        self.LOGGED_IN_COOKIE_NAME, self.AUTH_COOKIE_NAME,
                        self.CSRF_COOKIE_NAME))

    def __current_authentication_token(self):
        """Return the current authentication token if it still valid, else None."""
        if os.path.isfile(self.token_filename):
            with open(self.token_filename, 'r') as f:
                (stored_token, expires) = f.read().split(' ')
            t = time.time()
            if int(expires) > t:
                return stored_token
        return None

    def __valid_token_format(self, token):
        """Basic length and character checking on tokens."""
        if len(token) != self.TOKEN_LENGTH * 2:
            return False
        for c in token:
            if c not in '01234567890abcdef':
                return False
        return True

    def is_authentication_token(self, candidate):
        """Return true iff candidate authentication token matches stored one."""
        current_token = self.__current_authentication_token()
        # TODO: Add expiry checking
        if (current_token and
                self.__valid_token_format(current_token) and
                self.__valid_token_format(candidate) and
                constant_time_equals(current_token, candidate)):
            return True
        else:
            return False

    def regenerate_authentication_token(self):
        """
        Create and store a new random authentication token. Expires old sessions.
        """
        new_token = os.urandom(self.TOKEN_LENGTH).encode('hex')
        expires = int(time.time()) + Auth.SESSION_DURATION
        self.write(self.token_filename, ('%s %d' % (new_token, expires)))
        return new_token

    def check_authentication(self):
        """
        In the context of a CGI request, check whether an authentication
        cookie is present and valid. If not, render an error.
        """
        try:
            cookies = os.environ['HTTP_COOKIE'].split('; ')
        except KeyError:
            cookies = []
        for c in cookies:
            prefix = Auth.AUTH_COOKIE_NAME + '='
            if (c.startswith(prefix) and
                    self.is_authentication_token(c[len(prefix):])):
                return True
        print 'Status: 403 Forbidden'
        print 'Content-Type: application/json'
        print self.logout_headers()
        print json.JSONEncoder().encode({'error': 'Not authenticated.'})
        sys.exit(1)

check_request()
