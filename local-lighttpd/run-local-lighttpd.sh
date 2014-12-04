#!/bin/bash -ex
DIR=$(cd `dirname $0` && pwd)
cd $DIR
HTTP_PORT=${HTTP_PORT:-8000}
HTTPS_PORT=$(($HTTP_PORT + 1000))
ROOT=`mktemp -d /tmp/openwireless-frontend-XXXX`
ETC=$ROOT/port-$HTTP_PORT-etc
REPO_DIR=`cd $DIR/.. && pwd`
DOC_ROOT=$REPO_DIR/app
CGI_ROOT=$REPO_DIR
LIGHTTPD_CONF_TEMPLATE=$REPO_DIR/lighttpd/lighttpd.conf.template
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
cp local-lighttpd.pem $ETC/lighttpd.pem

$REPO_DIR/scripts/template $LIGHTTPD_CONF_TEMPLATE > $ETC/lighttpd.conf <<EOS
DOC_ROOT=$DOC_ROOT
CGI_ROOT=$CGI_ROOT
HTTP_PORT=$HTTP_PORT
HTTPS_PORT=$HTTPS_PORT
BIND=0.0.0.0
PID_FILE=$ETC/lighttpd.pid
USER=$USER
GROUP=$USER
PEM_FILE=$ETC/lighttpd.pem
APPLICATION_URL=localhost:$HTTPS_PORT
EOS

mkdir $ETC/conf.d
cat > $ETC/conf.d/local-test-server.conf <<EOS
setenv.add-environment = (
  "OVERRIDE_ETC" => var.CWD,
  "OVERRIDE_PATH" => var.CWD + "/.."
)
EOS
cd $ETC
echo "Access the web UI on http://localhost:$HTTP_PORT/"
exec lighttpd -D -f $ETC/lighttpd.conf "$@"
