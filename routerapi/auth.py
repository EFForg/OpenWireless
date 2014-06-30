#!/usr/bin/python
"""
   Authentication module.

   Password checking and update, authentication token checking,
   authentication token rotation and expiration.

   This module is auto-imported by __init__.py and provides authentication
   checking to all scripts by default. Only /login, explicitly listed below, is
   exempt.
"""

#import bcrypt
import common
import os
import time
import hashlib

def check_request():
  """
  When processing a CGI request, validate that request is authenticated and, if
  it's a POST request, has a CSRF token.
  """
  REQUEST_URI = 'REQUEST_URI'
  REQUEST_METHOD = 'REQUEST_METHOD'
  LOGGED_OUT_ENDPOINTS = ['/cgi-bin/routerapi/login']
  if (REQUEST_URI in os.environ and
      not os.environ[REQUEST_URI] in LOGGED_OUT_ENDPOINTS):
    try:
      a = Auth('/etc/auth')
      a.check_authentication()
      if REQUEST_METHOD in os.environ and os.environ[REQUEST_METHOD] == "POST":
        a.check_csrf()
    except Exception, e:
      common.render_error(e.__str__())

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
  SESSION_DURATION = 86400 # One day in seconds
  TOKEN_LENGTH = 20 # number of random bytes, pre-hex encoding
  AUTH_COOKIE_NAME = 'auth'
  CSRF_COOKIE_NAME = 'csrf_token'
  HTTP_X_CSRF_TOKEN = 'HTTP_X_CSRF_TOKEN'
  def __init__(self, path):
    self.path = path
    self.token_filename = os.path.join(self.path, 'auth_token')
    self.password_filename = os.path.join(self.path, 'password')
    self.check_sane(path)

  def check_sane(self, path):
    """
    Check that the authentication data directory is owned by current user,
    with safe permissions. throw exception if not.
    """
    st = os.stat(path)
    mode = st.st_mode
    if st.st_uid != os.getuid():
      raise Exception('Auth dir %s not owned by user %d.' % (path, os.getuid()))
    # Mode 16832 is equal to (stat.S_IFDIR | stat.S_IRWXU)
    # In other words, a directory with mode bits rwx------
    if st.st_mode != 16832:
      raise Exception('Auth dir %s not a dir or wrong permissions.' % path)

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

  def is_password(self, candidate):
    """
    Returns true iff the candidate password equals the stored one.
    """
    with open(self.password_filename, 'r') as f:
      hashed = f.read()
    # Temporarily commented out until bcrypt available on router
    #return bcrypt.checkpw(candidate, hashed)
    return candidate == hashed

  def save_password(self, new_password):
    """
    Store a new password.
    """
    # Temporarily commented out until bcrypt available on router
    #hashed = bcrypt.hashpw(new_password, bcrypt.gensalt(10))
    hashed = new_password
    self.write(self.password_filename, hashed)

  def get_csrf_token(self, auth_token):
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
    return constant_time_equals(
      self.get_csrf_token(self.__current_authentication_token),
      candidate_csrf_token)

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
    Output the HTTP headers required to log the user in. Specifically, set the
    auth cookie and the csrf token cookie.

    Calling this method immediately regenerates the stored auth token,
    invalidating other active sessions.
    """
    auth_token = self.regenerate_authentication_token()
    csrf_token = self.get_csrf_token(auth_token)
    # Set the secure flag on the cookie if the login occurred over HTTPS.
    secure = ''
    if 'HTTPS' in os.environ:
      secure = ' secure;'
    print 'Set-Cookie: %s=%s; path=/; HttpOnly;%s' % (
      self.AUTH_COOKIE_NAME, auth_token, secure)
    print 'Set-Cookie: %s=%s; path=/;%s' % (
      self.CSRF_COOKIE_NAME, csrf_token, secure)

  def __current_authentication_token(self):
    """Return the current authentication token if it still valid, else None."""
    with open(self.token_filename, 'r') as f:
      (stored_token, expires) = f.read().split(' ')
    t = time.time()
    if int(expires) > t:
      return stored_token
    else:
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
    pass

  def regenerate_authentication_token(self):
    """
    Create and store a new random authentication token. Expires old sessions.
    """
    random_bytes = bytearray(os.urandom(self.TOKEN_LENGTH))
    new_token = ''.join('%02x' % b for b in random_bytes)
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
    common.render_error('Not authenticated.')
