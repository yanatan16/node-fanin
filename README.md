node-fanin [![Build Status][1]][2]
==========

A simple concurrency pattern: fan-in

Status: Untested in production, but ready to be.

## Why do you need fan-in?

- You want to make `n` asynchronous calls simultaneously and make a callback when all have finished.
- You may want to save the callback values of these calls, and definitely want the errors.
- You just want that. Nothing else.

## API



    var fanin = require('fanin')
      , fan = fanin(3, cb);
 
    foo(fan.capture('foo'));
    bar(fan.capture('bar'));
    baz(fan);

    function foo(cb) {
      cb(null, {some: 'object'});
    }

    function bar(cb) {
      cb(null, 'multiple', 'return', 'values');
    }

    function baz(cb) {
      cb(new Error('oops'));
    }

    // cb([Error('oops')], {foo: {some: 'object', bar: ['multiple', 'return', 'values']}); is called

- `var fan = fanin(n, cb)` returns a function which will act as a callback to the sub-calls in which you only care about errors.
- `fan.capture(name)` will act as a callback to the sub-calls which you care about return value(s) (placing them in an object under the key `name`.
- options:
    - `joinErrs` is an optional argument to join the error list (it can be a string to join on or true for `.join('; ')`)

## Installation

`npm install fanin`

## Tests

`npm test`

## License

MIT License found in the LICENSE file. 

  [1]: https://travis-ci.org/yanatan16/node-fanin.png?branch=master
  [2]: http://travis-ci.org/yanatan16/node-fanin

