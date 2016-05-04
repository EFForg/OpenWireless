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

make

scripts/unit
if which nodejs ; then
  NODEJS=nodejs
else
  NODEJS=node
fi

$NODEJS -e "require('grunt').tasks(['test']);"
