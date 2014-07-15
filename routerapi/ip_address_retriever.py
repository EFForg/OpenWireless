import fcntl
import socket
import struct
import subprocess

def get_internal_ip_address(interface_name):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
      return socket.inet_ntoa(fcntl.ioctl(
          s.fileno(),
          0x8915,
          struct.pack('256s', interface_name[:15])
      )[20:24])
    except IOError:
      return '?.?.?.?'

def get_external_ip_address():
    try:
      return subprocess.check_output(["/usr/bin/wget", "-qO-", "myexternalip.com/raw"])
    except subprocess.CalledProcessError:
      return '?.?.?.?'
