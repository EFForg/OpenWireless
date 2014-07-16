#!/bin/bash
cd $(dirname $0)
JS=app/js/templates.js
TEMPLATES=app/templates
TMP=/tmp/template.$$.js
./node_modules/handlebars/bin/handlebars -f $TMP $TEMPLATES/*.handlebars
if [ "$1" = "--is-updated" ] ; then
  # Return true if templates.js is up-to-date.
  diff -q $JS $TMP > /dev/null
  RESULT=$?
  rm -f $TMP
  exit $RESULT
else
  mv -f $TMP $JS
fi
