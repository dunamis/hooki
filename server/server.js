var HookiProvider = require("./hookiprovider").HookiProvider;
var LoginService = require("./loginservice");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var process = require('process');
var fs = require('fs');
var path = require('path');
var curDB;
var multer = require('multer');
var Grid = require('gridfs-stream');
var gfs;

// 개발을 위한 포트 및 DB 이름
var WEBSERVER_PORT_LIST = {
    'sang' : 11111,
    'ciogenis' : 22222,
    'soopdop' : 33333
};
var WEBSERVER_PORT = process.env['port'] || WEBSERVER_PORT_LIST[process.env['USER']];
var DB_NAME = process.env['USER'] + '_hooki';

// 웹서버 객체
var WebServer = {
    server : null,
    mongoDb : null,
    Init : function() {
        var _this = this;

        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '/../client/template'));

        // mongodb 초기화 및 후기 객체 생성
        var hookiProvider = new HookiProvider('localhost', 27017, DB_NAME);

        // login service initialization
        var loginService = new LoginService();

        // body parser middleware 사용
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended : true
        }));

        // static 파일 요청 처리
        app.use('/static', express.static(path.join(__dirname, '/../client/static/')));

        // favicon 처리
        app.get('/favicon.ico', function(req, res) {
            res.sendFile(path.join(__dirname, '../client/static/img/favicon.ico'), {
                headers : {
                    "Content-Type" : "image/x-icon"
                }
            }, function(err) {
                if (err)
                    throw err;
            });
        });

        // page 요청 라우팅
        app.get('/', function(req, res) {
            res.redirect('/hooki');
            res.end();
        });

        app.get('/hooki', function(req, res) {
            hookiProvider.findAll(10, function(err, hookis) {
                var loginStatus = req.param('login');
                console.log(items.length);
                res.render('views/hooki', {
                    hookis : items,
                    subPageName : 'hooki',
                    login : loginService.getLoginStatus()
                });
            });
        });

        app.get('/login_service', function(req, res) {
            res.render('views/login_service', {
                subPageName : "login",
                login : loginService.getLoginStatus()
            });
        });

        //임시로 사용중이 인 것임.
        app.get('/:subPageName', function(req, res) {
            var subPageName = req.params.subPageName;
            console.log('call page:' + subPageName);
            res.render('views/' + subPageName, {
                title : 'Start page',
                subPageName : subPageName,
            });
        });
        /*
         app.get('/write', function(req, res) {
         res.render('views/write', {
         title : 'Write page'
         });
         });
         */
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
            var login = false;
            var username = req.body.username;
            var password = req.body.password;

            login = loginService.checkLoginInput(username, password);

            if (login === true) {
                res.redirect('/review');
            } else {
                res.redirect('/login_service');
            }
        });

        app.post('/logout', function(req, res) {
            console.log('logout');
            loginService.setLoginStatus("-1");

            res.redirect('/review');
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
                console.log(items);
                res.send(items);
            });
        });

        this.server = app.listen(WEBSERVER_PORT);
        console.log('web server is started, http://104.238.148.30:' + WEBSERVER_PORT);
    }
};

(function() {
    WebServer.Init();
})();

