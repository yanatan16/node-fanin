// Fan-in concurrency pattern
// You want to make `total` asynchronous calls simultaneously and make a callback when all have finished.
// You may want to save the callback values of these calls, and definitely want the errors
// fan = fanin(n, cb) returns a function which will act as a callback to the sub-calls in which you only care about errors
// fan.capture(name) will act as a callback to the sub-calls which you care about return value (placing them in an object under the key `name`.
// options:
//   joinErrs is an optional argument to join the error list (it can be a string to join on or true for .join('; '))

module.exports = fanin;

function fanin(total, callback, opts) {
  if (total === 0) {
    callback();
    return
  }

  opts = opts || {};

  var errs = []
    , objs = {}
    , has_objs = false
    , cnt = 0
    , reterr = function (errs) {
        if (errs && errs.length) {
          if (opts && opts.joinErrs) {
            return errs.join(opts.joinErrs === true ? '; ' : opts.joinErrs);
          } else {
            return errs;
          }
        } else {
          return undefined
        }
      }
    , fan = function (err) {
        cnt += 1;
        if (err) errs.push(err);
 
        if (cnt === total)
          callback(reterr(errs), has_objs ? objs : undefined);
      };
      
    fan.capture = function (name) {
      has_objs = true;
      return function (err, obj) {
        objs[name] = obj;
        fan(err);
      };
    };
    
    return fan;
};