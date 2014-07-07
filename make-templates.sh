#!/bin/bash
cd $(dirname $0)
JS=app/js/templates.js
TEMPLATES=app/templates
if [ ! -z "`find $TEMPLATES -newer $JS`" ] ; then
  ./node_modules/handlebars/bin/handlebars $TEMPLATES/*.handlebars -f $JS
fi
