#!/bin/bash -ex
DIR=$(dirname $0)
cd $DIR
HTTP_PORT=${HTTP_PORT:-8000}
HTTPS_PORT=$(($HTTP_PORT + 1000))
ROOT=`mktemp -d /tmp/openwireless-frontend-XXXX`
ETC=$ROOT/port-$HTTP_PORT-etc
rm -rf $ETC
mkdir -m 0700 -p $ETC/auth
mkdir -m 0700 -p $ETC/dropbear
cp -R *.py $ROOT
echo '{
  "sqm.ge00.download": "0",
  "sqm.ge00.upload": "0",
  "maxmonthlybandwidth": "600",
  "openwireless.maxbandwidthpercentage": "20",
  "openwireless.use_before_last_reset": "0",
  "openwireless.use_since_last_reset": "0",
  "openwireless.last_known_reset_time": "1406383473",
  "openwireless.use_at_last_ui_reset": "0",
  "openwireless.setup_state": "set-password"
}' > $ETC/uci.json
cp local-lighttpd.pem $ETC/

sed "s,REPO_DIR,$(readlink -f ..),; s,HTTP_PORT,$HTTP_PORT,; s,HTTPS_PORT,$HTTPS_PORT,;" local-lighttpd.conf > $ETC/local-lighttpd.conf
cd $ETC
echo "Access the web UI on http://localhost:$HTTP_PORT/"
exec lighttpd -D -f local-lighttpd.conf "$@"
