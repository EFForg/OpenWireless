import json
import sys

def render_error(err):
  print "Content-Type: application/json\r\n"
  print json.JSONEncoder().encode({"error": err})
  sys.exit(0)

def exception_handler(exc_type, exc_obj, exc_tb):
  render_error('%s: %s' % (exc_type.__name__, exc_obj.__str__()))

sys.excepthook = exception_handler
