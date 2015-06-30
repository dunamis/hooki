var router = require('express').Router();
var cp = require('../modules/contentprovider');

router.get('/', function(req, res) {
    cp.getHookiListAll(100, function(err, hookis) {
        req.ejsData.hookis = hookis;
        cp.getTagList({
            limits : 100
        }, function(items) {
            console.log(items);
            req.ejsData.tags = items;
            res.render('views/hooki', req.ejsData);
        });
    });
});

router.get('/tagged/:tag', function(req, res) {

});

router.get('/read/:sn', function(req, res) {
    var sn = Number(req.params.sn);
    console.log('call getHookiContent', sn);
    cp.getHookiContent({
        'sn' : sn
    }, function(hooki) {
        if (hooki) {
            req.ejsData.hooki = hooki;
            res.render('views/read', req.ejsData);
        } else {
            res.send('없는 문서');
        }
    });
});

router.get('/write', function(req, res) {
    res.render('views/write', req.ejsData);
});

router.post('/write', function(req, res) {
    var title = req.body.title;
    var content = req.body.content;
    cp.writeHooki({
        'email' : req.login.email,
        'title' : title,
        'content' : content,
        'date' : new Date()
    }, function(sn) {
        if (sn) {
            cp.removeDraft(req.login.email, function(result) {
                res.send({
                    success : true,
                    sn : sn
                });
            });
        } else {
            res.send({
                success : false,
                msg : '에러메시지'
            });
        }
    });
});

router.get('/draft', function(req, res) {
    cp.getHookiDraft({
        'email' : req.login.email
    }, function(result) {
        res.send(result);
    });
});

router.post('/draft', function(req, res) {
    var title = req.body.title;
    var content = req.body.content;
    cp.upsertHookiDraft({
        'email' : req.login.email,
        'title' : title,
        'content' : content
    }, {}, function(result) {
        if (result) {
            res.send({
                success : true
            });
        } else {
            res.send({
                success : false,
                msg : '에러메시지'
            });
        }
    });
});

module.exports = router;