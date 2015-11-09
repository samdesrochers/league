// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable(true);

    // Add User button click
    $('#btnAddPlayer').on('click', addPlayer);
});

// Functions =============================================================

// Fill table with data
function populateTable(shouldHideChampions) {

    // Empty content string
    var tableContent = '';
    var rowIndex = 0;

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        var index = 1;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            try{

                tableContent += '<div class="playerContainer" id="container_' + this._id +'"">';
                tableContent += '<div class="playerName"><a href="#" class="linkshowuser" rel="' + this.name + '">#' + index++ + ": " + this.name + '</a> - <a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></div>';
                tableContent += '<table class="playerTable">';
                tableContent += getStatsHeaderRow();

                // If this user has champions, populate them
                if(this.champions !== undefined && this.champions !== null) {

                    try {
                        var championsJSON = $.parseJSON(this.champions);
                        this.champions = championsJSON;
                    } catch(e) { }

                    tableContent += populateTableRows(this, shouldHideChampions);
                } else {
                    tableContent += getNewPlayerRow(this._id, this.name, this.iconId, this.lastUpdated);
                }

                // Add operations bar for each player
                tableContent += '</table>';
                tableContent += '<div class="champOps"><a href="#" class="linkaddchampion" rel="' + this._id + '">Add Champion</a> | <a href="#" class="linkupdatechamps" rel="' + this._id + '">Update Champions</a> | <a href="#" class="linkshowchamps" rel="' + this._id + '">Toggle Champions</a></div>';
                tableContent += '</div>';

            } catch(e) {
                console.log(e);
            }
        });

        // Inject the whole content string into our existing HTML table
        $('#leaderboard').html(tableContent);


        $('.linkdeleteuser').click(deleteUser);
        $('.linkaddchampion').click(addNewChampion);
        $('.linkupdatechamps').click(updateChampions);
        $('.linkshowchamps').click(toggleShowChampions);
        $('.linkdeletechamp').click(deleteChampion);
    });
};

// Add User
function addPlayer(event) {

    event.preventDefault();
    var errorCount = 0;
    $('#btnAddPlayer input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    var name = $('fieldset input#inputPlayerName').val();
    var createdDate = new Date().toISOString();

    // Get Summoner id from RIOT
    $.getJSON( '/riot/summonerid/' + name, function( data ) {      
        if (data !== undefined) {

            // hack around RIOT Api, for some reason it always return undefined as leading name for spaced summoner names
            data = data.substring(1, data.length - 1);
            data = data.substring(data.indexOf('{'), data.length);
            data = data.replace("undefined", name);
            var summoner = $.parseJSON(data);
            
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
                    populateTable(true);
                }
                else {
                    alert('Error: ' + response.msg);
                }
            });
        }
        else {
            alert('Please fill in all fields');
            return false;
        }
    });
};

// Delete User
function deleteUser(event) {

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
    }
    else {
        return false;
    }
};

// Add New Champion
function addNewChampion(event) {

    event.preventDefault();

    var pid = $(this).attr('rel');
    var date = new Date().toISOString();
    var container = $("#container_" + pid + " .playerTable");
    var newChampRow = getChampionRow(pid, null, 2, 1, 4, 6, 4, 333, 340, date, false);

    container.append(newChampRow);
};

function updateChampions() {

    event.preventDefault();
    var pid = $(this).attr('rel');
    var player = null;
    for(var i = 0; i < userListData.length; i++) {
        if(userListData[i]._id === pid) {
            player = userListData[i];
        }
    }

    var tWins = 0;
    var updatedChampions = [];
    var updateDate = new Date().toISOString();

    $("#container_" + pid + " .playerTable tr").each(function(i, row) {
        // Skip header and TOP values
        if(i > 1) {

            var champion = {
                name : $(row).find("input[name='name']").val(),
                kills : $(row).find("input[name='kills']").val(),
                deaths : $(row).find("input[name='deaths']").val(),
                assists : $(row).find("input[name='assists']").val(),
                wins : $(row).find("input[name='wins']").val(),
                games : $(row).find("input[name='games']").val(),
                cs : $(row).find("input[name='cs']").val(),
                gold : $(row).find("input[name='gold']").val(),
                lastUpdated : updateDate
            }

            updatedChampions.push(champion);
            tWins += parseInt($(row).find("input[name='wins']").val());
        }
    });

    player.champions = updatedChampions;
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
            populateTable(false);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            var msg = response.msg;
            alert('Error: ' + response.msg);
        }
    });
}

function deleteChampion() {

    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this champion?');
    if(confirmation === true) {
        var ids = $(this).attr('rel').split("#");
        var pid = ids[0];
        var toDelete = ids[1];
        var player = null;
        for(var i = 0; i < userListData.length; i++) {
            if(userListData[i]._id === pid) {
                player = userListData[i];
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
                populateTable(false);
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

function toggleShowChampions() {

    var pid = $(this).attr('rel');
    $("#container_" + pid + " .playerTable tr").each(function(i, row) {

        // Skip header and TOP values
        if(i > 1) {
            $(row).toggle("fast");
        }
    });
}

function populateTableRows(player, shouldHideChampions) {

    var tKills = 0;
    var tDeaths = 0;
    var tAssists = 0;
    var tKda = 0;
    var tWins = 0;
    var tGames = 0;
    var tCs = 0;
    var tAvgCs = 0;
    var tGold = 0;
    var tAvgGold = 0;

    var ret = "";
    var body = "";

    for(var i = 0; i < player.champions.length; i++) {

        var champ = player.champions[i];
        var row = getChampionRow(player._id, champ.name, champ.kills, champ.deaths, 
            champ.assists, champ.wins, champ.games,
            champ.cs, champ.gold, champ.lastUpdated, shouldHideChampions);
        body += row;

        champ.name, 
        tKills += parseInt(champ.kills); 
        tDeaths += parseInt(champ.deaths);
        tAssists += parseInt(champ.assists); 
        tWins += parseInt(champ.wins); 
        tGames += parseInt(champ.games);
        tCs += parseInt(champ.cs);
        tGold += parseInt(champ.gold);
    }

    tAvgCs = Math.round(tCs / tGames);
    tAvgGold = Math.round(tGold / tGames);

    var tRow = getPlayerHeaderRow(player._id, player.iconId, tKills, tDeaths, tAssists, tKda, tWins, 
        tGames, tCs, tAvgCs, tGold, tAvgGold, player.lastUpdated);

    ret += tRow;
    ret += body;
    return ret;
}