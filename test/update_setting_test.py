import unittest
import sys
import os
import mock
from fake_uci import FakeUci

sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "..", "routerapi"))

import update_setting

class TestUpdateSetting(unittest.TestCase):
    @mock.patch('accumulate_bytes.update_network_availability')
    @mock.patch('update_setting.uci', new_callable = FakeUci)
    def test_update_network_availability_after_monthly_data_limit_change(self, _, update_network_availability):
        update_setting.check_openwireless_monthly_data('500')
        update_network_availability.assert_called_with()

    @mock.patch('accumulate_bytes.update_network_availability')
    @mock.patch('update_setting.uci', new_callable = FakeUci)
    def test_update_openwireless_monthly_data(self, uci, _):
        update_setting.check_openwireless_monthly_data('500')

        bandwidth = uci.get("openwireless.maxmonthlybandwidth")
        self.assertEquals(bandwidth, '500')

