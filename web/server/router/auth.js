var router = require('express').Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var config = require('../modules/accountconfig');

router.use(passport.initialize());
router.use(passport.session());

passport.use(new FacebookStrategy({
        clientID: config.facebook.app_id,
        clientSecret: config.facebook.app_secret,
        callbackURL: config.facebook.callback_url
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            console.log(profile);
            return done(null, profile);
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log("serializeUser");
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log("deserializeUser");
    done(null, obj);
});

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/account/login'
    }),
    function(req, res) {
        res.redirect('/');
    }
);

router.get('/failure', function(req, res) {
    console.log(req.isAuthenticated());
    res.send('ok');
});

module.exports = router;