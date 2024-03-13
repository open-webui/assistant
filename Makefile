.PHONY: all clean install

.DEFAULT_GOAL := all

all:
	npm i
	rm -f node_modules/@jimp/core/node_modules/.bin/mkdirp
	rm -f node_modules/execa/node_modules/.bin/semver
	rm -f node_modules/execa/node_modules/.bin/which
	npm run make

clean:
	rm -rf node_modules

install:
	mv out/open-webui-assistant-darwin-arm64/open-webui-assistant.app ~/Applications/Open\ WebUI\ Assistant.app
