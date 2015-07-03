var dbConn = require('./dbconnector');
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var async = require('async');

function getCollection(name, callback) {
    console.log("[ContentProvider:getCollection] function called");
    var collection = dbConn.getDb().collection(name, function(error, hookiCollection) {
        if (error)
            callback(error);
        else {
            console.log("hooki COLLECTION: " + hookiCollection.toString());
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
                    callback(null);
                } else {
                    console.log("success!!", data);
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

exports.getHookiDraft = function(args, callback) {
    getCollection('hookiDraft', function(error, col) {
        if (error) {
            callback(false);
            return;
        }

        col.findOne({
            'email' : args.email
        }, function(error2, item) {
            if (error2 || !item) {
                callback(false);
                return;
            }
            item.success = true;
            callback(item);
        });
    });
};

exports.upsertHookiDraft = function(data, option, callback) {
    getCollection('hookiDraft', function(error, col) {
        if (error) {
            callback(false);
            return;
        }
        col.update({
            'email' : data.email
        }, data, {
            upsert : true
        }, function(error, data) {
            if (error) {
                callback(false);
                return;
            }
            callback(true);
        });
    });
};

exports.writeHooki = function(hookiContent, callback) {
    async.waterfall([
    function getSeqCollection(next) {
        getCollection('seq', function(error, seqCollection) {
            if (error) {
                next(error);
                return;
            }
            next(null, seqCollection);
        });
    },
    function getSeqNumber(seqCollection, next) {
        seqCollection.findAndModify({
            '_id' : 'hooki'
        }, {}, {
            '$inc' : {
                'seq' : 1
            }
        }, {
            new : true
        }, function(error, doc) {
            if (error) {
                next(error);
                return;
            }
            next(null, doc.value.seq);
        });
    },
    function getHookiCollection(seqNum, next) {
        getCollection('hooki', function(error, hookiCollection) {
            if (error) {
                next(error);
                return;
            }
            next(null, {
                hookiCollection : hookiCollection,
                seqNum : seqNum
            });
        });

    },
    function insertHooki(args, next) {
        hookiContent.sn = args.seqNum;
        var hookiCollection = args.hookiCollection;

        hookiCollection.insert(hookiContent, {}, function(error, doc) {
            if (error) {
                next(error);
                return;
            }
            next(null, hookiContent.sn);
        });
    }], function end(error, result) {
        if (error) {
            console.log('writeHooki 실행 중 에러.');
            callback(error);
        } else {
            callback(null, result);
        }
    });
};

exports.removeDraft = function(email, callback) {
    getCollection('hookiDraft', function(error, col) {
        if (error) {
            callback(error);
            return;
        }
        col.findAndRemove({
            'email' : email
        }, {}, function(error, data) {
            if (error) {
                callback(error);
                return;
            }
            callback(null);
        });
    });
}
