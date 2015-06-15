exports.login = function(req, res) {
    res.render('views/login_service', {
        login : req.loginService.getLoginStatus()
    });
};

exports.submitLoginForm = function(req, res) {
    var login = false;
    var username = req.body.username;
    var password = req.body.password;

    login = req.loginService.checkLoginInput(username, password);

    if (login === true) {
        // FIXME: 로그인 후 redirect는 로그인하기 직전의 페이지로 이동해야 함.
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
};

exports.logout = function(req, res) {
    console.log('logout');
    req.loginService.setLoginStatus("-1");
    res.redirect('/');
};