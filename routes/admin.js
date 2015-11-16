var express = require('express');
var Account = require('../models/account');
var TraceHelper = require('../models/tracehelper');
var passport = require('passport');
var router = express.Router();

var isAuthenticated = function (req, res, next) {

	// DEBUG
	return next();	

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

/* GET Admin page. */
router.get('/', isAuthenticated, function(req, res) {

	//TraceHelper.logAnonymousNavigation("admin");
	res.render('admin', { title: 'La Ligue - Leaderboard <Admin>' });
});

module.exports = router;
