#!/usr/bin/python
import common
from subprocess import check_output

uci_path = '/sbin/uci'

def get(*args):
  args = list(args)
  args.insert(0, "get")
  run(args)

def set(*args):
  args = list(args)
  args.insert(0, "set")
  run(args)

def commit(*args):
  args = list(args)
  args.insert(0, "commit")
  run(args)

def check_nulls(string):
  if string.find('\00') != -1:
    raise Exception('Invalid input: contains null bytes')

def run(args_list):
  args_list.insert(0, uci_path)
  map(check_nulls, args_list)
  return check_output(args_list).strip()
