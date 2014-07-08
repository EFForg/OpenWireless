#!/bin/sh
#
# Set up an OpenWireless router with needed packages and configs.
# This script is mostly idempotent - it's harmless to run multiple times.
# Run it like so:
#
# scp provision-router.sh ROUTER_IP:/tmp
# ssh root@ROUTER_IP sh /tmp/provision-router.sh

# Remove uhttpd.
opkg remove uhttpd --force-removal-of-dependent-packages
rm -rf /www/cgi-bin/luci
rm -rf /www/luci-static
rm -f /www/index.html

# Add the openwrt repo so we can get lighttpd-mod-setenv
echo >> /etc/opkg.conf src/gz openwrt http://downloads.openwrt.org/snapshots/trunk/ar71xx/packages/

# Generate a key and a self-signed SSL cert.
SSLDIR=/etc/lighttpd/ssl
KEY=$SSLDIR/router.key
CSR=$SSLDIR/router.csr
CERT=$SSLDIR/router.crt
mkdir -p $SSLDIR
openssl genrsa -out $KEY 2048
openssl req -new -key $KEY -out $CSR -subj /CN=gw.home.lan
openssl x509 -req -days 1826 -in $CSR -signkey $KEY -out $CERT
cat $KEY $CERT > /etc/lighttpd/ssl/router.pem

# Create authentication data directory
AUTHDIR=/etc/auth
mkdir -p $AUTHDIR
chown -R www-data $AUTHDIR
chmod 0700 $AUTHDIR

# host from lighttpd and add CSP Headers.
opkg update
opkg install lighttpd lighttpd-mod-cgi lighttpd-mod-setenv
CONF=/etc/lighttpd/lighttpd.conf

# Create openwireless configuration file
touch /etc/config/openwireless
uci set openwireless.maxbandwidthpercentage=15
uci set openwireless.maxmonthlybandiwdth=500

# Replace all custom config from previous runs of provision-router.sh
(sed -e '/OPENWIRELESS_CONFIG_STARTS_HERE/,$d' $CONF ; cat <<EOF) > $CONF.new
# OPENWIRELESS_CONFIG_STARTS_HERE
\$SERVER["socket"] == ":443" {
  ssl.engine = "enable"
  ssl.pemfile = "/etc/lighttpd/ssl/router.pem"
  \$HTTP["url"] =~ "^/cgi-bin" {
    cgi.assign = ( "" => "" )
  }
}
setenv.add-response-header = (
  "X-Content-Security-Policy" => "allow 'self'",
  "X-Frame-Options" => "SAMEORIGIN",
  "X-Content-Type-Options" => "nosniff"
)
server.modules += (
  "mod_setenv",
)
server.username = "www-data"
EOF

mv $CONF.new $CONF
