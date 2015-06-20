exports.search = function(req, res) {
    var c = req.body.c;
    var condition = {
        'title' : {
            $regex : '.*' + c + '.*'
        }
    };
    req.hookiProvider.findByCondition(condition, function(err, items) {
        res.send(items);
    });
};