var playerListData = [];
var matchesData = [];
var lastMatchStats = '';

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Add User button click
    $('#btnAddPlayer').on('click', createPlayer);
    $('#btnLastGame').on('click', populateLastGames);

});

// =============================================================
function createPlayer(event) {

    event.preventDefault();
    var errorCount = 0;
    $('#btnAddPlayer input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    var name = $('fieldset input#inputPlayerName').val();
    var createdDate = new Date().toISOString();

    if (!isTextValid(name)) {
        showInfo("Invalid or Empty player name.");
        return;
    }

    // Get Summoner id from RIOT
    $.getJSON( '/riot/summonerid/' + name, function( data ) {      
        if (data !== undefined) {            
            var status = data.status;
            var response = data.response;
            if(status === "invalid") {
                showInfo(response);
                return false;
            }

            // hack around RIOT Api, for some reason it always return undefined as leading name for spaced summoner names
            response = response.substring(1, response.length - 1);
            response = response.substring(response.indexOf('{'), response.length);
            response = response.replace("undefined", name);
            var summoner = $.parseJSON(response);

            var newPlayer = {
                name: summoner.name,
                iconId: summoner.profileIconId,
                summonerId: summoner.id,
                lastUpdated: createdDate,
                creationTime: createdDate,
                champions: [],
                totalKills: 0,
                totalWins: 0
            }

            // TODO : Check for actual response [Temporary]
            if (newPlayer.iconId > 950) {
                newPlayer.iconId = 1;
            }

            // Use AJAX to post the object to our adduser service
            $.ajax({
                type: 'POST',
                data: newPlayer,
                url: '/users/adduser',
                dataType: 'JSON'
            }).done(function( response ) {
                if (response.msg === '') {
                    $('fieldset input').val('');
                    populateTable();
                }
                else {
                    alert('Error: ' + response.msg);
                }
            });

        } else {
            showInfo("All values for a modified champion need to be filled.");
            return false;
        }
    });
};

// =============================================================
function deletePlayer(event) {

    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this user?');

    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            populateTable();
        });

    } else {
        return false;
    }
};

// =============================================================
function createNewChampion(event) {

    event.preventDefault();

    var pid = $(this).attr('rel');
    var date = new Date().toISOString();
    var container = $("#container_" + pid + " .playerTable");
    var newChampRow = getNewChampionRow(pid, 0, 0, 0, 0, 0, 0, 0, date, false);
    container.append(newChampRow);
};

// =============================================================
function updateChampions(event) {

    event.preventDefault();
    var pid = $(this).attr('rel');
    var player = null;
    for(var i = 0; i < playerListData.length; i++) {
        if(playerListData[i]._id === pid) {
            player = playerListData[i];
        }
    }

    var tKills = 0;
    var tWins = 0;
    var updatedChampions = [];
    var updateDate = new Date().toISOString();

    $("#container_" + pid + " .rowValues").each(function(i, row) {

        var champion = {
            name : $(row).find("input[name='name']").val(),
            kills : parseInt($(row).find("input[name='kills']").val()),
            deaths : parseInt($(row).find("input[name='deaths']").val()),
            assists : parseInt($(row).find("input[name='assists']").val()),
            wins : parseInt($(row).find("input[name='wins']").val()),
            games : parseInt($(row).find("input[name='games']").val()),
            cs : parseInt($(row).find("input[name='cs']").val()),
            gold : parseInt($(row).find("input[name='gold']").val()),
            lastUpdated : updateDate
        }

        var valid = true;
        for (var p in champion) {
            var value = champion[p];
            if ((typeof value === 'string' || value instanceof String) && value === "") {
                valid = false;
                break;
            } else if((typeof value === 'number' || value instanceof Number) && isNaN(value)) {
                valid = false;
                break;
            }
        }

        if(valid) {
            updatedChampions.push(champion);
        } else {
            // Alert user!!!
        }
    });

    // Special case: first champion(s) being ever added
    if(player.champions === undefined || player.champions.length === 0) {
        player.champions = [];
        for (var c in updatedChampions) {
            player.champions.push(updatedChampions[c]);
        }

    } else {

        for (var i = updatedChampions.length - 1; i >= 0; i--) {
            var updatingc = updatedChampions[i];
            var foundIndex = -1;
            for (var i = player.champions.length - 1; i >= 0; i--) {
                var existingc = player.champions[i];

                // Champion found in list, keep index
                if(updatingc.name === existingc.name) {
                    foundIndex = i;
                } 
            };
            
            if(foundIndex !== -1) {
                // Update with the latest champion's data after getting the values
                updatingc.kills += parseInt(existingc.kills);
                updatingc.deaths += parseInt(existingc.deaths);
                updatingc.assists += parseInt(existingc.assists);
                updatingc.wins += parseInt(existingc.wins);
                updatingc.games += parseInt(existingc.games);
                updatingc.cs += parseInt(existingc.cs);
                updatingc.gold += parseInt(existingc.gold);
                player.champions[foundIndex] = updatingc;
            } else {
                player.champions.push(updatingc);
            }
        };
    }

    for(var c in player.champions) {
        tKills += player.champions[c].kills;
        tWins += player.champions[c].wins;
    }

    player.lastUpdated = updateDate;
    var json = JSON.stringify(player.champions);

    // Use AJAX to post the object to our update service
    $.ajax({
        type: 'PUT',
        data:{champions:json, date:updateDate},
        url: '/users/updateuser/' + pid,
        dataType: 'JSON'
    }).done(function( response ) {
        // Check for successful (blank) response
        if (response.msg === '') {

            // Update the table
            populateTable();
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            var e = response.msg;
            alert('Error: ' + e.message);
        }
    });
}

