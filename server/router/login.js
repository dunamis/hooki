function checkLoginInput(email, passwd) {
    if (email === 'a@mail.com' || email === 'b@mail.com') {
        return true;
    } else {
        return false;
    }
};

exports.login = function(req, res) {
    res.render('views/login_service', req.ejsData);
};

exports.submitLoginForm = function(req, res) {
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
};

exports.logout = function(req, res) {
    console.log(req.session.email + ' logout');
    req.session.destroy();
    res.redirect('/');
};
