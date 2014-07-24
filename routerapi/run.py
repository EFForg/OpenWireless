"""
A thin wrapper around subprocess.check_output. This makes it easy to mock out
command execution when running with local lighttpd.
"""
import subprocess

def check_output(arg_list):
    return subprocess.check_output(arg_list)
