#!/bin/bash -e
#
# Run the tests for OpenWireless. We highly recommend that you
# make this a git pre-push hook like so:
#
# ln -s ../../run-tests.sh .git/hooks/pre-push
#

# Install required packages
npm install
pip install --user -qr requirements.txt

if ! ./make-templates.sh --is-updated ; then
  echo "Error: templates.js out-of-date. Run ./make-templates.sh"
  exit 1
fi
python -m unittest discover -s test/ -p '*_test.py'
npm test
