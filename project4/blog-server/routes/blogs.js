var express = require('express');
var router = express.Router();

var mongoUtil = require('../mongoUtil');
var jwt = require('jsonwebtoken');

/* Authentication */
router.all('/:username*', function(req, res, next) {
    var token = req.cookies.jwt || req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
            if (err) {
                res.sendStatus(401);
            }
            else {
                if (req.params.username == decoded.usr) {
                    next();
                }
                else {
                    res.sendStatus(401);
                }
            }
        });
    }
    else {
        res.sendStatus(401);
    }
});

/* GET user's blogs. */
router.get('/:username', function(req, res, next) {
    mongoUtil.getBlogs(req.params.username, function(docs) {
        res.status(200).json(docs);
    });
});

/* GET the blog. */
router.get('/:username/:postid', function(req, res, next) {
    mongoUtil.getBlog(req.params.username, Number(req.params.postid), function(doc) {
        if (doc) {
            res.status(200).json(doc);
        }
        else {
            res.sendStatus(404);
        }
    });
});

/* POST the blog. */
router.post('/:username/:postid', function(req, res, next) {
    title = req.body.title;
    body = req.body.body;
    if (typeof(title)==='string' && typeof(body)==='string') {
        mongoUtil.insertBlog(req.params.username, Number(req.params.postid), title, body, function(err) {
            if (err) {
                res.sendStatus(400);
            }
            else {
                res.sendStatus(201);
            }
        });
    }
    else {
        res.sendStatus(400);
    } 
});

/* PUT the blog. */
router.put('/:username/:postid', function(req, res, next) {
    title = req.body.title;
    body = req.body.body;
    if (typeof(title)==='string' && typeof(body)==='string') {
        mongoUtil.updateBlog(req.params.username, Number(req.params.postid), title, body, function(success) {
            if (success) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(400);
            }
        });
    }
    else {
        res.sendStatus(400);
    }
});

/* DELETE the blog. */
router.delete('/:username/:postid', function(req, res, next) {
    mongoUtil.removeBlog(req.params.username, Number(req.params.postid), function(success) {
        if (success) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(400);
        }
    });
});

module.exports = router;
