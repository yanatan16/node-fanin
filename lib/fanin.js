// Fan-in concurrency pattern
// You want to make `total` asynchronous calls simultaneously and make a callback when all have finished.
// You may want to save the callback values of these calls, and definitely want the errors
// fan = fanin(n, cb) returns a function which will act as a callback to the sub-calls in which you only care about errors
// fan.capture(name) will act as a callback to the sub-calls which you care about return value (placing them in an object under the key `name`).
// fan.ordered(i) will place the return value(s) in an array under object.ordered.
// fan.timeout(err) will force the fanin pattern to shortcut to the final callback with the attached error.

module.exports = fanin;

function fanin(total, callback) {
  if (total === 0) {
    callback();
    return
  }

  var errs = []
    , objs = {}
    , has_objs = false
    , cnt = 0
    , fan = function (err) {
        cnt += 1;
        if (err) errs.push(err);
 
        if (cnt === total)
          callback(errs.length ? errs : undefined, has_objs ? objs : undefined);
      };
      
    fan.capture = function (name) {
      has_objs = true;
      return function (err) {
        if (arguments.length > 2) {
          objs[name] = Array.prototype.slice.call(arguments, 1);
        } else {
          objs[name] = arguments[1];
        }
        fan(err);
      };
    };

    fan.ordered = function (i) {
      has_objs = true;
      objs.ordered = objs.ordered || [];
      return function (err) {
        if (arguments.length > 2) {
          objs.ordered[i] = Array.prototype.slice.call(arguments, 1);
        } else {
          objs.ordered[i] = arguments[1];
        }
        fan(err);
      };
    };

    fan.timeout = function (err) {
      if (cnt < total) cnt = total - 1;
      fan(err);
    };
    
    return fan;
};