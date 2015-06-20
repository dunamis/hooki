var router = require('express').Router();
var cp = require('../modules/contentprovider');


router.get('/', function(req, res) {
    res.render('views/tags', req.ejsData);
});

module.exports = router;