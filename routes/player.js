var express = require('express');
var router = express.Router();

/* Fallback */
router.get('/', function(req, res, next) {
  res.redirect("leaderboard");
});

/* GET Player page. */
router.get('/:id', function(req, res, next) {
  res.render('player', { title: req.params.id });
});

module.exports = router;
