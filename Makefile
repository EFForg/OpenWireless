NODEJS=$(if $(shell which nodejs),nodejs,node)
PIP_USER_SWITCH=$(if $(VIRTUAL_ENV),--user,)

TEMPLATES_JS=app/js/templates.js
HANDLEBARS_FILES=app/templates/*.handlebars  # Used to generate templates.js

.PHONY: all
all: $(TEMPLATES_JS)

.PHONY: clean
clean:
	rm -f $(TEMPLATES_JS)


$(TEMPLATES_JS): $(HANDLEBARS_FILES)
	$(eval TEMPFILE=$(shell mktemp --suffix _templates.js))

	./node_modules/handlebars/bin/handlebars -f $(TEMPFILE) $(HANDLEBARS_FILES)
	mv -f $(TEMPFILE) $(TEMPLATES_JS)

.PHONY: deps
deps:
	npm install
	pip install $(PIP_USER_SWITCH) -qr requirements.txt

# This should depend on "all" instead. See note below for assert_templates_js_up_to_date
.PHONY: test
test: assert_templates_js_up_to_date deps
	/usr/bin/env python2.7 -m unittest discover -s test/ -p '*_test.py'
	$(NODEJS) -e "require('grunt').tasks(['test']);"

.PHONY: test-selenium
test-selenium:
	python -m unittest discover -s selenium/ -p '*_test.py'


# NOTE: assert_templates_js_up_to_date is a temporary workaround to confirm
# that templates.js is up-to-date with the handlebars templates used to
# generate it.  Both are checked in to source control because the build server
# currently does not have handlebars installed so relies on the repo version of
# templates.js
#
# TODO: once the build server has handlebars installed:
# - remove apps/js/templates.js from source control (https://github.com/EFForg/OpenWireless/pull/234)
# - always build templates.js from apps/templates/*
# - remove this make target.

.PHONY: assert_templates_js_up_to_date
assert_templates_js_up_to_date:
	$(eval TEMPFILE=$(shell mktemp --suffix _templates.js))
	./node_modules/handlebars/bin/handlebars -f $(TEMPFILE) $(HANDLEBARS_FILES)
	if ! diff --brief $(TEMPFILE) $(TEMPLATES_JS); then \
		echo 'Error: templates.js out-of-date. Run `make app/js/templates.js`' 2>&1; \
		exit 1; \
	fi
