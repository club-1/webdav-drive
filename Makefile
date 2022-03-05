BIN := node_modules/.bin
SCFLAGS := --fail-on-warnings

ifdef $(CI)
SCFLAGS += --output=machine
endif

.PHONY: all
all: config.ts node_modules public/app/main.js;

.PHONY: watch
watch: node_modules
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

.PHONY: clean
clean:
	rm -f src/main.svg src/main.dot
	rm -rf public/app
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

public/app/main.js: src/main.ts node_modules
	$(BIN)/rollup -c

node_modules: package-lock.json
	npm i
	touch $@

config.ts:
	cp config.sample.ts $@

%.svg: %.dot
	dot -T svg $< > $@

%.dot: %.ts
	npx ts_dependency_graph --start $< > $@
