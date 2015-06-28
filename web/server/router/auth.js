var router = require('express').Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var config = require('../modules/accountconfig');

passport.use(new FacebookStrategy({
        clientID: config.facebook.app_id,
        clientSecret: config.facebook.app_secret,
        callbackURL: config.facebook.callback_url
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            console.log("facebook login");
            return done(null, profile);
        });
    }
));

passport.use(new TwitterStrategy({
        consumerKey: config.twitter.api_key,
        consumerSecret: config.twitter.api_secret,
        callbackURL: config.twitter.callback_url
    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
            console.log("twitter login");
            return done(null, profile);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
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

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter', {
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