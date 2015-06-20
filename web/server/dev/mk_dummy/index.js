//CSV to JSON : http://codebeautify.org/csv-to-xml-json
var hooki = require('./hooki').data;
var user = require('./user').data;
var tag = require('./tag').data;
var product = require('./product').data;
var request = require('./request').data;

var async = require('async');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var process = require('process');
var DB_NAME = process.env['USER'] + '_hooki';

// mongodb 초기화
MongoClient.connect('mongodb://localhost:27017/' + DB_NAME, function(err, db) {
    if (err) {
        throw err;
    }

    async.series([
    function(nextCollection) {
        var collection = db.collection('hooki');
        var date = new Date();
        collection.remove(null, {
            safe : true
        }, function(err, result) {
            if (err)
                throw err;
            console.log('hooki 시작');
            async.each(hooki, function(item, nextItem) {
                console.log(item);
                collection.insert(item, function(err, result) {
                    if (err)
                        throw err;
                    nextItem();
                });
            }, function(err) {
                console.log('hooki 끝');
                nextCollection();
            });
        });
    },
    function(nextCollection) {
        var collection = db.collection('user');
        var date = new Date();
        collection.remove(null, {
            safe : true
        }, function(err, result) {
            if (err)
                throw err;
            console.log('user 시작');
            async.each(user, function(item, nextItem) {
                console.log(item);
                collection.insert(item, function(err, result) {
                    if (err)
                        throw err;
                    nextItem();
                });
            }, function(err) {
                console.log('user 끝');
                nextCollection();
            });
        });
    },
    function(nextCollection) {
        var collection = db.collection('tag');
        var date = new Date();
        collection.remove(null, {
            safe : true
        }, function(err, result) {
            if (err)
                throw err;
            console.log('tag 시작');
            async.each(tag, function(item, nextItem) {
                console.log(item);
                collection.insert(item, function(err, result) {
                    if (err)
                        throw err;
                    nextItem();
                });
            }, function(err) {
                console.log('tag 끝');
                nextCollection();
            });
        });
    },
    function(nextCollection) {
        var collection = db.collection('product');
        var date = new Date();
        collection.remove(null, {
            safe : true
        }, function(err, result) {
            if (err)
                throw err;
            console.log('product 시작');
            async.each(product, function(item, nextItem) {
                console.log(item);
                collection.insert(item, function(err, result) {
                    if (err)
                        throw err;
                    nextItem();
                });
            }, function(err) {
                console.log('product 끝');
                nextCollection();
            });
        });
    },
    function(nextCollection) {
        var collection = db.collection('request');
        var date = new Date();
        collection.remove(null, {
            safe : true
        }, function(err, result) {
            if (err)
                throw err;
            console.log('request 시작');
            async.each(request, function(item, nextItem) {
                console.log(item);
                collection.insert(item, function(err, result) {
                    if (err)
                        throw err;
                    nextItem();
                });
            }, function(err) {
                console.log('request 끝');
                nextCollection();
            });
        });
    },
    function(){
        console.log('다 끝');
        process.exit(0);
    }]);
});

