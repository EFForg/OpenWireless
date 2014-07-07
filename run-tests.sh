#!/bin/bash -e
#
# Run the tests for OpenWireless. We highly recommend that you
# make this a git pre-push hook like so:
#
# ln -s ../../run-tests.sh .git/hooks/pre-push
#
pip install --user -qr requirements.txt
python -m unittest discover -s test/ -p '*_test.py'
npm install
npm test
