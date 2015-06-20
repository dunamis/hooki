var router = require('express').Router();
var cp = require('../modules/contentprovider');


router.get('/', function(req, res) {
    var userName = req.params.userName;
    req.ejsData.userName = userName;
    res.render('views/users', req.ejsData);
});


router.get('/detail', function(req, res) {
    var userName = req.params.userName;
    req.ejsData.userName = userName;
    res.render('views/users', req.ejsData);
});

module.exports = router;