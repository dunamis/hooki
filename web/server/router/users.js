exports.list = function(req, res) {
    var userName = req.params.userName;
    req.ejsData.userName = userName;
    res.render('views/users', req.ejsData);
};

exports.detail = function(req, res) {
    var nick = req.params.nick;
    req.ejsData.nick = nick;
    res.render('views/profile', req.ejsData);
};