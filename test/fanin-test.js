/*global suite, test*/

var assert = require("assert")
  , fanin = require("../lib/fanin.js")

describe("fanin", function () {
    it("exists", function () {
        assert(typeof fanin === "function", "fanin is not a function");
    });

    describe("#fanin()", function () {
        it("fanin when called with 0 invokes", function (done) {
            fanin(0, setup(done));
        });

        it("fanin 1", function (done) {
            var fan = fanin(1, setup(done));
            fan();
        });

        it("fanin 5", function (done) {
            var fan = fanin(5, setup(done))
                , i = 5;

            while (i--) {
                fan();
            }
        });

        it("fanin errors", function (done) {
            var fan = fanin(1, setup(done, ['err1']));

            fan('err1');
        });

        it("fanin errors 2", function (done) {
            var fan = fanin(2, setup(done, ['err1', {error: 'yo'}]));

            fan('err1');
            fan({error: 'yo'});
        });

        it("fanin errors join", function (done) {
            var fan = fanin(5, setup(done, '4 - 3 - 2 - 1 - 0'), {joinErrs: ' - '})
              , i = 5;

            while (i--) {
              fan('' + i);
            }
        });

        it("fanin errors join default", function (done) {
            var fan = fanin(5, setup(done, '1; 2; 3; 4; 5'), {joinErrs: true})
              , i = 5;

            while (i--) {
              fan('' + (5-i));
            }
        });

        it('fanin obj', function (done) {
          var fan = fanin(1, setup(done, undefined, {foo: 'retval'}))
            , cb = fan.capture('foo');

          cb(undefined, 'retval');
        });

        it('fanin mixed', function (done) {
          var fan = fanin(3, setup(done, ['ERROR on foo', 'ERROR on baz'], {foo: undefined, bar: {hello: 123}}));

          fan.capture('foo')('ERROR on foo');
          fan.capture('bar')(undefined, {hello: 123});
          fan('ERROR on baz');
        });
    })
});

function setup(f, exp_err, exp_obj) {
  return function (err, obj) {
    // console.log('exp_err',exp_err,'err',err, 'exp_obj',exp_obj, 'obj',obj);
    assert.deepEqual(exp_err, err);
    assert.deepEqual(exp_obj, obj);
    f()
  };
}