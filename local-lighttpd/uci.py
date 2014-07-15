"""
Override implementation for routerapi/uci.py when running local-lighttpd.
Instead of calling out to /sbin/uci, which probably doesn't exist, store
name-value pairs in a JSON file in OVERRIDE_ETC.
"""
import json
import os

import common

uci_path = os.path.join(common.get_etc(), 'uci.json')
try:
  with open(uci_path) as f:
    data = json.loads(f.read())
except IOError:
  data = {}

def get(name):
  validate(name)
  return data.get(name)

def set(name, value):
  validate(name)
  validate(value)
  data[name] = value

def commit(namespace):
  with open(uci_path, 'w') as f:
    f.write(json.dumps(data))

def validate(string):
  if len(string) > 200:
    raise Exception('String input to UCI too long.')
  if string.find('\00') != -1:
    raise Exception('Invalid input: contains null bytes.')
