exports.list = function(req, res) {
    req.hookiProvider.findAll(10, function(err, hookis) {
        req.ejsData.hookis = hookis;
        res.render('views/hooki', req.ejsData);
    });
};

exports.taggedList = function(req, res) {

};

exports.read = function(req, res) {
    var id = req.params.id;
    req.ejsData.id = id;
    res.render('views/read', req.ejsData);
};

exports.write = function(req, res) {
    res.render('views/write', req.ejsData);
};

exports.submitWriteForm = function(req, res) {
};

exports.draft = function(req, res) {
};

exports.submitDraftForm = function(req, res) {
};
