var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var curDB = require('./dbconnector');

exports.getCollection = function(callback) {
    console.log("[HookiProvider:getCollection] function called");
    var collection = curDB.getDb().collection('hooki', function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            console.log("hooki COLLECTION: " + hookiCollection);
            callback(null, hookiCollection);
        }
    });
};

exports.findAll = function(limits, callback) {
    this.getCollection(function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            if (limits == -1) {
                hookiCollection.find().toArray(function(error, items) {
                    if (error)
                        callback(error);
                    else
                        callback(null, items);
                });
            } else {
                hookiCollection.find().limit(limits).toArray(function(err, items) {
                    if (error)
                        callback(error);
                    else
                        callback(null, items);
                });
            }
        }
    });
};

exports.findById = function(hookiId, callback) {
    console.log("[HookiProvider:findById] function called");
    this.getCollection(function(error, hookiCollection) {
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

exports.findByCondition = function(condition, callback) {
    console.log("[HookiProvider:findByCondition] function called");
    this.getCollection(function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            hookiCollection.find(condition).limit(10).toArray(function(error, items) {
                callback(error, items);
            });
        }
    });
};

exports.save = function(title, score, tag, content, pageId, callback) {
    console.log("[HookiProvider:save] function called");
    this.getCollection(function(error, hookiCollection) {
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
    console.log("[HookiProvider:addCommentToHooki] function called");
    this.getCollection(function(error, hookiCollection) {
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