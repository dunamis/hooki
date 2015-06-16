exports.login = function(req, res) {
    res.render('views/login_service', {
        login : req.loginService.getLoginStatus(req)
    });
};

exports.submitLoginForm = function(req, res) {
    var users = req.session.users;
    var login = false;
    var username = req.body.username;
    var password = req.body.password;

    if (!users) {
        users = req.session.users = {};
    }

    users[req.sessionID] = "undefined";
    login = req.loginService.checkLoginInput(req, username, password);

    if (login === true) {
        users[req.sessionID] = "success";

        // FIXME: 로그인 후 redirect는 로그인하기 직전의 페이지로 이동해야 함.
        res.redirect('/');
    } else {
        users[req.sessionID] = "fail";
        res.redirect('/login');
    }
};

exports.logout = function(req, res) {
    console.log('logout');
    req.loginService.setLoginStatus(req, "undefined");
    res.redirect('/');
};