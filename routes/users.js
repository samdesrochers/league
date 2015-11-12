var express = require('express');
var router = express.Router();
var Player = require('../models/player');

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    Player.find( {}, null, { sort: {totalWins: -1}}, function (err, players) {
        if (err) return console.log(err);
        res.json(players);
    });
});

/*
 * POST new user.
 */
router.post('/adduser', function(req, res) {
    var newPlayer = new Player({ name: req.body.name, 
        iconId: req.body.iconId, 
        lastUpdated: req.body.lastUpdated,
        totalWins: 0,
        champions: []
    });

    newPlayer.save(function (err, newPlayer) {
        if(err) { 
            return console.error(err);
        }

        console.log("[CREATE SUCCES] New player " + newPlayer.name + " saved.");
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT existing user.
 */
router.put('/updateuser/:id', function(req, res) {

    var playerId = req.params.id;
    Player.findById(playerId, function(err, player) {
        if (err) {
            return console.log(err);
        }

        player.champions = req.body.champions;
        player.lastUpdated = req.body.date;
        player.totalWins = req.body.totalWins;

        player.save(function (err) {
            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );       
        });
    });
});

/*
 * DELETE existing user.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var playerId = req.params.id;
    Player.remove({ '_id' : playerId }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
