var router = require('express').Router();
var cp = require('../modules/contentprovider');

router.get('/', function(req, res) {
    req.hookiProvider.findAll(10, function(err, hookis) {
        req.ejsData.hookis = hookis;
        cp.getTagList({
            limits : 100
        }, function(items) {
            req.ejsData.tags = items;
            res.render('views/hooki', req.ejsData);
        });
    });
});

router.get('/tagged/:tag', function(req, res) {

});

router.get('/read/:id', function(req, res) {
    var id = req.params.id;
    req.ejsData.id = id;
    res.render('views/read', req.ejsData);
});

router.get('/write', function(req, res) {
    res.render('views/write', req.ejsData);
});

router.post('/write', function(req, res) {
});

router.get('/write/draft', function(req, res) {
});

router.post('/write/draft', function(req, res) {
});

module.exports = router;
