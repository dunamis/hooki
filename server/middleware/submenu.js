exports = module.exports = function(req, res, next) {
    var submenu = req.params.submenu;
    if (['hooki', 'tags', 'users', 'request', 'product'].indexOf(submenu) != -1) {
        req.ejsData.submenu = submenu;
    }
    next();
};