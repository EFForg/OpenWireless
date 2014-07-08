#!/bin/sh

days=1826
bits=2048
pem=/etc/lighttpd/lighttpd.pem

HL=`uname -n`
HS=`hostname`
IP=`ip addr show dev se00 | awk '/inet / {sub(/\/.*/, "", $2); print $2}'`

if [ "$HS" = "(none)" ]
then
HS=cerowrt
fi

if [ "$HL" = "(none)" ]
then
HL=cerowrt
fi

DOTS=`echo $HL | cut -f2 -d.`

if [ -z $DOTS ]
then
if [ "$HL" = "$HS" ]; then
    HL="$HS.home.lan"
fi
fi

commonname=$HL
if [ -n "$IP" ]
then
export SAN="DNS:gw.home.lan, DNS:gw, DNS:$HS.local, DNS:$HS, DNS:$HL, IP:$IP"
else
export SAN="DNS:gw.home.lan, DNS:gw, DNS:$HS.local, DNS:$HS, DNS:$HL"
fi

sed '/req_extensions = v3_req/s/^# *//; /SAN/d; /CA:true/d /^HOME/i\
SAN="email:support@cerowrt.org"
/\[ v3_\(req\|ca\) \]/ a\
subjectAltName=${ENV::SAN}
' /etc/ssl/openssl.cnf > /tmp/openssl.cnf

openssl req -new -newkey rsa:$bits -x509 -keyout $pem -out $pem -days $days \
    -nodes -subj "/CN=$commonname" \
    -config /tmp/openssl.cnf
rm /tmp/openssl.cnf

/etc/init.d/lighttpd stop # can get wedged
/etc/init.d/lighttpd start # hopefully unwedged

