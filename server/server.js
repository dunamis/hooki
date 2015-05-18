var MongoClient = require('mongodb').MongoClient;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var process = require('process');
var fs = require('fs');
var PORT = process.env['port'] || "";

// 웹서버 객체
var WebServer = {
    server : null,
    mongoDb : null,
    Init : function() {
        var _this = this;

        // mongodb 초기화
        /*MongoClient.connect("mongodb://localhost:27027/hooki", function(err, db) {
            if (err)
                throw err;
            else
                _this.mongoDb = db;
        });*/

        // body parser middleware 사용
        app.use(bodyParser.json());

        // static 파일 요청 처리
        app.use('/static', express.static(__dirname + '/../client/static'));

        // page 요청 라우팅
        app.get('/', function(req, res) {
           res.redirect('/start');
           res.end();
        });

        // page 요청 라우팅
        app.get('/start', function(req, res) {
           res.end('start page');
        });


        app.get('/start/:subPageName', function(req, res) {
            var subPageName = req.params.subPageName;
            res.end('start page - ' + subPageName);
        });

        app.get('/write', function(req, res) {
            res.end('write page');
        });

        app.get('/view/:pageId', function(req, res) {
            var pageId = req.params.pageId;
            res.end('view page - ' + pageId);
        });

        app.get('/profile/:userId', function(req, res) {
            var userId = req.params.userId;
            res.end('profile page - ' + userId);
        });

        app.get('/product/:productCode', function(req, res) {
            var productCode = req.params.productCode;
            res.end('product page - ' + productCode);
        });

        this.server = app.listen(PORT);
    }
};

(function() {
    WebServer.Init();
})();

