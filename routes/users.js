var express = require('express');
var router = express.Router();
var Player = require('../models/player');

var validOrderByStrategies = ["totalKills", "totalWins", "kda", "gold", "cs", "avggold", "avgcs"];
var isAuthenticated = function (req, res, next) {

    // DEBUG
    return next();

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

/*
 * GET userlist with optional ORDERBY parameter.
 */
router.get('/userlist', function(req, res) {
    var orderStrategy = validOrderByStrategies[0];
    var orderStrategyParameter = req.query.orderby;

    if(validOrderByStrategies.indexOf(orderStrategyParameter) > -1) {
        orderStrategy = orderStrategyParameter;
    }

    Player.find().sort('-totalKills').exec(function (err, players) {
        if (err) return console.log(err);
        res.json(players);
    });
});

/*
 * POST new user.
 */
router.post('/adduser', isAuthenticated, function(req, res) {
    var newPlayer = new Player({ name: req.body.name, 
        iconId: req.body.iconId,
        summonerId: req.body.summonerId,
        lastUpdated: req.body.lastUpdated,
        totalKills: 0,
        totalWins: 0,
        champions: []
    });

    var reg = /^[a-z0-9']+$/i;
    var isValid = true;

    isValid = reg.test(newPlayer.name);
    isValid = reg.test(newPlayer.iconId);

    if(!isValid) {
        res.send({ msg: "Invalid user input. Check that your Player name doesn't contain illegal characters." });
    }

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
router.put('/updateuser/:id', isAuthenticated, function(req, res) {

    var playerId = req.params.id;
    console.log(playerId);
    Player.findById(playerId, function(err, player) {
        if (err) {
            return console.log(err);
        }

        var json = JSON.parse(req.body.champions);

        player.totalKills = 0;
        player.totalWins = 0;

        for (var i = json.length - 1; i >= 0; i--) {
            var c = json[i];
            if(c !== null && c !== undefined) {
                player.totalKills += parseInt(c.kills);
                player.totalWins += parseInt(c.wins);
            }
        };

        player.champions = req.body.champions;
        player.lastUpdated = req.body.date;

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
router.delete('/deleteuser/:id', isAuthenticated, function(req, res) {
    var playerId = req.params.id;
    Player.remove({ '_id' : playerId }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
