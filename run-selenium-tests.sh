#!/bin/bash -e

env/bin/python -m unittest discover -s selenium/ -p '*_test.py'
