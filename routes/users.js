var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('players');
    var options = {
        "sort": {"totalWins": -1 }
    };

    try {

        collection.find({}, options, function(e,docs) {
            res.json(docs);
        });

    } catch(e) { console.log(e); }

});

/*
 * POST new user.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('players');
    console.log(req.body);
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT existing user.
 */
router.put('/updateuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('players');
    console.log(req.body);
    collection.update(
        { '_id' : req.params.id }, 
        { $set: { 'champions' : req.body.champions, 
                 'lastUpdated' : req.body.date,
                 'totalWins' : req.body.totalWins
                } 
        },
        function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE existing user.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('players');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
