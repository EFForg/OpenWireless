#!/usr/bin/env python2.7

import unittest, sys, os

sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "..", "routerapi"))

import gen_tz_dictionary

class genTzDictionaryTest(unittest.TestCase):

    def test_get_zone_info(self):
        tzd = gen_tz_dictionary.get_zone_info()
        self.assertTrue(type(tzd) is dict)
        self.assertTrue(len(tzd) > 1)
        self.assertEqual(tzd["America/Los_Angeles"], "PST8PDT,M3.2.0,M11.1.0")

        self.assertFalse(gen_tz_dictionary.get_zone_info("/does/not/exist"))


    def test_read_posix_zone(self):
        posix_zone = gen_tz_dictionary.read_posix_zone("America/Los_Angeles")
        self.assertEqual(posix_zone, "PST8PDT,M3.2.0,M11.1.0")

        with self.assertRaises(EnvironmentError):
            gen_tz_dictionary.read_posix_zone("Fake/Zone")


if __name__ == '__main__':
    unittest.main()

