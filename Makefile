include .env

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

export VERSION := $(shell git describe --tags --always)

define sortjson
# sorting $1
@tmp=$(dir $1).$(notdir $1); \
jq -S . $1 > $$tmp && mv $$tmp $1
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

.PHONY: watch serve dev
watch serve dev: export BUILD ?= development
watch:     export MODE  := watch
serve:     export MODE  := serve
dev:       export MODE  := dev
watch serve dev: public/app/config.json node_modules
	./build.js

.PHONY: test
test:
	npm run test

.PHONY: analyse
analyse: src/main.svg
	open $< &

.PHONY: mostlyclean
mostlyclean:
	rm -f src/main.svg src/main.dot
	rm -rf public/app .cache

.PHONY: clean
clean: mostlyclean
	rm -rf node_modules

.PHONY: check
check: check-svelte check-eslint check-translations;

.PHONY: check-typescript
check-typescript: node_modules
	$(BIN)/tsc --noEmit

.PHONY: check-svelte
check-svelte: node_modules
	$(BIN)/svelte-check $(SCFLAGS)

.PHONY: check-eslint
check-eslint: node_modules
	$(BIN)/eslint src eslint.config.mjs

.PHONY: check-translations
check-translations:
	@for f in $(TRANSGLOB); do \
		echo "# checking $$f"; \
		jq -S . $$f | diff -q /dev/stdin $$f > /dev/null || (echo "incorrectly formatted" && exit 1); \
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

.PHONY: deploy
deploy:
	rsync -av --fuzzy --delete-after --exclude='.*' --exclude='config.json' public $(TARGET)

$(DIRS):
	mkdir -p $@

ifdef GROUPED_TARGET
$(OUTPUTS) &: public/app/%.js: src/%.ts $(SRCS) build.js node_modules | public/app
else
$(OUTPUTS): public/app/%.js: src/%.ts $(SRCS) build.js node_modules | public/app
endif
	./build.js

node_modules: package-lock.json package.json
	npm install --include=dev
	touch $@

public/app/config.json: config.json | public/app
	cp $< $@

config.json:
	cp config.sample.json $@

%.svg: %.dot
	dot -T svg $< > $@

%.dot: %.ts
	npx ts_dependency_graph --start $< > $@

.env:
	touch $@
