var path = require('path');

exports.home = function(req, res) {
    res.render('views/home', {
        login : req.loginService.getLoginStatus(req)
    });
};

exports.favicon = function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/static/img/favicon.ico'), {
        headers : {
            "Content-Type" : "image/x-icon"
        }
    }, function(err) {
        if (err)
            throw err;
    });
};