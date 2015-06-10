var HookiProvider = require("./hookiprovider").HookiProvider;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var process = require('process');
var fs = require('fs');
var path = require('path');
var PORT = process.env['port'] || "";
var curDB;
var multer = require('multer');
var Grid = require('gridfs-stream');
var gfs;

// 웹서버 객체
var WebServer = {
    server : null,
    mongoDb : null,
    Init : function() {
        var _this = this;

        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '/../client/template'));

        // mongodb 초기화 및 후기 객체 생성
        var hookiProvider = new HookiProvider('localhost', 27017);

        // body parser middleware 사용
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended : true
        }));

        // static 파일 요청 처리
        app.use('/static', express.static(path.join(__dirname, '/../client/static/')));

        // page 요청 라우팅
        app.get('/', function(req, res) {
            res.redirect('/start/review');
            res.end();
        });

        app.get('/start/review', function(req, res) {
            hookiProvider.findAll(10, function(err, items) {
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

        app.use(multer({
            upload : null,
            onFileUploadStart : function(file) {
                console.log('[onFileUploadStart]' + file.originalname + ' is starting ...');
                this.upload = gfs.createWriteStream({
                    filename : file.originalname
                });
            },
            onFildUploadData : function(files, data) {
                this.upload.write(data);
            },
            onFileUploadComplete : function(file) {
                console.log('[onFileUploadComplete]' + file.fieldname + ' uploaded to  ' + file.path);
                this.upload.end();
                done = true;
            }
        }));

        app.post('/api/photo', function(req, res) {
            if (done == true) {
                console.log(req.files);
                res.end("File uploaded.");
            }
        });

        app.get('/profile/:userId', function(req, res) {
            var userId = req.params.userId;
            res.render('views/profile', {
                title : 'Profile page',
                userId : userId
            });
        });

        app.get('/view/:pageId', function(req, res) {
            var pageId = req.params.pageId;
            res.render('views/view', {
                title : 'View page',
                pageId : pageId
            });
        });

        app.get('/product/:productId', function(req, res) {
            var productId = req.params.productId;
            res.render('views/product', {
                title : 'Proudct page',
                productId : productId
            });
        });

        app.post('/login', function(req, res) {
            console.log('post /login');
            console.log(req.body);

            res.redirect('/');
        });

        app.post('/autoComplete', function(req, res) {
            var c = req.body.c;
            console.log('[autoComplete 요청]', c);
            var condition = {
                'title' : {
                    $regex : '.*' + c + '.*'
                }
            };
            hookiProvider.findByCondition(condition, function(err, items) {
                res.send(items);
            });
        });

        this.server = app.listen(PORT);
    }
};

(function() {
    WebServer.Init();
})();

