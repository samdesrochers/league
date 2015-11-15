var express = require('express');
var Account = require('../models/account');
var passport = require('passport');
var router = express.Router();

var isAuthenticated = function (req, res, next) {

	// // DEBUG
	// return next();	

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

/* GET Admin page. */
router.get('/', isAuthenticated, function(req, res) {
  res.render('admin', { title: 'La Ligue - Leaderboard <Admin>' });
});

module.exports = router;
