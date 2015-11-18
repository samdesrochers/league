var express = require('express');
var request = require('request');
var router = express.Router();

// champions data : http://ddragon.leagueoflegends.com/cdn/5.22.3/data/en_US/champion.json
var apikey = "b4283e24-9216-4553-9e73-ac664a6a9d8b";

/*
 * GET Summoner Id.
 */
router.get('/summonerid/:name', function(req, res) {
    var name = req.params.name;
    var url = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + name + "?api_key=" + apikey;

    try{
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                res.json(
                {
                    status:"valid", 
                    response:body
                });

            } else {

                res.json(
                {
                    status:"invalid", 
                    response:"No summoner associated with the given name."
                });
            }
        });
    } catch(e) {
        console.log(e);
    }
});

router.get('/lastmatches/:name', function(req, res) {
    var name = req.params.name;
    var url = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + name + "?api_key=" + apikey;

    try{
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var jsonbody = body.substring(1, body.length - 1);
                jsonbody = jsonbody.substring(jsonbody.indexOf('{'), jsonbody.length);
                var summoner = JSON.parse(jsonbody);
                var id = summoner.id;

                var matchesurl = "https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/" + id + "/recent?api_key=" + apikey;
                request(matchesurl, function (merror, mresponse, mbody) {
                    if (!error && mresponse.statusCode == 200) {
                        res.json(
                        {
                            status:"valid", 
                            response:mbody
                        });
                    } else {
                        res.json(
                        {
                            status:"invalid", 
                            response:"Error"
                        });
                    }
                });
            } else {

                res.json(
                {
                    status:"invalid", 
                    response:"Error"
                });
            }
        });
    } catch(e) {
        console.log(e);
    }
});

router.get('/matchdata/:matchid', function(req, res) {
    var matchid = req.params.matchid;
    var url = "https://na.api.pvp.net/api/lol/na/v2.2/match/" + matchid + "?api_key=" + apikey;

    try{
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                res.json(
                {
                    status:"valid", 
                    response:body
                });

            } else {

                res.json(
                {
                    status:"invalid", 
                    response:"Error"
                });
            }
        });
    } catch(e) {
        console.log(e);
    }
});

router.get('/champion/:id', function(req, res) {
    var id = req.params.id;
    var url = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/" + id + "?api_key=" + apikey;

    try{
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                res.json(
                {
                    status:"valid", 
                    response:body
                });

            } else {

                res.json(
                {
                    status:"invalid", 
                    response:"Error"
                });
            }
        });
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;