#!/bin/bash
cd $(dirname $0)
./node_modules/handlebars/bin/handlebars app/templates/*.handlebars -f app/js/templates.js
