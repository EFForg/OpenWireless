#!/bin/bash -ex
DIR=$(dirname $0)
cd $DIR
HTTP_PORT=${HTTP_PORT:-8000}
HTTPS_PORT=$(($HTTP_PORT + 1000))
ETC=port-$HTTP_PORT-etc
rm -rf $ETC
mkdir -m 0700 -p $ETC/auth
mkdir -m 0700 -p $ETC/dropbear
echo '{"sqm.ge00.download": "0", "sqm.ge00.upload": "0"}' > $ETC/uci.json
cp local-lighttpd.pem $ETC/

sed "s,REPO_DIR,$(readlink -f ..),; s,HTTP_PORT,$HTTP_PORT,; s,HTTPS_PORT,$HTTPS_PORT,;" local-lighttpd.conf > $ETC/local-lighttpd.conf
cd $ETC
echo "Access the web UI on http://localhost:$HTTP_PORT/"
exec lighttpd -D -f local-lighttpd.conf "$@"
