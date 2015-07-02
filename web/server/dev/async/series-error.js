var async = require('async');

async.series([
function D(next) {
    console.log('D');
    next('err-msg', 'result1');
},
function E(next) {
    console.log('E');
    next(null, 'result2');
}], function F(error, results) {
    console.log('F');
    console.log('error', error)
    console.log('results', results)
});
