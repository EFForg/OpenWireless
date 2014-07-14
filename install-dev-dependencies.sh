#!/bin/bash -ex
# On Ubuntu and similar systems, install packages that are necessary and/or
# useful to build and debug OpenWireless.
sudo apt-get install inotify-tools lighttpd nodejs npm python2.7 python-pip
cd $(dirname $0)
pip install --user -qr requirements.txt
npm install
