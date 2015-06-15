exports.list = function(req, res) {
    res.render('views/product', {
        submenu : req.submenu
    });
};

exports.detail = function(req, res) {
    res.render('views/product', {
        submenu : req.submenu
    });
};