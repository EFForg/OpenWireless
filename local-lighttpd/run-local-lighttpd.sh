#!/bin/bash -ex
DIR=$(dirname $0)
cd $DIR
echo "Access the web UI on https://localhost:8843/ or http://localhost:8888/"
exec lighttpd -D $DIR -f local-lighttpd.conf
