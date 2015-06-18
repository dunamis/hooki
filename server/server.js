var HookiProvider = require("./hookiprovider").HookiProvider;
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
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

//라우터
var hookiRouter = require('./subpage/hooki');
var tagsRouter = require('./subpage/tags');
var usersRouter = require('./subpage/users');
var productsRouter = require('./subpage/product');
var loginRouter = require('./subpage/login');
var singlePagesRouter = require('./subpage/singlepages');
var requestRouter = require('./subpage/request');
var ajaxRouter = require('./subpage/ajax');

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

        app.use(session({
            secret: 'hooki hooki',
            resave: false
        }));

        // body parser middleware 사용
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended : true
        }));

        // static 파일 요청 처리
        app.use('/static', express.static(path.join(__dirname, '/../client/static/')));

        // page 요청 라우팅
        app.get('/', function(req, res) {
            res.redirect('/home');
            res.end();
        });

        // provider 삽입을 위한  middleware
        app.use('/*', function(req, res, next) {
            req.hookiProvider = hookiProvider;
            // INFO : loginService 없애고, 일단 순동이 만든 router file에 기능추가
            //        login에 필요한 별도기능들을 모아서 middleware를 만들어 볼 예정
            req.loginRouter = loginRouter;
            next();
        });

        // submenu 표시를 위한 middleware
        app.use('/:submenu*', function(req, res, next) {
            var submenu = req.params.submenu;
            if (['hooki', 'tags', 'users', 'request', 'product'].indexOf(submenu) != -1) {
                req.submenu = submenu;
            }
            next();
        });

        // 신나게 라우팅
        app.get('/favicon.ico', singlePagesRouter.favicon);
        app.get('/home', singlePagesRouter.home);
        app.get('/hooki', hookiRouter.list);
        app.get('/hooki/tagged/:tag', hookiRouter.taggedList);
        app.get('/hooki/read/:pageId', hookiRouter.read);
        app.get('/hooki/write', hookiRouter.write);
        app.post('/hooki/write', hookiRouter.submitWriteForm);
        app.get('/hooki/write/draft', hookiRouter.draft);
        app.post('/hooki/write/draft', hookiRouter.submitDraftForm);
        app.get('/tags', tagsRouter.list);
        app.get('/users', usersRouter.list);
        app.get('/users/:nick', usersRouter.detail);
        app.get('/request', requestRouter.request);
        app.post('/request', requestRouter.submitForm);
        app.get('/product', productsRouter.list);
        app.get('/product/:productName', productsRouter.detail);
        app.get('/login', loginRouter.login);
        app.post('/login', loginRouter.submitLoginForm);
        app.get('/logout', loginRouter.logout);

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
                // FIXME : 자바스크립트 변수 사용시 항상 var로 선언 할것. 그렇지 않은 경우 global 변수로 선언됨.
                // 참고로 자바스크립트의 변수 scope는 함수임.
                // 걍 테스트 용이라 믿고 있음.
                done = true;
            }
        }));

        app.post('/api/photo', function(req, res) {
            // FIXME : 멀티 컨넥션이 고려되지 않음. 걍 테스트 용이라 믿고 있음.
            if (done == true) {
                console.log(req.files);
                res.end("File uploaded.");
            }
        });

        this.server = app.listen(WEBSERVER_PORT);
        console.log('web server is started, http://104.238.148.30:' + WEBSERVER_PORT);
    }
};

(function() {
    WebServer.Init();
})();

