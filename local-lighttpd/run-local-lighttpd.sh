#!/bin/bash -ex
DIR=$(dirname $0)
cd $DIR
rm -rf etc
mkdir etc
echo "Access the web UI on https://localhost:8443/ or http://localhost:8888/"
exec lighttpd -D $DIR -f local-lighttpd.conf
