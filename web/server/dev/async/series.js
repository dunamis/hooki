var async = require('async');

async.series([
function A(next) {
    console.log('A');
    next(null, 'result1');
},
function B(next) {
    console.log('B');
    next(null, 'result2');
}], function C(error, results) {
    console.log('C');
    console.log('error', error)
    console.log('results', results)
});
