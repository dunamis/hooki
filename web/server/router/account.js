var router = require('express').Router();
var cp = require('../modules/contentprovider');

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

router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (email && password && checkLoginInput(email, password)) {
        req.session.email = req.body.email;
        console.log(req.session.email + ' login');
        res.send({
            success : true
        });
    } else {
        res.send({
            success : false,
            msg : '아이디 혹은 패스워드가 틀립니다.'
        });
    }
});

router.get('/logout', function(req, res) {
    console.log(req.session.email + ' logout');
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
