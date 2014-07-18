#!/bin/bash -e

python -m unittest discover -s selenium/ -p '*_test.py'
