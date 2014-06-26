#!/usr/bin/python

# Tests can be run from top-level directory with
# python -m unittest discover -s test
import sys
sys.path.insert(0, './routerapi/')

import unittest, datetime
from speed_data import getSpeed

class SpeedDataTest(unittest.TestCase):


  def test_result(self):

    sample_data = {
      datetime.datetime.now() : 10,
      datetime.datetime.now()- datetime.timedelta(seconds=3) : 10,
      datetime.datetime.now()- datetime.timedelta(microseconds=15) : 20,
      datetime.datetime.now()- datetime.timedelta(milliseconds=15) : 20,
      datetime.datetime.now()- datetime.timedelta(minutes=15) : 21.5,
      datetime.datetime.now()- datetime.timedelta(minutes=5) : 27.5,
      datetime.datetime.now()- datetime.timedelta(minutes=15) : 33.5
      }

    avg_speed = getSpeed(sample_data, 5)
    self.assertTrue(avg_speed == 15)

  def test_empty_result(self):
    sample_data = {}
    avg_speed = getSpeed(sample_data, 5)
    self.assertTrue(avg_speed == "N/A")

  def test_obsolete_result(self):
    sample_data = {
      datetime.datetime.now()- datetime.timedelta(minutes=15) : 21.5,
      datetime.datetime.now()- datetime.timedelta(minutes=5) : 27.5,
      datetime.datetime.now()- datetime.timedelta(minutes=15) : 33.5
      }
    avg_speed = getSpeed(sample_data, 5)
    self.assertTrue(avg_speed == "N/A")

if __name__ == '__main__':
  unittest.main()

