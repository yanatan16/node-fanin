node-fanin [![Build Status][1]][2]
==========

A simple concurrency pattern: fan-in

Status: Untested in production, but ready to be.

## Why do you need fan-in?

- You want to make `n` asynchronous calls simultaneously and make a callback when all have finished.
- You may want to save the callback values of these calls, and definitely want the errors.
- You just want that. Nothing else.

## API

Usage:

    var fanin = require('fanin')
      , fan = fanin(number_of_callbacks, final_callback);

    asyncCall(fan); // repeat...
    asyncCall(fan.capture('field'));
    asyncCall(fan.ordered(index));
    ...
    fan.timeout(err)


    // final_callback( error_array, )

Basic Usage (no return values, just an unorded list of errors):

    var fan = fanin(2, cb);
 
    foo(fan);
    bar(fan);

    function foo(cb) { cb(new Error('some error')); }

    function bar(cb) { cb(null); }

    // cb([ Error('some error') ]);

Storing return value(s):

    var fan = fanin(2, cb);
 
    foo(fan.capture('foo'));
    bar(fan.capture('bar'));

    function foo(cb) { cb(null, 'foobaz'); }

    function bar(cb) { cb(null, 'barbaz'); }

    // cb(undefined, { foo: 'foobaz', bar: 'barbaz' } );

Storing return values in an ordered array:

    var fan = fanin(2, cb);
 
    foo(fan.ordered(1));
    bar(fan.ordered(0));

    function foo(cb) { cb(null, 'foobaz'); }

    function bar(cb) { cb(null, 'barbaz'); }

    // cb(undefined, { ordered: [ 'barbaz', 'foobaz' ] } );

Timeouts on these calls:

    var fan = fanin(2, cb);

    fan.timeout(new Error('timeout!'));

    // cb([ Error('timeout!') ])


## Installation

`npm install fanin`

## Tests

`npm test`

## License

MIT License found in the LICENSE file. 

  [1]: https://travis-ci.org/yanatan16/node-fanin.png?branch=master
  [2]: http://travis-ci.org/yanatan16/node-fanin

