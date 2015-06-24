var db = require('./dbconnector').getDb();

exports.getHookiList = function(option, callback) {

};

exports.getHookiContent = function(option, callback) {
    var sn = option.sn || null;
    var collection = db.collection('hooki');

    collection.findOne({
        'sn' : sn
    }, function(error, data) {
        console.log(error, data);
        if (error) {

            callback([]);
        } else {
            callback(data);
        }
    });

};

exports.getTagList = function(option, callback) {
    var limits = option.limits || null;
    var collection = db.collection('tag');

    if (limits) {
        collection.find().limit(limits).toArray(function(error, items) {
            if (error)
                callback([]);
            else
                callback(items);
        });
    } else {
        collection.find().toArray(function(error, items) {
            if (error) {
                callback([]);
            } else {
                callback(items);
            }
        });
    }
};
