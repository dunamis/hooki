var startServer = require('./server');
var process = require('process');

// 개발을 위한 포트
var WEBSERVER_PORT_LIST = {
    'sang' : 11111,
    'ciogenis' : 22222,
    'soopdop' : 33333
};

var WEBSERVER_PORT = process.env['wp'] || WEBSERVER_PORT_LIST[process.env['USER']];

(function() {
    startServer(WEBSERVER_PORT);
})();
