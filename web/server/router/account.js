var router = require('express').Router();
var cp = require('../modules/contentprovider');

var passport = require('passport-local');

function checkLoginInput(email, passwd) {
    if (email === 'a@mail.com' || email === 'b@mail.com') {
        return true;
    } else {
        return false;
    }
};

router.get('/login', function(req, res) {
    res.render('views/login_service', req.ejsData);
});

router.get('/logout', function(req, res) {
    console.log(req.session.email + ' logout');
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
