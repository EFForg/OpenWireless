#!/bin/bash -ex
DIR=$(dirname $0)
cd $DIR
if [ ! -z "$PORT" ] ; then
  ETC=port-$PORT-etc
else
  ETC=etc
fi
rm -rf $ETC
mkdir -m 0700 -p $ETC/auth
mkdir -m 0700 -p $ETC/dropbear
echo '{"sqm.ge00.download": "0", "sqm.ge00.upload": "0"}' > $ETC/uci.json
echo "Access the web UI on https://localhost:8443/ or http://localhost:8888/"
cp local-lighttpd.pem $ETC/
HTTP_PORT=${HTTP_PORT:-8888}
HTTPS_PORT=$(($HTTP_PORT + 1))

sed "s,REPO_DIR,$(readlink -f ..),; s,HTTP_PORT,$HTTP_PORT,; s,HTTPS_PORT,$HTTPS_PORT,;" local-lighttpd.conf > $ETC/local-lighttpd.conf
cd $ETC
exec lighttpd -D -f local-lighttpd.conf
