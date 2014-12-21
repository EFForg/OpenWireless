
TEMPLATES_JS=app/js/templates.js
HANDLEBARS_FILES=$(wildcard app/templates/*.handlebars) # Used to generate templates.js

.PHONY: all
all: $(TEMPLATES_JS)

.PHONY: clean
clean:
	rm -f $(TEMPLATES_JS)


$(TEMPLATES_JS): $(HANDLEBARS_FILES)
	$(eval TEMPFILE=$(shell mktemp --suffix _templates.js))

	./node_modules/handlebars/bin/handlebars -f $(TEMPFILE) $(HANDLEBARS_FILES)
	mv -f $(TEMPFILE) $(TEMPLATES_JS)
	chmod 644 $(TEMPLATES_JS)


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
	diff --brief $(TEMPFILE) $(TEMPLATES_JS)  # exit=1 if different
