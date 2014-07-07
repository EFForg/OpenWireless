pip install --user -qr requirements.txt
python -m unittest discover -s test/ -p '*_test.py'
npm install
npm test
