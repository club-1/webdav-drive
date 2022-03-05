ifneq (,$(filter grouped-target,$(.FEATURES)))
GROUPED_TARGET := On
endif

BIN := node_modules/.bin
DIRS := public/app
SRCS := $(shell find src -name *.ts -or -name *.svelte)
INPUTS := src/main.ts $(wildcard src/module/*Module.ts)
OUTPUTS := $(patsubst src/%.ts,public/app/%.js,$(INPUTS))
SCFLAGS := --fail-on-warnings

ifdef CI
SCFLAGS += --output=machine
endif

ifndef GROUPED_TARGET
$(warning WARNING: This version of make does not support grouped-target, disabling parallel jobs.)
.NOTPARALLEL:
endif

.PHONY: all
all: public/app/config.json node_modules $(OUTPUTS);

.PHONY: watch
watch: public/app/config.json node_modules
	$(BIN)/rollup -c -w

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
check: check-typescript check-svelte check-eslint;

.PHONY: check-typescript
check-typescript: node_modules
	$(BIN)/tsc --noEmit

.PHONY: check-svelte
check-svelte: node_modules
	$(BIN)/svelte-check $(SCFLAGS)

.PHONY: check-eslint
check-eslint: node_modules
	$(BIN)/eslint src

.PHONY: fix
fix: node_modules
	$(BIN)/eslint src --fix

$(DIRS):
	mkdir -p $@

ifdef GROUPED_TARGET
$(OUTPUTS) &: public/app/%.js: src/%.ts $(SRCS) node_modules | public/app
else
$(OUTPUTS): public/app/%.js: src/%.ts $(SRCS) node_modules | public/app
endif
	$(BIN)/rollup -c

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
