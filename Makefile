ifneq (,$(filter grouped-target,$(.FEATURES)))
GROUPED_TARGET := On
endif

SHELL := /bin/bash -O globstar

BIN := node_modules/.bin
DIRS := public/app
VIEWSGLOB := src/**/*.svelte
VIEWS := $(shell echo $(VIEWSGLOB))
TRANSGLOB := locales/translation-*.json
TRANS := $(wildcard $(TRANSGLOB))
LOCALE ?= en
SRCS := $(shell find src -name *.ts -or -name *.svelte)
INPUTS := src/main.ts $(wildcard src/module/*Module.ts)
OUTPUTS := $(patsubst src/%.ts,public/app/%.js,$(INPUTS))
SCFLAGS := --fail-on-warnings

SORTCMD := LC_ALL=C sort -df -t: -k1

define sortjson
# sort $1
@tmp=$(dir $1).$(notdir $1); \
{ \
	echo '{'; \
	sed '1d;$$d;s/[^,]$$/\0,/' $1 \
	| $(SORTCMD) \
	| sed '$$s/,$$//'; \
	echo '}'; \
} > $$tmp && mv $$tmp $1
endef

ifdef CI
SCFLAGS += --output=machine
endif

ifndef GROUPED_TARGET
$(warning WARNING: This version of make does not support grouped-target, disabling parallel jobs.)
.NOTPARALLEL:
endif

.PHONY: all
all: export BUILD ?= production
all: public/app/config.json node_modules $(OUTPUTS);

.PHONY: watch
watch: BUILD ?= development
watch: public/app/config.json node_modules
	$(BIN)/rollup --config --watch

.PHONY: start
start: node_modules
	$(BIN)/sirv public --no-clear --dev

.PHONY: dev
dev: MAKEFLAGS += --no-print-directory
dev: node_modules
	$(MAKE) start & $(MAKE) watch

.PHONY: test
test:
	npm run test

.PHONY: analyse
analyse: src/main.svg
	open $< &

.PHONY: mostlyclean
mostlyclean:
	rm -f src/main.svg src/main.dot
	rm -rf public/app

.PHONY: clean
clean: mostlyclean
	rm -rf node_modules

.PHONY: check
check: check-typescript check-svelte check-eslint check-translations;

.PHONY: check-typescript
check-typescript: node_modules
	$(BIN)/tsc --noEmit

.PHONY: check-svelte
check-svelte: node_modules
	$(BIN)/svelte-check $(SCFLAGS)

.PHONY: check-eslint
check-eslint: node_modules
	$(BIN)/eslint src

.PHONY: check-translations
check-translations:
	for f in $(TRANSGLOB); do \
		sed '1d;$$d' $$f | $(SORTCMD) --check || exit 1; \
	done

.PHONY: fix
fix: fix-eslint translations-sort;

.PHONY: fix-eslint
fix-eslint: node_modules
	$(BIN)/eslint src --fix

.PHONY: translations-extract
translations-extract: translation-$(LOCALE)-extract;

.PHONY: translations-%-extract
translation-%-extract:
	node_modules/.bin/svelte-i18n extract --shallow '$(VIEWSGLOB)' locales/translation-$*.json
	$(call sortjson,locales/translation-$*.json)

.PHONY: translations-sort
translations-sort: $(TRANS:locales/%.json=%-sort)

.PHONY: translations-%-sort
translation-%-sort:
	$(call sortjson,locales/translation-$*.json)

$(DIRS):
	mkdir -p $@

ifdef GROUPED_TARGET
$(OUTPUTS) &: public/app/%.js: src/%.ts $(SRCS) rollup.config.js node_modules | public/app
else
$(OUTPUTS): public/app/%.js: src/%.ts $(SRCS) rollup.config.js node_modules | public/app
endif
	$(BIN)/rollup --config

node_modules: package-lock.json
	npm install --also=dev
	touch $@

public/app/config.json: config.json | public/app
	cp $< $@

config.json:
	cp config.sample.json $@

%.svg: %.dot
	dot -T svg $< > $@

%.dot: %.ts
	npx ts_dependency_graph --start $< > $@
