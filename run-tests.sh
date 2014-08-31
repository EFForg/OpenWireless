#!/bin/bash -e
#
# Run the tests for OpenWireless. We highly recommend that you
# make this a git pre-push hook like so:
#
# ln -s ../../run-tests.sh .git/hooks/pre-push
#

# NOTE: Once all machines have been updated to use the Makefile
# directly, remove this script.
make test
