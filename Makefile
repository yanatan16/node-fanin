REPORTER = spec
MOCHA = ./node_modules/.bin/mocha
MOCHAARGS = --reporter $(REPORTER)

.PHONY: test

test: 
	$(MOCHA) $(MOCHAARGS)

