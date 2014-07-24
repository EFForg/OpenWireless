#!/usr/bin/env python2.7
import unittest
import os
import sys


routerapi = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    '..', 'routerapi')

js = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    '..', 'app/js')

class TestCompiles(unittest.TestCase):
    """Verify that every Python file in routerapi compiles."""
    def test_compile(self):
        for filename in os.listdir(routerapi):
            # Exclude dotfiles (e.g. Vim swap files) and *c (e.g. .pyc, or
            # fooc for script foo.
            if (not filename.startswith('.') and not filename.endswith('c')
                and not os.path.isdir(os.path.join(routerapi, filename))):
                with open(os.path.join(routerapi, filename), 'r') as f:
                    contents = f.read()
                    compile(contents, filename, 'exec')
                    self.assertFalse('\t' in contents,
                                     msg = 'Tab found in %s, use spaces instead.' % filename)

    def test_notabs_js(self):
        for filename in os.listdir(js):
            if not filename.startswith('.') and not filename == 'templates.js':
                with open(os.path.join(js, filename), 'r') as f:
                    self.assertFalse('\t' in f.read(),
                        msg = 'Tab found in %s, use spaces instead.' % filename)

if __name__ == '__main__':
    unittest.main()
