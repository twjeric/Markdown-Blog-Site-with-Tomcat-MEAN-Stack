const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var config = require('./config');
var db;

MongoClient.connect(config.mongoUrl, function(err, client) {
    assert.equal(null, err);
    db = client.db(config.database);
    //client.close();
});

module.exports = {

_db: this.db,

/* Get password hash. */
getPwdHash: function(username, callback) {
    var query = {'username': username};
    var options = {projection: {_id: 0, password: 1}};
    db.collection('Users').findOne(query, options, function(err, doc) {
        assert.equal(err, null);
        callback(doc.password);
    });
},

/* Find blogs by username. */
_getBlogs: function(username, startId, callback) {
    var query = {'username': username, 'postid': {$gte: startId}};
    var options = {projection: {_id: 0, username: 0}, limit: 6};
    db.collection('Posts').find(query, options).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
},

/* Find blogs by username. */
getBlogs: function(username, callback) {
    var query = {'username': username};
    var options = {projection: {_id: 0, username: 0}};
    db.collection('Posts').find(query, options).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
},

/* Find the blog by username and postid. */
getBlog: function(username, postid, callback) {
    var query = {$and: [{'username': username}, {'postid': postid}]};
    var options = {projection: {_id: 0, username: 0, postid: 0}};
    db.collection('Posts').findOne(query, options, function(err, doc) {
        assert.equal(err, null);
        callback(doc);
    });
},

/* Insert a new blog. */
insertBlog: function(username, postid, title, body, callback) {
    var query = {'username': username, 'postid': postid, 
                 'created': new Date().getTime(), 'modified': new Date().getTime(), 
                 'title': title, 'body': body};
    db.collection('Posts').insert(query, function(err, insert) {
        callback(err);
    });
},

/* Update a blog. */
updateBlog: function(username, postid, title, body, callback) {
    var query = {'username': username, 'postid': postid};
    var update = {$set: {'title': title, 'body': body, 'modified': new Date().getTime()}};
    db.collection('Posts').update(query, update, function(err, update) {
        assert.equal(err, null);
        callback(update.result.nModified);
    });
},

/* Remove a blog. */
removeBlog: function(username, postid, callback) {
    var query = {'username': username, 'postid': postid};
    db.collection('Posts').remove(query, function(err, result) {
        assert.equal(err, null);
        callback(result.result.n);
    });
}

};
