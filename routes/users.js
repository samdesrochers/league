var express = require('express');
var request = require('request');
var router = express.Router();
var Player = require('../models/player');

var apikey = "b4283e24-9216-4553-9e73-ac664a6a9d8b";
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

router.get('/addautoplayer/:id', isAuthenticated, function(req, res) {

    var sid = req.params.id;
    var url = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/" + sid + "?api_key=" + apikey;
    
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var summoner = JSON.parse(body);
            console.log(summoner[sid].name);

            var newPlayer = new Player(
                { name: summoner[sid].name, 
                iconId: summoner[sid].profileIconId < 950 ? summoner[sid].profileIconId : "1",
                summonerId: summoner[sid].id,
                lastUpdated: new Date().toISOString(),
                totalKills: 0,
                totalWins: 0,
                champions: []
            });

            newPlayer.save(function (err, newPlayer) {
                if(err) { 
                    res.json(
                    {
                        status:"invalid", 
                        response:"Error occured while processing add auto player : " + err
                    });
                }

                res.json(
                {
                    status:"valid", 
                    response:newPlayer
                });
            });

        } else {

            res.json(
            {
                status:"invalid",
                code:response.statusCode, 
                response:"Error occured while processing add auto player " + sid + " : " + error
            });
        }
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
