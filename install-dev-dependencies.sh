#!/bin/bash -ex
# On Ubuntu and similar systems, install packages that are necessary and/or
# useful to build and debug OpenWireless.

set -o nounset

INSTALL_XVFB=""
ACCEPT_INSTALL_PROMPTS=""

while getopts "xa" ARG; do
  case $ARG in
    x)
      INSTALL_XVFB=true
      ;;
    a)
      ACCEPT_INSTALL_PROMPTS=--assume-yes
      ;;
    \?)
      cat <<EOD
usage: $0 [-ax]
  -a  accept apt-get install prompts
  -x  install xvfb
EOD
      exit 1
  esac
done

sudo apt-get install $ACCEPT_INSTALL_PROMPTS gettext unzip libncurses-dev subversion git inotify-tools lighttpd nodejs npm python2.7 python-pip tftp libfontconfig firefox
if [ ! -f /usr/bin/node ]; then
  sudo ln -s /usr/bin/nodejs /usr/bin/node
fi
cd $(dirname $0)
pip install --user -qr requirements.txt
npm install
# Install a hook to run tests before pushing.
if [ ! -f .git/hooks/pre-push ]; then
  ln -s ../../scripts/pre-commit .git/hooks/pre-push
fi

if [ -n "$INSTALL_XVFB" ]; then
  echo Okay, installing xvfb for you ':)'
  sudo apt-get install $ACCEPT_INSTALL_PROMPTS xvfb
  sudo cp infra/etc/init.d/Xvfb /etc/init.d/Xvfb
  sudo service Xvfb start
fi

cat <<EOD
We strongly recommend adding the following lines to your ~/.ssh/config:

Host gw.home.lan
  User root
  ControlMaster auto
  ControlPath /tmp/%h-%p-%r

This allows you to skip typing 'root@' with your SSH commands.
It also uses a persistent connection to multiplex new connections.
So you can run 'ssh -Nf gw.home.lan' once during a work session,
and all subsequent ssh's into gw.home.lan will start much more quickly.
EOD
