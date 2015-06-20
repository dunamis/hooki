var db = require('./dbconnector').getDb();

exports.getHookiList = function(option, callback) {

};

exports.getTagList = function(option, callback) {
    var limits = option.limits || null;
    var collection = db.collection('tag');

    if ( typeof limits === "number") {
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
