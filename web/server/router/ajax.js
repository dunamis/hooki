var router = require('express').Router();
var cp = require('../modules/contentprovider');

router.post('/search', function(req, res) {
    var c = req.body.c;
    var condition = {
        'title' : {
            $regex : '.*' + c + '.*'
        }
    };
    cp.getHookiListByCondition(condition, function(err, items) {
        res.send(items);
    });
});

module.exports = router;