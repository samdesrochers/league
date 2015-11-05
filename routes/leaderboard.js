var express = require('express');
var router = express.Router();

/* GET Leaderboard page. */
router.get('/', function(req, res, next) {
  res.render('leaderboard', { title: 'LaLigue - Leaderboard' });
});

module.exports = router;
