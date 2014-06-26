#!/usr/bin/python
#
# Authentication module.
#
# Contains: Password checking, authentication token checking,
# auth_token rotation and expiration, rate limiting.

import bcrypt
import time
import os

def constant_time_equals(a, b):
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

  def __init__(self, path):
    self.path = path
    self.token_filename = os.path.join(self.path, 'auth_token')
    self.password_filename = os.path.join(self.path, 'password')
    self.check_sane(path)

  def check_sane(self, path):
    st = os.stat(path)
    mode = st.st_mode
    if st.st_uid != os.getuid():
      raise Exception('Auth dir %s not owned by user %d.' % (path, os.getuid()))
    # Mode 16832 is equal to (stat.S_IFDIR | stat.S_IRWXU)
    # In other words, a directory with mode bits rwx------
    if st.st_mode != 16832:
      raise Exception('Auth dir %s not a dir or wrong permissions.' % path)

  def write(self, filename, data):
    fd = os.open(filename, os.O_WRONLY | os.O_CREAT, 0600)
    os.write(fd, data)
    os.close(fd)

  def is_password(self, candidate):
    with open(self.password_filename, 'r') as f:
      hashed = f.read()
    return bcrypt.checkpw(candidate, hashed)

  def save_password(self, new_password):
    hashed = bcrypt.hashpw(new_password, bcrypt.gensalt(10))
    self.write(self.password_filename, hashed)

  def __current_authentication_token(self):
    with open(self.token_filename, 'r') as f:
      (stored_token, expires) = f.read().split(' ')
    t = time.time()
    if int(expires) > t:
      return stored_token
    else:
      return None

  def __valid_token(self, token):
    if len(token) != self.TOKEN_LENGTH * 2:
      return False
    for c in token:
      if c not in '01234567890abcdef':
        return False
    return True

  def is_authentication_token(self, candidate):
    current_token = self.__current_authentication_token()
    # TODO: Add expiry checking
    if (current_token and
        self.__valid_token(current_token) and
        self.__valid_token(candidate) and
        constant_time_equals(current_token, candidate)):
      return True
    else:
      return False
    pass

  def regenerate_authentication_token(self):
    random_bytes = bytearray(os.urandom(self.TOKEN_LENGTH))
    new_token = ''.join('%02x' % b for b in random_bytes)
    expires = int(time.time()) + Auth.SESSION_DURATION
    self.write(self.token_filename, ('%s %d' % (new_token, expires)))
    return new_token

if __name__ == '__main__':
  pass
