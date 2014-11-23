#!/bin/bash -ex
# On Ubuntu and similar systems, install packages that are necessary and/or
# useful to build and debug OpenWireless.
sudo apt-get install -y gettext unzip libncurses-dev subversion git inotify-tools lighttpd nodejs npm python2.7 python-pip tftp libfontconfig firefox xvfb
if [ ! -f /usr/bin/node ]; then
  sudo ln -s /usr/bin/nodejs /usr/bin/node
fi
cd $(dirname $0)
pip install --user -qr requirements.txt
npm install
# Install a hook to run tests before pushing.
if [ ! -f .git/hooks/pre-push ]; then
  ln -s ../../run-tests.sh .git/hooks/pre-push
fi
sudo cp infra/etc/init.d/Xvfb /etc/init.d/Xvfb
sudo service Xvfb start
echo "We strongly recommend adding the lines from ./ssh-config to your" \
     "SSH config. It will make developing on a router much faster."
