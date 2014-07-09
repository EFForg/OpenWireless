#!/usr/bin/python
import unittest
import os
import sys


routerapi = os.path.join(
  os.path.dirname(os.path.realpath(__file__)),
  "..", "routerapi")

class TestCompiles(unittest.TestCase):
  """Verify that every Python file in routerapi compiles."""
  def test_compile(self):
    for filename in os.listdir(routerapi):
      # Exclude dotfiles (e.g. Vim swap files) and *c (e.g. .pyc, or
      # fooc for script foo.
      if not filename.startswith(".") and not filename.endswith("c"):
        with open(os.path.join(routerapi, filename), "r") as f:
          compile(f.read(), filename, "exec")

if __name__ == '__main__':
  unittest.main()
