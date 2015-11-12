var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('login', { title: 'Login Page', user : req.user });
});

router.post('/', passport.authenticate('local'), function(req, res) {
    res.redirect('/admin');
});

module.exports = router;
