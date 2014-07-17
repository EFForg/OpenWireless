"""
Methods used by many scripts in the routerapi.

All endpoints should import common. In addition to the automatic exception
handler, they will be checked for authentication cookies and CSRF token.
There are a handful of exceptions enumerated in auth.py.
"""
import sys
import json
import os
import subprocess
import traceback

# When running under local-lighttpd, we expect to receive a single path for
# modules that overrides default implementations. For instance, we override
# uci.py with a copy that stores results in a JSON file.
# By search path semantics, normally uci.py in this directory would be preferred
# during imports, since same-directory imports come before PYTHONPATH:
# https://docs.python.org/2/tutorial/modules.html#the-module-search-path
# So we have to specifically insert the override path at the beginning of
# sys.path.
if 'OVERRIDE_ETC' in os.environ:
  sys.path.insert(0, os.environ['OVERRIDE_PATH'])

import run

# The web server can pass an environment variable to change where this script
# treats as /etc. This is useful for integration testing without a router.
def get_etc():
  return os.environ.get('OVERRIDE_ETC', '/etc')

def reset_wifi():
    run.check_output(["/usr/bin/sudo", "/sbin/wifi", "reload"])

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
    # It's dangerous to return anything other than a dict as JSON output.
    # For instance, if you render ["sensitive-data"], it may be possible on some
    # browsers for an attacker to include the JSON data as Javascript and get the
    # data. See
    # haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
    if type(data) != dict:
        render_error("Tried to render non-dict as JSON output")
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
# Importing auth forces checking of auth token and CSRF token.
import auth
