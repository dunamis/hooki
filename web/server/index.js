var dbcon = require('./modules/dbconnector'), HookiProvider = require("./modules/hookiprovider").HookiProvider, express = require("express"), bodyParser = require("body-parser"), session = require("express-session"), process = require('process'), fs = require('fs'), path = require('path'), multer = require('multer'), Grid = require('gridfs-stream'), mongoSessStore = require('connect-mongo')(session), curDB, gfs;

function createServer(port) {
    dbcon.connect(function() {
        var app = express();

        // EJS 설정
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '/../client/template'));

        addMiddleware(app);
        addRouter(app);
        app.listen(port);
        console.log('web server is started, http://104.238.148.30:' + port);
    });
}

function addMiddleware(app) {
    // express-session
    app.use(session({
        secret : 'hooki hooki',
        resave : false,
        store : new mongoSessStore({
            url : dbcon.getUrl(),
            ttl : 60 * 60,
        })
    }));

    // login을 위한 middleware
    app.use(require('./middleware/login.js'));

    // body parser middleware 사용
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended : true
    }));

    // static 파일 요청 처리
    app.use('/static', express.static(path.join(__dirname, '/../client/static/')));

    // FIXME: 임시..
    var DB_NAME = process.env['USER'] + '_hooki';
    var hookiProvider = new HookiProvider('localhost', 27017, DB_NAME);

    // provider 및 ejs 공통 데이터 삽입을 위한  middleware
    app.use('/*', function(req, res, next) {
        req.hookiProvider = hookiProvider;
        req.ejsData = {};
        req.ejsData.loginStatus = req.login.loginStatus;
        req.ejsData.email = req.login.email;
        next();
    });

    // submenu 표시를 위한 middleware
    app.use('/:submenu*', require('./middleware/submenu.js'));

    // multer : multipart data 핸들링
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
};

function addRouter(app) {
    app.use('/', require('./router/singlepages'));
    app.use('/hooki', require('./router/hooki'));
    app.use('/tags', require('./router/tags'));
    app.use('/users',require('./router/users'));
    app.use('/request', require('./router/request'));
    app.use('/product', require('./router/product'));
    app.use('/account', require('./router/account'));
    app.use('/ajax', require('./router/ajax'));
//
    // app.get('/tags', tagsRouter.list);
    // app.get('/users', usersRouter.list);
    // app.get('/users/:nick', usersRouter.detail);
    // app.get('/request', requestRouter.request);
    // app.post('/request', requestRouter.submitForm);
    // app.get('/product', productsRouter.list);
    // app.get('/product/:productName', productsRouter.detail);
    // app.post('/search', ajaxRouter.search);
};

exports = module.exports = function(port) {
    createServer(port);
};
