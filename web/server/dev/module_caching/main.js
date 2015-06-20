// Module caching
// 이곳을 참조하시오.
http://nodejs.org/docs/v0.4.12/api/modules.html#caching

var sub = require('./sub_module');
var something = require('./something_to_use');

something.count++;
something.count++;
something.count++;

sub.print();
