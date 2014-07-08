import json
import sys
import traceback
import auth

def render_error(err, status=403):
  print 'Status: %d NOT-OKAY' % status
  print 'Content-Type: application/json'
  print
  print json.JSONEncoder().encode({"error": err})
  sys.exit(0)

def render_success(data):
  render_success_no_exit(data)
  sys.exit(0)

def render_success_no_exit(data):
  print 'Content-Type: application/json'
  print
  print json.JSONEncoder().encode(data)

def exception_handler(exc_type, exc_obj, exc_tb):
  error_text = '%s: %s, %s' % (
    exc_type.__name__, exc_obj.__str__(),
    traceback.format_tb(exc_tb))
  print 'Status: 500 Internal Server Error'
  print 'Content-Type: application/json'
  print
  print json.JSONEncoder().encode({"error": error_text})
  sys.exit(0)

sys.excepthook = exception_handler

# All endpoints should import common. In addition to the automatic exception
# handler, they will be checked for authentication cookies and CSRF token.
# There are a handful of exceptions enumerated in auth.py.
auth.check_request('/etc/auth')
