#!/bin/bash -ex
DIR=$(dirname $0)
cd $DIR
rm -rf etc
mkdir -m 0700 -p etc/auth
mkdir -m 0700 -p etc/dropbear
echo '{"sqm.ge00.download": "0", "sqm.ge00.upload": "0"}' > etc/uci.json
echo "Access the web UI on https://localhost:8443/ or http://localhost:8888/"
exec lighttpd -D $DIR -f local-lighttpd.conf
