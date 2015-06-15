var express = require('express');

// FIXME : 멀티 컨넥션이 고려되지 않음. express-session으로 재구현 요망.
var loginStatus;

LoginService = function() {
    loginStatus = '-1'

    console.log("new loginservice");
};

LoginService.prototype.checkLoginInput = function(userid, passwd) {
    console.log("check login input");

    if (userid === 'ciogenis@gmail.com' && passwd === '1234') {
        loginStatus = '1';
        return true;
    }
    else {
        loginStatus = '0';
        return false;
    }
};

LoginService.prototype.getLoginStatus = function() {
    console.log("get login status : " + loginStatus);

    return loginStatus;
};

LoginService.prototype.setLoginStatus = function(input) {
    console.log("set login status : " + input);
    loginStatus = input;

    console.log("current status : " + loginStatus);
}

module.exports = LoginService;
