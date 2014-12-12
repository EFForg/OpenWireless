#!/bin/bash
cd $(dirname $0)
DIR=$(pwd)
REPO_DIR=`cd $DIR/.. && pwd`
./changeReleaseDate

cd $(dirname $0)
killall lighttpd
for n in `seq 8000 8020` ; do
  export HTTP_PORT=$n
  ./run-local-lighttpd.sh $HTTP_PORT &
done
