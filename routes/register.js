var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function(req, res){
    res.render('register', { title: 'Register Page', user : req.user });
});

router.post('/', function(req, res){
	Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { info: 'Registration failed.' });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });    
});

module.exports = router;
