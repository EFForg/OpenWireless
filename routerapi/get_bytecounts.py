import run
import re
import subprocess

parser_pattern = re.compile('SRC packets: \d+ bytes: (\d+) DST packets: \d+ bytes: (\d+)')

def addcount(a,b):
    return map(sum, zip(map(int,a),map(int,b)))

def get_device_and_byte_counts(network_name):
    try:
        ipt_output = run.check_output([
            '/usr/bin/sudo', '/usr/sbin/iptaccount', '-l', network_name])
        network_data = parser_pattern.findall(ipt_output)
        device_count = len(network_data)
        if device_count == 0:
            return [0, 0, 0]
        else:
            return [device_count] + map(int, list(reduce(addcount, network_data)))
    except subprocess.CalledProcessError:
        return [0, 0, 0]


