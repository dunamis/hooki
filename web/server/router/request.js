var router = require('express').Router();
var cp = require('../modules/contentprovider');

router.get('/', function(req, res) {
    res.render('views/request', req.ejsData);
});

router.get('/submitForm', function(req, res) {
    res.send('');
});

module.exports = router;