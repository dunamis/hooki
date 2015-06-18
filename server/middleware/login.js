exports = module.exports = function(req, res, next) {
    req.login = {};
    req.login.loginStatus = Boolean(req.session.email);
    req.login.email = req.session.email;
    next();
};
