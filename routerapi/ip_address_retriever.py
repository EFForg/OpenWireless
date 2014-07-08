import socket, fcntl, struct, re, string
from subprocess import check_output

def get_internal_ip_address(interface_name):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    return socket.inet_ntoa(fcntl.ioctl(
        s.fileno(),
        0x8915,
        struct.pack('256s', interface_name[:15])
    )[20:24])

def get_external_ip_address():
    parser = re.compile('<strong id="ip_address">(\d+).(\d+).(\d+).(\d+)</strong>')
    ip_page = check_output(["/usr/bin/wget", "-O-", "ifconfig.me"])
    ip_tuple = parser.findall(ip_page)[0]
    return ".".join(ip_tuple)

