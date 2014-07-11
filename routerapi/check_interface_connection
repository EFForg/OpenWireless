#!/usr/bin/python

import uci

def wireless_is_disabled(interface_name):
    is_disabled = uci.get("wireless.@wifi-iface[" + interface_name + "].disabled") == "1"
    return is_disabled