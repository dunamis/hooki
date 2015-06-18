var checkLoginInput = function(userid, passwd) {
    if (userid === 'ciogenis@gmail.com' && passwd === '1234') {
        return "success";
    }
    else {
        return "fail";
    }
};

exports.login = function(req, res) {
    res.render('views/login_service', {
        login : req.loginRouter.getLoginStatus(req)
    });
};

exports.submitLoginForm = function(req, res) {
    var users = req.session.users;
    var username = req.body.username;
    var password = req.body.password;

    if (!users) {
        users = req.session.users = {};
    }

    users[req.sessionID] = checkLoginInput(username, password);

    if (users[req.sessionID] === "success") {
        // FIXME: 로그인 후 redirect는 로그인하기 직전의 페이지로 이동해야 함.
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
};

exports.logout = function(req, res) {
    console.log('logout');
    req.loginRouter.setLoginStatus(req, undefined);

    res.redirect('/');
};

exports.getLoginStatus = function(req) {
    if (!req.session.users) {
        console.log("no req.session.users");
        return undefined;
    }

    console.log("sid : " + req.sessionID);
    console.log("get login status : " + req.session.users[req.sessionID]);

    return req.session.users[req.sessionID];
};

exports.setLoginStatus = function(req, input) {
    if (!req.session.users) {
        console.log("no req.session.users");
        return false;
    }

    req.session.users[req.sessionID] = input;
};
