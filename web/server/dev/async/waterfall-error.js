var async = require('async');

async.waterfall([
function A(next) {
    console.log('A');
    next('err-msg', 'result1');
},
function B(arg, next) {
    console.log('B');
    console.log('arg', arg);
    next(null, 'result2');
}], function C(error, results) {
    console.log('C');
    console.log('error', error)
    console.log('results', results)
});
