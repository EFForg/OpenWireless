import json
import sys

def render_error(err, status=403):
  print 'Status: %d' % status
  print 'Content-Type: application/json\r\n'
  print json.JSONEncoder().encode({"error": err})
  sys.exit(0)

def exception_handler(exc_type, exc_obj, exc_tb):
  error_text = '%s: %s' % (exc_type.__name__, exc_obj.__str__())
  print 'Status: 500 Internal Server Error'
  print 'Content-Type: application/json'
  print
  print json.JSONEncoder().encode({"error": error_text})

sys.excepthook = exception_handler