// =============================================================
function deleteChampion(event) {

    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this champion?');
    if(confirmation === true) {
        var ids = $(this).attr('rel').split("#");
        var pid = ids[0];
        var toDelete = ids[1];
        var player = null;
        for(var i = 0; i < playerListData.length; i++) {
            if(playerListData[i]._id === pid) {
                player = playerListData[i];
            }
        }

        for(var i = 0; i < player.champions.length; i++) {
            if(player.champions[i].name === toDelete) {
                player.champions.splice(i, 1);
                break;
            }
        }

        var json = JSON.stringify(player.champions);

        // Use AJAX to post the object to our update service
        $.ajax({
            type: 'PUT',
            data:{champions:json},
            url: '/users/updateuser/' + pid,
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg === '') {

                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                var msg = response.msg;
                alert('Error: ' + response.msg);
            }
        });
    } else {
        return false;
    }
}

// =============================================================
function toggleShowChampions(event) {

    event.preventDefault();
    clearInfo();
    var pid = $(this).attr('rel');
    $("#container_" + pid + " .playerTable tr").each(function(i, row) {

        // Skip header and TOP values
        if(i > 1) {
            $(row).toggle("fast");
        }
    });
}

// =============================================================
function populateTable() {

    clearInfo();

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        playerListData = data;
        var index = 1;
        var tableContent = '';

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            try{

                tableContent += '<div class="playerContainer" id="container_' + this._id +'"">';
                tableContent += '<div class="playerName"><a href="#" class="linkshowuser" rel="' + this.name + '">#' + index++ + ": " + this.name + '</a> - <a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></div>';
                tableContent += '<table class="playerTable">';
                tableContent += getStatsHeaderRow();

                // If this user has champions, populate them
                if(this.champions !== undefined && this.champions.length > 0) {

                    var championsJSON = $.parseJSON(this.champions);
                    this.champions = championsJSON;
                    tableContent += populateRows(this);

                } else {

                    tableContent += getNewPlayerRow(this._id, this.name, this.iconId, this.lastUpdated);
                    
                }

                // Add operations bar for each player
                tableContent += '</table>';
                tableContent += '<div class="champOps"><a href="#/" class="linkaddchampion" rel="' + this._id + '">Add Champion</a> | <a href="#/" class="linkupdatechamps" rel="' + this._id + '">Update Champions</a> | <a href="#/" class="linkshowchamps" rel="' + this._id + '">Toggle Champions</a></div>';
                tableContent += '</div>';

            } catch(e) {
                console.log(e);
            }
        });

        // Inject the whole content string into our existing HTML table
        $('#leaderboard').html(tableContent);

        // Add operations to ops links
        $('.linkdeleteuser').click(deletePlayer);
        $('.linkaddchampion').click(createNewChampion);
        $('.linkupdatechamps').click(updateChampions);
        $('.linkdeletechamp').click(deleteChampion);
        $('.linkshowchamps').click(toggleShowChampions);
    });
};

