exports.request = function(req, res) {
    res.render('views/write', {
        submenu : req.submenu
    });
};

exports.submitForm = function(req, res) {
};