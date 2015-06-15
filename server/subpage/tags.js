exports.list = function(req, res) {
    res.render('views/tags', {
        submenu : req.submenu
    });
};