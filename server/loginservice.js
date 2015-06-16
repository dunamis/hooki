var express = require('express');

LoginService = function() {
    console.log("new loginservice");
};

LoginService.prototype.checkLoginInput = function(req, userid, passwd) {
    if (userid === 'ciogenis@gmail.com' && passwd === '1234') {
        req.session.users[req.sessionID] = "success";
        return true;
    }
    else {
        req.session.users[req.sessionID] = "fail";
        return false;
    }
};

LoginService.prototype.getLoginStatus = function(req) {
    if (!req.session.users) {
        return "undefined";
    }

    console.log("sid : " + req.sessionID);
    console.log("get login status : " + req.session.users[req.sessionID]);

    return req.session.users[req.sessionID];
};

LoginService.prototype.setLoginStatus = function(req, input) {
   req.session.users[req.sessionID] = input;
};

module.exports = LoginService;
