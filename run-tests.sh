#!/bin/bash -e
pip install --user -qr requirements.txt
python -m unittest discover -s test/ -p '*_test.py'
npm install
npm test