// =============================================================
function populateRows(player) {

    var tKills = 0;
    var tDeaths = 0;
    var tAssists = 0;
    var tKda = 0;
    var tWins = 0;
    var tCs = 0;
    var tAvgCs = 0;
    var tGold = 0;
    var tAvgGold = 0;
    var tGames = 0;

    var ret = "";
    var body = "";

    for(var i = 0; i < player.champions.length; i++) {

        var champ = player.champions[i];
        var inputRow = getChampionInputRow(champ.name);
        var statsRow = getChampionRow (
                        player._id, champ.name, champ.kills, champ.deaths, 
                        champ.assists, champ.wins, champ.games,
                        champ.cs, champ.gold, champ.lastUpdated);
        body += statsRow;
        body += inputRow;

        champ.name, 
        tKills += parseInt(champ.kills); 
        tDeaths += parseInt(champ.deaths);
        tAssists += parseInt(champ.assists); 
        tWins += parseInt(champ.wins); 
        tGames += parseInt(champ.games);
        tCs += parseInt(champ.cs);
        tGold += parseInt(champ.gold);
    }

    if(tGames === 0) {
        tAvgCs = tAvgGold = tKda = 0;
    } else {
        tAvgCs = Math.max(Math.round(tCs / tGames), 0);
        tAvgGold = Math.max(Math.round(tGold / tGames), 0);
        tKda = (parseFloat(tKills) + parseFloat(tAssists)) / Math.max(1, parseFloat(tDeaths)); //(K+A) / Max(1,D)
        tKda = tKda.toFixed(2);
    }

    var tRow = getPlayerStatsRow(player._id, player.iconId, tKills, tDeaths, tAssists, tKda, tWins, 
        tGames, tCs, tAvgCs, tGold, tAvgGold, player.lastUpdated);

    ret += tRow;
    ret += body;
    return ret;
}

function populateLastGames() {

    event.preventDefault();
    matchesdata = [];

    var name = $('fieldset input#inputPlayerLastGame').val();

    if (!isTextValid(name)) {
        showInfo("Invalid or Empty player name.");
        return;
    }

    // Get Summoner id from RIOT
    $.getJSON( '/riot/lastmatches/' + name, function( data ) {      
        if (data !== undefined) {            
            var status = data.status;
            var response = data.response;
            if(status === "invalid") {
                showInfo(response);
                return false;
            }

            var container = $("#matchesdata");
            var res = $.parseJSON(response);

            for (var i = 0; i < res.games.length/2; i++) {

                var g = res.games[i];
                var date = new Date(g.createDate);
                var id = g.gameId;
                var players = [];

                for (var j = g.fellowPlayers.length - 1; j >= 0; j--) {
                    var p = g.fellowPlayers[j];
                    players.push({summonerid:p.summonerId, championid:p.championId, teamid:p.teamId});
                };
                    
                players.push({summonerid:res.summonerId, championid:g.championId, teamid:g.teamId});
                matchesdata.push( { gameid:id, players:players } );
                container.append('<a href="#/" class="linkgetmatch" rel="' + id + '">' + id + '</a>' + " " + date + "</br>");
            };

            $(".linkgetmatch").click(getMatchData);
            var fd = 1;
            
        } else {
            showInfo("All values for a modified champion need to be filled.");
            return false;
        }
    });
}

function getMatchData() {
    var gameId = parseInt($(this).attr('rel'));
    var match = '';

    // Get local match data for matching game id
    for (var i = matchesdata.length - 1; i >= 0; i--) {
        var t = matchesdata[i];
        if(t.gameid === gameId) {
            match = t;
            break;
        }
    }

    var players = match.players;
    $.getJSON( '/riot/matchdata/' + gameId, function( data ) {      
        if (data !== undefined) {            
            var status = data.status;
            var response = data.response;
            if(status === "invalid") {
                showInfo(response);
                return false;
            }

            var res = $.parseJSON(response);
            for (var i = res.participants.length - 1; i >= 0; i--) {
                var participant = res.participants[i];
                for (var j = players.length - 1; j >= 0; j--) {
                    var player = players[j];

                    if(player.championid === participant.championId 
                        && player.teamid === participant.teamId) {
                        player.stats = participant.stats;
                    }

                };
            };

            consolidatePlayerStats(players);

        } else {
            showInfo("All values for a modified champion need to be filled.");
            return false;
        }
    });
}

function consolidatePlayerStats(players) {

    $.ajaxSetup({
        async: false
    });

    var time = 0;
    for (var i = players.length - 1; i >= 0; i--) {
        time += 500;
        var p = players[i];
        setTimeout(function(p, i, min) {
            return function() {
                console.log("about to run " + p.championid);
                runAutomatedUpdateIteration(p);
                console.log("done running " + p.championid);

                if(i === min) {
                    populateTable();
                }
            }
        }(p, i, 0), time);
    }

    $.ajaxSetup({
        async: true
    }); 
}

