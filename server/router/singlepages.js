var path = require('path');

exports.root = function(req, res) {
    res.redirect('/home');
    res.end();
};

exports.home = function(req, res) {
    res.render('views/home', req.ejsData);
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
