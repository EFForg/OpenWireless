# Importing common gets us a global uncaught exception handler
# that prints useful information as CGI output.
import common
# Importing auth ensures that all endpoints require authentication
# unless explicitly excepted.
import auth
