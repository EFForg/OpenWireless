import common
import uci

def enabled(index):
    return uci.get("wireless.@wifi-iface[%d].disabled" % index) != "1"
