NPM ?= npm
ARGS ?=
BUILD_ARGS ?=

.PHONY: help install update dev build preview test export export-png export-pptx browser browser-deps clean

help:
	@printf '%s\n' \
		'Usage: make <target> [ARGS=...] [BUILD_ARGS=...] [NPM=npm]' \
		'' \
		'  install       Install locked dependencies' \
		'  update        Update dependencies within package specifications' \
		'  dev           Start the development server' \
		'  build         Build slides for GitHub Pages' \
		'  preview       Build and preview the production site' \
		'  test          Build and run tests' \
		'  export        Export slides as PDF' \
		'  export-png    Export slides as PNG images' \
		'  export-pptx   Export slides as PowerPoint' \
		'  browser       Install Chromium for exports' \
		'  browser-deps  Install Linux dependencies for Chromium' \
		'  clean         Remove disposable output in dist' \
		'' \
		'ARGS passes options to dev, preview, and export targets.' \
		'BUILD_ARGS passes options only to build. NPM overrides the npm command.'

install:
	$(NPM) ci

update:
	$(NPM) update

dev:
	$(NPM) run dev -- $(ARGS)

build:
	$(NPM) run build -- --base /txlf2026/ $(BUILD_ARGS)

preview: build
	$(NPM) exec -- vite preview --base /txlf2026/ $(ARGS)

test: build
	node --test tests/*.test.mjs

export:
	$(NPM) run export -- --output dist/slides.pdf $(ARGS)

export-png:
	$(NPM) run export -- --format png --output dist/export-png $(ARGS)

export-pptx:
	$(NPM) run export -- --format pptx --output dist/slides.pptx $(ARGS)

browser:
	$(NPM) exec -- playwright install chromium

browser-deps:
	$(NPM) exec -- playwright install-deps chromium

clean:
	rm -rf dist
