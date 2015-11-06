var express = require('express');
var request = require('request');
var router = express.Router();
var apikey = "b4283e24-9216-4553-9e73-ac664a6a9d8b";

/*
 * GET Summoner Id.
 */
router.get('/summonerid/:name', function(req, res) {
    var name = req.params.name;
    var url = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + name + "?api_key=" + apikey;

    try{
        //Lets try to make a HTTP GET request to modulus.io's website.
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body); 
                res.json(body);
            } else {
                console.log(body); 
            }
        });
    } catch(e) {
        console.log(e);
        console.log(url);
    }
});



module.exports = router;