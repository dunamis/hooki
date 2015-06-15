exports.list = function(req, res) {
    var userId = req.params.userId;
    res.render('views/users', {
        submenu : req.submenu
    });
};

exports.detail = function(req, res) {
    var userId = req.params.nick;
    res.render('views/profile', {
        submenu : req.submenu,
        nick : nick
    });
};