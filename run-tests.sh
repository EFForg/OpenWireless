#!/bin/bash -e
#
# Run the tests for OpenWireless. We highly recommend that you
# make this a git pre-push hook like so:
#
# ln -s ../../run-tests.sh .git/hooks/pre-push
#

# Install required packages
npm install
if [ -z "$VIRTUAL_ENV" ] ; then
  USER=--user
else
  USER=
fi
pip install $USER -qr requirements.txt

if ! make assert_templates_js_up_to_date ; then
  echo 'Error: templates.js out-of-date. Run `make app/js/templates.js`'
  exit 1
fi

/usr/bin/env python2.7 -m unittest discover -s test/ -p '*_test.py'
if which nodejs ; then
  NODEJS=nodejs
else
  NODEJS=node
fi

$NODEJS -e "require('grunt').tasks(['test']);"
