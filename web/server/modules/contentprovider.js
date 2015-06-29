var dbConn = require('./dbconnector');
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;

function getCollection(name, callback) {
    console.log("[ContentProvider:getCollection] function called");
    var collection = dbConn.getDb().collection(name, function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            console.log("hooki COLLECTION: " + hookiCollection);
            callback(null, hookiCollection);
        }
    });
};

exports.getHookiListAll = function(option, callback) {
    getCollection('hooki', function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            if (option == -1) {
                hookiCollection.find().toArray(function(error, items) {
                    if (error)
                        callback(error);
                    else
                        callback(null, items);
                });
            } else {
                hookiCollection.find().limit(option).toArray(function(err, items) {
                    if (error)
                        callback(error);
                    else
                        callback(null, items);
                });
            }
        }
    });
};

exports.getHookiListById = function(hookiId, callback) {
    console.log("[ContentProvider:getHookiListById] function called");
    getCollection('hooki', function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            hookiCollection.findOne({
                _id : ObjectID(hookiId)
            }, function(error, result) {
                if (error)
                    callback(error);
                else
                    callback(null, result);
            });
        }
    });
};

exports.getHookiListByCondition = function(condition, callback) {
    console.log("[ContentProvider:findByCondition] function called");
    getCollection('hooki', function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            hookiCollection.find(condition).limit(10).toArray(function(error, items) {
                callback(error, items);
            });
        }
    });
};

exports.getHookiContent = function(option, callback) {
    var sn = option.sn || null;
    getCollection('hooki', function(error, collection) {
        if (error)
            callback(error);
        else {
            collection.findOne({
                'sn' : sn
            }, function(error, data) {
                console.log(error, data);
                if (error) {
                    console.log("failure!!");
                    callback([]);
                } else {
                    console.log("success!!");
                    callback(data);
                }
            });
        }
    });
};

exports.getTagList = function(option, callback) {
    var limits = option.limits || null;
    getCollection('tag', function(error, collection) {
        if (error)
            callback(error);
        else {
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
        }
    });
};

exports.save = function(title, score, tag, content, pageId, callback) {
    console.log("[ContentProvider:save] function called");
    getCollection('hooki', function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            var hookiData = {};
            hookiData.title = title;
            hookiData.score = score;
            hookiData.createdDate = new Date();
            hookiData.tag = tag;
            hookiData.content = content;
            hookiData.pageId = pageId;
            hookiCollection.insert(hookiData, function() {
                callback(null, null);
            });
        }
    });
};

exports.addCommentToHooki = function(hookiId, comment, callback) {
    console.log("[ContentProvider:addCommentToHooki] function called");
    getCollection('hooki', function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            hookiCollection.update({
                _id : ObjectID(hookiId)
            }, {
                "$push" : {
                    comments : comment
                }
            }, function(error, hooki) {
                if (error)
                    callback(error);
                else
                    callback(null, hooki);
            });
        }
    });
};

