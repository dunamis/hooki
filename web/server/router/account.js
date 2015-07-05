var router = require('express').Router();
var cp = require('../modules/contentprovider');

var passport = require('passport-local');

router.get('/login', function(req, res) {
    res.render('views/login_service', req.ejsData);
});

router.get('/logout', function(req, res) {
    console.log(req.user.displayName + ' logout');
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
