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
                    response:"no summoner data associated with the given player name."
                });
            }
        });
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;