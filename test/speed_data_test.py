#!/usr/bin/env python2.7

import unittest, datetime, sys, os
sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "..", "routerapi"))

from speed_data import getSpeed

class SpeedDataTest(unittest.TestCase):
    def setUp(self):
        self.start_time = datetime.datetime.fromtimestamp(1403896884)
        self.start_time = datetime.datetime.now()

    def test_result(self):
        sample_data = {
            self.start_time : 10,
            self.start_time - datetime.timedelta(seconds=3) : 10,
            self.start_time - datetime.timedelta(microseconds=15) : 20,
            self.start_time - datetime.timedelta(milliseconds=15) : 20,
            self.start_time - datetime.timedelta(minutes=15) : 21.5,
            self.start_time - datetime.timedelta(minutes=5) : 27.5,
            self.start_time - datetime.timedelta(minutes=15) : 33.5
            }

        avg_speed = getSpeed(sample_data, 5)
        self.assertEqual(avg_speed, 15)

    def test_empty_result(self):
        sample_data = {}
        avg_speed = getSpeed(sample_data, 5)
        self.assertEqual(avg_speed, "N/A")

    def test_obsolete_result(self):
        sample_data = {
            self.start_time - datetime.timedelta(minutes=15) : 21.5,
            self.start_time - datetime.timedelta(minutes=5) : 27.5,
            self.start_time - datetime.timedelta(minutes=15) : 33.5
            }
        avg_speed = getSpeed(sample_data, 5)
        self.assertEqual(avg_speed, "N/A")

if __name__ == '__main__':
    unittest.main()

