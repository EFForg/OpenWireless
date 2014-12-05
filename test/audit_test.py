import unittest
import sys
import os
from datetime import datetime

import mock

sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "..", "routerapi"))

import audit
from fake_uci import FakeUci

class AuditTest(unittest.TestCase):
    def setUp(self):
        self.uci = FakeUci()
        self.audit = audit.Audit(self.uci)

    def test_previous_login_with_none(self):
        self.assertEquals(None, self.audit.previous_login())

    def test_last_login_with_none(self):
        self.assertEquals(None, self.audit.last_login())

    def test_previous_login_with_some(self):
        self.uci.data = {
            audit.previous_login_ip: '10.0.0.1',
            audit.previous_login_timestamp: '1970-01-01T00:00:00',
        }

        expected = {'address': '10.0.0.1', 'timestamp': datetime.utcfromtimestamp(0)}
        self.assertEquals(expected, self.audit.previous_login())

    def test_last_login_with_some(self):
        self.uci.data = {
            audit.last_login_ip: '10.0.0.1',
            audit.last_login_timestamp: '1970-01-01T00:00:00',
        }
        expected = {'address': '10.0.0.1', 'timestamp': datetime.utcfromtimestamp(0)}
        self.assertEquals(expected, self.audit.last_login())

    def test_record_login_sets_previous_login_to_last_login(self):
        self.uci.data = {
            audit.last_login_ip: '10.0.0.1',
            audit.last_login_timestamp: '1970-01-01T00:00:00',
        }
        last_login = self.audit.last_login()
        self.audit.record_login('10.0.0.1', datetime.utcnow())
        self.assertEquals(last_login, self.audit.previous_login())

    def test_sets_last_login_to_provided_address(self):
        timestamp = datetime.utcfromtimestamp(0)
        self.audit.record_login('10.0.0.1', timestamp)
        self.assertEquals({'address': '10.0.0.1', 'timestamp': timestamp}, self.audit.last_login())

    @mock.patch("audit.datetime")
    def test_time_defaulting(self, mock_datetime):
        nineteenseventy = datetime.utcfromtimestamp(0)
        mock_datetime.utcnow.return_value = nineteenseventy

        self.audit.record_login('10.0.0.1')
        self.assertEquals('1970-01-01T00:00:00', self.uci.get(audit.last_login_timestamp))
