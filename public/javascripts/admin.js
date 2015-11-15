var playerListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Add User button click
    $('#btnAddPlayer').on('click', createPlayer);
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
                lastUpdated: createdDate,
                creationTime: createdDate,
                champions: [],
                totalWins: 0
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
            tWins += updatedChampions[c].wins;
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
                tWins += updatingc.wins;
            } else {
                player.champions.push(updatingc);
            }
        };
    }

    player.lastUpdated = updateDate;
    var json = JSON.stringify(player.champions);

    // Use AJAX to post the object to our update service
    $.ajax({
        type: 'PUT',
        data:{champions:json, date:updateDate, totalWins:tWins},
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
        tKda = Math.round((parseInt(tKills) + parseInt(tAssists)) / Math.max(1, parseInt(tDeaths))); //(K+A) / Max(1,D)
    }

    var tRow = getPlayerStatsRow(player._id, player.iconId, tKills, tDeaths, tAssists, tKda, tWins, 
        tGames, tCs, tAvgCs, tGold, tAvgGold, player.lastUpdated);

    ret += tRow;
    ret += body;
    return ret;
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