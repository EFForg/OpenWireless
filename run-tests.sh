#!/bin/bash -e
pip install --user -r requirements.txt
python -m unittest discover -s test/ -p '*_test.py'
npm install
npm test
