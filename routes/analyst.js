var express = require('express');
var router = express.Router();

/* GET Analyst page. */
router.get('/', function(req, res, next) {
    res.render('analyst', { title: 'Analytes' });
});

module.exports = router;
