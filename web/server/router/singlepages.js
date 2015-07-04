var router = require('express').Router();
var path = require('path');

router.get('/', function(req, res) {
    res.redirect('/home');
    res.end();
});

router.get('/favicon.ico', function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/static/images/favicon.ico'), {
        headers : {
            "Content-Type" : "image/x-icon"
        }
    }, function(err) {
        if (err)
            throw err;
    });
});

router.get('/home', function(req, res) {
    res.render('views/home', req.ejsData);
});

module.exports = router;