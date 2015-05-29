var MongoClient = require('mongodb').MongoClient;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var process = require('process');
var fs = require('fs');
var path = require('path');
var PORT = process.env['port'] || "";
var curDB;

// 웹서버 객체
var WebServer = {
    server : null,
    mongoDb : null,
    Init : function() {
        var _this = this;

        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '/../client/template'));

        // mongodb 초기화
        MongoClient.connect('mongodb://localhost:27017/hooki', function(err, db) {
            if (err)
                throw err;

            curDB = db;
            // insert dummy data
            var collection = curDB.collection('review');
            collection.remove(null, {
                safe : true
            }, function(err, result) {
                if (err)
                    throw err;
                for (var i = 0; i < 20; i++) {
                    collection.insert({
                        title : 'title',
                        score : i,
                        date : new Date(),
                        tag : 'tag' + i,
                        content : 'Content' + i
                    });
                }
            });
        });

        // body parser middleware 사용
        app.use(bodyParser.json());

        // static 파일 요청 처리
        app.use('/static', express.static(path.join(__dirname, '/../client/static/')));

        // page 요청 라우팅
        app.get('/', function(req, res) {
            res.redirect('/start/review');
            res.end();
        });

        app.get('/start/review', function(req, res) {
            curDB.collection('review').find().limit(10).toArray(function(err, items) {
                console.log(items.length);
                res.render('views/start/review', {
                    reviews : items,
                    subPageName : 'review'
                });
            });
        });

        app.get('/start/:subPageName', function(req, res) {
            var subPageName = req.params.subPageName;
            res.render('views/start/' + subPageName, {
                title : 'Start page',
                subPageName : subPageName
            });
        });

        app.get('/write', function(req, res) {
            res.render('views/write', {
                title : 'Write page'
            });
        });

        app.get('/view/:pageId', function(req, res) {
            var pageId = req.params.pageId;
            res.render('views/view', {
                title : 'View page',
                pageId : pageId
            });
        });

        app.get('/profile/:userId', function(req, res) {
            var userId = req.params.userId;
            res.render('views/profile', {
                title : 'Profile page',
                userId : userId
            });
        });

        app.get('/product/:productId', function(req, res) {
            var productId = req.params.productId;
            res.render('views/product', {
                title : 'Proudct page',
                productId : productId
            });
        });

        this.server = app.listen(PORT);
    }
};

(function() {
    WebServer.Init();
})();

