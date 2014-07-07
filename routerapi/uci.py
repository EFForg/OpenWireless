#!/usr/bin/python
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

def run(args_list):
  args_list.insert(0, uci_path)
  return check_output(args_list).strip()
