//CSV to JSON : http://codebeautify.org/csv-to-xml-json
var hooki = require('./hooki').data;
var user = require('./user').data;
var tag = require('./tag').data;
var product = require('./product').data;
var request = require('./request').data;
var seq = require('./seq').data;

var async = require('async');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var process = require('process');
var DB_NAME = process.env['USER'] + '_hooki';
var db;


var allData = [{
    'collectionName' : 'hooki',
    'data' : hooki
}, {
    'collectionName' : 'user',
    'data' : user
}, {
    'collectionName' : 'tag',
    'data' : tag
}, {
    'collectionName' : 'product',
    'data' : product
}, {
    'collectionName' : 'request',
    'data' : request
}, {
    'collectionName' : 'seq',
    'data' : seq
}];

var insertFunctions = (function() {
    var funcArray = [];
    var func;
    for (var i = 0; i < allData.length; i++) {
        func = (function(funcNum) {
            return function(nextCollection) {
                var collection = db.collection(allData[funcNum].collectionName);
                var date = new Date();
                collection.remove(null, {
                    safe : true
                }, function(err, result) {
                    if (err)
                        throw err;
                    console.log(allData[funcNum].collectionName, '시작');
                    async.each(allData[funcNum].data, function(item, nextItem) {
                        console.log(item);
                        collection.insert(item, function(err, result) {
                            if (err)
                                throw err;
                            nextItem();
                        });
                    }, function(err) {
                        console.log(allData[funcNum].collectionName, '끝');
                        nextCollection();
                    });
                });
            };
        })(i);
        funcArray.push(func);
    }
    return funcArray;
})();

insertFunctions.push(function() {
    console.log('다 끝');
    process.exit(0);
})
// mongodb 초기화
MongoClient.connect('mongodb://localhost:27017/' + DB_NAME, function(err, d) {
    if (err) {
        throw err;
    }

    db = d;

    async.series(insertFunctions);
});

