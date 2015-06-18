exports.request = function(req, res) {
    res.render('views/write', req.ejsData);
};

exports.submitForm = function(req, res) {
};