#!/bin/bash -e
#
# Run the tests for OpenWireless. We highly recommend that you
# make this a git pre-push hook like so:
#
# ln -s ../../run-tests.sh .git/hooks/pre-push
#

# Install required packages
npm install
if [ ! -z "$PYTHONPATH" ] ; then
  pip install --user -qr requirements.txt
else
  # When running on snap-ci we are in a --no-site-packages virtualenv,
  # so pip install --user would fail.
  pip install -qr requirements.txt
fi

if ! ./make-templates.sh --is-updated ; then
  echo "Error: templates.js out-of-date. Run ./make-templates.sh"
  exit 1
fi
/usr/bin/env python2.7 -m unittest discover -s test/ -p '*_test.py'
if which nodejs ; then
  NODEJS=nodejs
else
  NODEJS=node
fi

$NODEJS -e "require('grunt').tasks(['test']);"
