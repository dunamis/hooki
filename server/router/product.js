exports.list = function(req, res) {
    res.render('views/product', req.ejsData);
};

exports.detail = function(req, res) {
    res.render('views/product', req.ejsData);
};