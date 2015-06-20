var mongoClient = require('mongodb').MongoClient,
    process = require('process'),
    db = null,
    url = null;

exports.connect = function(callback) {
    var host = 'localhost';
    var port = 27017;
    //개발용 db이름
    var dbName = process.env['USER'] + '_hooki';
    url = 'mongodb://' + host + ':' + port + '/' + dbName;

    mongoClient.connect(url, function(error, d) {
        if (error)
            throw error;
        else {
            db = d;
            callback();
        }
    });
};

exports.getUrl = function() {
    return url;
};

exports.getDb = function() {
    return db;
};