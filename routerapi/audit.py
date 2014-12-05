from datetime import datetime

def key(suffix):
    return "openwireless.audit.%s" % suffix

previous_login_ip = key('previous_login_ip')
last_login_ip = key('last_login_ip')
last_login_timestamp = key('last_login_timestamp')
previous_login_timestamp = key('previous_login_timestamp')

class Audit():
    def __init__(self, uci):
        self.uci = uci

    def last_login(self):
        address = self.uci.get(last_login_ip)
        timestamp = self._get_date(last_login_timestamp)
        return self._build_login(address, timestamp)

    def previous_login(self):
        address = self.uci.get(previous_login_ip)
        timestamp = self._get_date(previous_login_timestamp)
        return self._build_login(address, timestamp)

    def record_login(self, address, timestamp = None):
        if not timestamp:
            timestamp = datetime.utcnow()
        if self.last_login():
            self.uci.set(previous_login_ip, self.uci.get(last_login_ip))
            self.uci.set(previous_login_timestamp, self.uci.get(last_login_timestamp))
        self.uci.set(last_login_timestamp, timestamp.strftime('%Y-%m-%dT%H:%M:%S'))
        self.uci.set(last_login_ip, address)

        self.uci.commit("openwireless")

    def _get_date(self, key):
        date_string = self.uci.get(key)
        return date_string and datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S')

    def _build_login(self, address, timestamp):
        if address and timestamp:
            return {'address': address, 'timestamp': timestamp}
