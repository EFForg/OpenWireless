#!/bin/bash -e
#
# Run the tests for OpenWireless. We highly recommend that you
# make this a git pre-push hook like so:
#
# ln -s ../../run-tests.sh .git/hooks/pre-push
#
JS=app/js/templates.js
TEMPLATES=app/templates
if [ ! -z "`find $TEMPLATES -newer $JS`" ] ; then
  echo "Error: templates.js out-of-date. Run ./make-templates.sh"
  exit 1
fi
pip install --user -qr requirements.txt
python -m unittest discover -s test/ -p '*_test.py'
npm install
npm test
