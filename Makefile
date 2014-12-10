NODEJS=$(if $(shell which nodejs),nodejs,node)
PIP_USER_SWITCH=$(if $(VIRTUAL_ENV),,--user)

TEMPLATES_JS=app/js/templates.js
HANDLEBARS_FILES=$(wildcard app/templates/*.handlebars) # Used to generate templates.js
IMAGE=cerowrt/releases/openwireless-openwrt-squashfs-sysupgrade.bin

.PHONY: all
all: templates image

.PHONY: templates
templates: $(TEMPLATES_JS)

.PHONY: image
image:
	git submodule update --init
	cp OWrt/config-OWrt cerowrt/.config
	if ! grep '^src-git cero' cerowrt/feeds.conf.default; then \
		echo 'src-git cero https://github.com/dtaht/ceropackages-3.10' >> cerowrt/feeds.conf.default; \
	fi
	./cerowrt/scripts/feeds update
	cp -r ow-python/python-mini-eff ./cerowrt/feeds/oldpackages/lang/
	./cerowrt/scripts/feeds update -a
	./sendToBuild
	make -C cerowrt
	mkdir -p cerowrt/releases
	cp cerowrt/bin/ar71xx/openwrt-ar71xx-generic-wndr3800-squashfs-sysupgrade.bin $(IMAGE)
	@if [ ! -f $(IMAGE) ]; then \
		echo "ERROR: For some reason $IMAGE failed to generate!"; \
		exit 1; \
	fi

.PHONY: clean
clean:
	rm -f $(TEMPLATES_JS)
	rm -rf cerowrt/releases/
	grep -v '^src-git cero' cerowrt/feeds.conf.default >feeds.conf.tmp
	mv feeds.conf.tmp cerowrt/feeds.conf.default


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
	scripts/unit
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
