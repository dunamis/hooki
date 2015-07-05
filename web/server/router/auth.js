var router = require('express').Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var config = require('../modules/accountconfig');

var FACEBOOK_APP_LIST = {
    'sang' : config.facebook.sang,
    'ciogenis' : config.facebook.ciogenis,
    'soopdop' : config.facebook.soopdop
};

var TWITTER_APP_LIST = {
    'sang' : config.twitter.sang,
    'ciogenis' : config.twitter.ciogenis,
    'soopdop' : config.twitter.soopdop
};

var facebookConfig = FACEBOOK_APP_LIST[process.env['USER']];
var twitterConfig = TWITTER_APP_LIST[process.env['USER']];

passport.use(new FacebookStrategy({
        clientID: facebookConfig.app_id,
        clientSecret: facebookConfig.app_secret,
        callbackURL: facebookConfig.callback_url
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            console.log("facebook login");
            return done(null, profile);
        });
    }
));

passport.use(new TwitterStrategy({
        consumerKey: twitterConfig.api_key,
        consumerSecret: twitterConfig.api_secret,
        callbackURL: twitterConfig.callback_url
    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
            console.log("twitter login");
            return done(null, profile);
        });
    }
));

passport.use(new LocalStrategy(
    function(username, password, done) {
        var user = {
            username : username,
            password : password
        };
        if (username === "a@mail.com" || username === "b@mail.com") {
            console.log(user);
            return done(null, user);
        }
        else {
            console.log("babo!!");
            return done(null, false, {message: 'incorrect email address'});
        }
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

router.post('/login', passport.authenticate('local', {
        failureRedirect: '/account/login'
    }),
    function(req, res) {
        console.log("local login success");
        res.redirect('/');
    }
);

router.get('/failure', function(req, res) {
    console.log(req.isAuthenticated());
    res.send('ok');
});

module.exports = router;
