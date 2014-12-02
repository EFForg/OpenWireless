import unittest
import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "..", "routerapi"))

from audit import *
from fake_uci import FakeUci

class AuditTest(unittest.TestCase):
    def test_previous_login_with_none(self):
        uci = FakeUci()
        audit = Audit(uci)
        self.assertEquals(None, audit.previous_login())

    def test_last_login_with_none(self):
        uci = FakeUci()
        audit = Audit(uci)
        self.assertEquals(None, audit.last_login())

    def test_previous_login_with_some(self):
        audit = Audit(FakeUci(data = {
            previous_login_ip: '10.0.0.1',
            previous_login_timestamp: '1970-01-01T00:00:00',
        }))
        expected = {'address': '10.0.0.1', 'timestamp': datetime.utcfromtimestamp(0)}
        self.assertEquals(expected, audit.previous_login())

    def test_last_login_with_some(self):
        audit = Audit(FakeUci(data = {
            last_login_ip: '10.0.0.1',
            last_login_timestamp: '1970-01-01T00:00:00',
        }))
        expected = {'address': '10.0.0.1', 'timestamp': datetime.utcfromtimestamp(0)}
        self.assertEquals(expected, audit.last_login())

    def test_record_login_sets_previous_login_to_last_login(self):
        audit = Audit(FakeUci(data = {
            last_login_ip: '10.0.0.1',
            last_login_timestamp: '1970-01-01T00:00:00',
        }))
        last_login = audit.last_login()
        audit.record_login('10.0.0.1', datetime.utcnow())
        self.assertEquals(last_login, audit.previous_login())

    def test_sets_last_login_to_provided_address(self):
        audit = Audit(FakeUci())
        timestamp = datetime.utcfromtimestamp(0)
        audit.record_login('10.0.0.1', timestamp)
        self.assertEquals({'address': '10.0.0.1', 'timestamp': timestamp}, audit.last_login())

