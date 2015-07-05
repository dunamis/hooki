exports = module.exports = function(req, res, next) {
    req.login = {};
    req.login.email = req.session.email;
    next();
};
