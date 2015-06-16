exports.list = function(req, res) {
    req.hookiProvider.findAll(10, function(err, hookis) {
        res.render('views/hooki', {
            submenu : req.submenu,
            hookis : hookis,
            login : req.loginService.getLoginStatus(req)
        });
    });
};

exports.taggedList = function(req, res) {

};

exports.read = function(req, res) {
    var pageId = req.params.pageId;
    res.render('views/read', {
        submenu : req.submenu,
        pageId : pageId
    });
};

exports.write = function(req, res) {
    res.render('views/write', {
        submenu : req.submenu,
        title : 'Write page'
    });
};

exports.submitWriteForm = function(req, res) {
};

exports.draft = function(req, res) {
};

exports.submitDraftForm = function(req, res) {
};
