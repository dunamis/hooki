var router = require('express').Router();
var cp = require('../modules/contentprovider');

router.get('/', function(req, res) {
    res.render('views/product', req.ejsData);
});

router.get('/detail', function(req, res) {
    res.send('');
});

module.exports = router;