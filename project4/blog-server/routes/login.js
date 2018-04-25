var express = require('express');
var router = express.Router();

var mongoUtil = require('../mongoUtil');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/* Check username and password. */
var check = function(username, password, callback) {
    if (username && password) {
        mongoUtil.getPwdHash(username, function(hash) {
            bcrypt.compare(password, hash, function(err, res) {
                callback(res);
            });
        });
    }
    else {
        callback(false);
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
    let username = req.query.username;
    let password = req.query.password;
    let redirect = req.query.redirect;
    check(username, password, function(success) {
        if (success) {
            let options = {algorithm: 'HS256', expiresIn: '2h', header: {'alg': 'HS256', 'typ': 'JWT'}};
            jwt.sign({ usr: username }, req.app.get('superSecret'), options, function(err, token) {
                res.cookie('jwt', token, {  }); //{ httpOnly: true }
                res.redirect(redirect);
            });
        }
        else {
            res.render('login', { title: 'Login', redirect: redirect });
        }
    });
});

router.post('/', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let redirect = req.body.redirect;
    check(username, password, function(success) {
        if (success) {
            let options = {algorithm: 'HS256', expiresIn: '2h', header: {'alg': 'HS256', 'typ': 'JWT'}};
            jwt.sign({ usr: username }, req.app.get('superSecret'), options, function(err, token) {
                res.cookie('jwt', token, {  }); //{ httpOnly: true }
                res.redirect(redirect);
            });
        }
        else {
            res.render('login', { title: 'Login', redirect: redirect });
        }
    });
});

module.exports = router;
