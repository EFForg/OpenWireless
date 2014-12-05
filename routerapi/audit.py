from datetime import datetime

import uci

def key(suffix):
    return "openwireless.audit.%s" % suffix

previous_login_ip = key('previous_login_ip')
last_login_ip = key('last_login_ip')
last_login_timestamp = key('last_login_timestamp')
previous_login_timestamp = key('previous_login_timestamp')

def last_login():
    address = uci.get(last_login_ip)
    timestamp = _get_date(last_login_timestamp)
    return _build_login(address, timestamp)

def previous_login():
    address = uci.get(previous_login_ip)
    timestamp = _get_date(previous_login_timestamp)
    return _build_login(address, timestamp)

def record_login(address, timestamp = None):
    if not timestamp:
        timestamp = datetime.utcnow()
    if last_login():
        uci.set(previous_login_ip, uci.get(last_login_ip))
        uci.set(previous_login_timestamp, uci.get(last_login_timestamp))
    uci.set(last_login_timestamp, timestamp.strftime('%Y-%m-%dT%H:%M:%S'))
    uci.set(last_login_ip, address)

    uci.commit("openwireless")

def _get_date(key):
    date_string = uci.get(key)
    return date_string and datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S')

def _build_login(address, timestamp):
    if address and timestamp:
        return {'address': address, 'timestamp': timestamp}
