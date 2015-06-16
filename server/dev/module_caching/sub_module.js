var something = require('./something_to_use');

exports.print = function() {
    something.count++;
    console.log(something.count);
}