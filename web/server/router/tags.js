exports.list = function(req, res) {
    res.render('views/tags', req.ejsData);
};