function runAutomatedUpdateIteration(p) {

    var sid = p.summonerid;
    var cid = p.championid;
    var tid = p.teamid;
    var stats = p.stats;

    console.log("getting champion for " + p.championid);
    $.getJSON( '/riot/champion/' + cid, function( data ) {
        console.log("got champion for " + p.championid);      
        if (data !== undefined) {            
            var status = data.status;
            var response = data.response;
            if(status === "invalid") {
                showInfo("Error @ Getting Champion | " + p.championid + " : " + response);
                return false;
            }

            var res = $.parseJSON(response);
            p.championkey = res.key;
            p.championname = res.name;

            var playerExists = false;
            for (var i = playerListData.length - 1; i >= 0; i--) {
                var existingplayer = playerListData[i];
                if (existingplayer.summonerId === p.summonerid) {
                    updateExistingPlayer(existingplayer, p);
                    playerExists = true;
                    break;
                }
            }

            // Save new player
            if(!playerExists) {
                addAutomatedPlayer(sid, stats, p)
            }

        } else {
            showInfo("All values for a modified champion need to be filled.");
            return false;
        }
    }); 
}

function addAutomatedPlayer(sid, stats, p) {
    $.getJSON( '/users/addautoplayer/' + sid, function( data ) {      
        if (data !== undefined) {            
            var status = data.status;
            var response = data.response;

            if(status === "invalid") {
                showInfo("Error @ Saving New Player | " + sid + " : " + response);
                return false;
            }

            var player = response;
            pushNewPlayer(player, stats, p.championkey);
            return true;

        } else {
            showInfo("All values for a modified champion need to be filled.");
            return false;
        }
    }); 
}

function pushNewPlayer(player, stats, key) {
    var newChampion = {
        name : key,
        kills : stats.kills,
        deaths : stats.deaths,
        assists : stats.assists,
        wins : stats.winner === true ? 1 : 0,
        games : 1,
        cs : stats.minionsKilled,
        gold : stats.goldEarned,
        lastUpdated : new Date().toISOString()
    }

    player.champions.push(newChampion);
    var json = JSON.stringify(player.champions);

    $.ajax({
        type: 'PUT',
        data:{champions:json, date:new Date().toISOString()},
        url: '/users/updateuser/' + player._id,
        dataType: 'JSON'
    }).done(function( response ) {
        if (response.msg === '') {

        }
        else {
            var e = response.msg;
            alert('Error: ' + e.message);
        }
    });
}

function updateExistingPlayer(exp, matchPlayer) {
    
    var championExists = false;
    var date = new Date().toISOString();
    for (var j = exp.champions.length - 1; j >= 0; j--) {
        var champion = exp.champions[j];
        if(champion.name === matchPlayer.championkey) {
            champion.kills += matchPlayer.stats.kills;
            champion.deaths += matchPlayer.stats.deaths;
            champion.assists += matchPlayer.stats.assists;
            champion.wins += matchPlayer.stats.winner === true ? 1 : 0;
            champion.games += 1;
            champion.cs += matchPlayer.stats.minionsKilled;
            champion.gold += matchPlayer.stats.goldEarned;
            champion.lastUpdated = date;
            championExists = true;
        }
    }

    if (!championExists) {
        var newChampion = {
            name : matchPlayer.championkey,
            kills : matchPlayer.stats.kills,
            deaths : matchPlayer.stats.deaths,
            assists : matchPlayer.stats.assists,
            wins : matchPlayer.stats.winner === true ? 1 : 0,
            games : 1,
            cs : matchPlayer.stats.minionsKilled,
            gold : matchPlayer.stats.goldEarned,
            lastUpdated : date
        }

        exp.champions.push(newChampion);
    }

    var json = JSON.stringify(exp.champions);

    // Use AJAX to post the object to our update service
    $.ajax({
        type: 'PUT',
        data:{champions:json, date:date},
        url: '/users/updateuser/' + exp._id,
        dataType: 'JSON'
    }).done(function( response ) {
        // Check for successful (blank) response
        if (response.msg === '') {

        }
        else {
            // If something goes wrong, alert the error message that our service returned
            var e = response.msg;
            alert('Error: ' + e.message);
        }
    });
}

// Util functions
// =============================================================
function showInfo(text) {
    var infobox = $("#info");
    infobox.empty();
    infobox.html(text);
}

function clearInfo() {
    var infobox = $("#info");
    infobox.empty();
}

function isTextValid(t) {
    return (t !== undefined && t !== null && t !== "");
}