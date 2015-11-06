// Userlist data array for filling in info box
var userListData = [];
var apikey = "b4283e24-9216-4553-9e73-ac664a6a9d8b";

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable(true);

    // Add User button click
    $('#btnAddUser').on('click', addUser);
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

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            try{
                // debug json validator
                try{
                    var championsJSON = $.parseJSON(this.champions);
                    this.champions = championsJSON;
                }   catch(e) {

                }

                tableContent += '<div class="playerContainer" id="container_' + this._id +'"">';
                tableContent += '<div class="playerName"><a href="#" class="linkshowuser" rel="' + this.name + '">' + this.name + '</a> - <a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></div>';
                tableContent += '<table class="playerTable">';
                tableContent += getChamptionHeaderRow();
                tableContent += populateTableRows(this, shouldHideChampions);
                tableContent += '</table>';
                tableContent += '<div><a href="#" class="linkaddchampion" rel="' + this._id + '">Add Champion</a> | <a href="#" class="linkupdatechamps" rel="' + this._id + '">Update Champions</a> <a href="#" class="linkshowchamps" rel="' + this._id + '">Toggle Champions</a></div>';
                tableContent += '</div>';

            } catch(e) {}
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
function addUser(event) {
    event.preventDefault();
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            playername: $('#addUser fieldset input#inputPlayerName').val(),
            champions: []
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {
            if (response.msg === '') {
                $('#addUser fieldset input').val('');
                populateTable();
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
    var container = $("#container_" + pid + " .playerTable");
    var newChampRow = getChampionFormatedRow(pid, null, 2, 1, 4, 6, 4, 333, 2, 1, 5, 340, false);

    container.append(newChampRow);
};

function getChamptionHeaderRow() {
    var row = ""
    row += '<tr class="playerTableRow1">';
    row += '<td class="tdHeaderTitle"></td>';
    row += '<td class="tdHeaderTitle">Kills</td>';
    row += '<td class="tdHeaderTitle">Deaths</td>';
    row += '<td class="tdHeaderTitle">Assists</td>';
    row += '<td class="tdHeaderTitle">KDA</td>';
    row += '<td class="tdHeaderTitle">Wins</td>';
    row += '<td class="tdHeaderTitle">Games</td>';
    row += '<td class="tdHeaderTitle">CS</td>';
    row += '<td class="tdHeaderTitle">CS/Games</td>';
    row += '<td class="tdHeaderTitle">Gold</td>';
    row += '<td class="tdHeaderTitle">Gold/Games</td>';
    row += '<td class="tdHeaderTitle">Delete</td>';
    row += '</tr>';
    return row;
}

function getChampionFormatedRow(id, champname, kills, deaths, assists, kda, wins, games, cs, avgcs, gold, avggold, hidden) {
    var row = '';

    if(hidden) {
        row += '<tr class="playerTableRowN canHide" style="display:none">';
    } else {
        row += '<tr class="playerTableRowN">';
    }

    if(champname === null) {
        row += '<td class="tdHeaderValue champname"><input type="text" name="name"></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="kills" value=' + kills + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="deaths" value=' + deaths + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="assists" value=' + assists + '></input></td>';
        row += '<td class="tdHeaderValue"> - </input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="wins" value=' + wins + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="games" value=' + games + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="cs" value=' + cs + '></input></td>';
        row += '<td class="tdHeaderValue"> - </input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="gold" value=' + gold + '></input></td>';
        row += '<td class="tdHeaderValue"> - </input></td>';
        row += '<td class="tdHeaderValue"><a href="#" class="linkdeletechamp" rel="' + id + "#" + champname + '">X</a></td>';
    } else if(champname === "profile") {
        row += '<td class="tdChampSquare"><img class="imgSmallSquare" src="http://ddragon.leagueoflegends.com/cdn/5.22.1/img/profileicon/749.png" alt="' + champname +'"/></td>';
        row += '<td class="tdHeaderValue">' + kills + '</td>';
        row += '<td class="tdHeaderValue">' + deaths + '</td>';
        row += '<td class="tdHeaderValue">' + assists + '</td>';
        row += '<td class="tdHeaderValue">' + kda + '</td>';
        row += '<td class="tdHeaderValue">' + wins + '</td>';
        row += '<td class="tdHeaderValue">' + games + '</td>';
        row += '<td class="tdHeaderValue">' + cs + '</td>';
        row += '<td class="tdHeaderValue">' + avgcs + '</td>';
        row += '<td class="tdHeaderValue">' + gold + '</td>';
        row += '<td class="tdHeaderValue">' + avggold + '</td>';
        row += '<td class="tdHeaderValue"> - </td>';
    } else {
        row += '<td class="tdChampSquare"><input type="hidden" name="name" value=' + champname + '><img class="imgSmallSquare" src="http://ddragon.leagueoflegends.com/cdn/5.22.1/img/champion/' + champname + '.png" alt="' + champname +'"/></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="kills" value=' + kills + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="deaths" value=' + deaths + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="assists" value=' + assists + '></input></td>';
        row += '<td class="tdHeaderValue"> - </input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="wins" value=' + wins + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="games" value=' + games + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="cs" value=' + cs + '></input></td>';
        row += '<td class="tdHeaderValue"> - </input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="gold" value=' + gold + '></input></td>';
        row += '<td class="tdHeaderValue"> - </input></td>';
        row += '<td class="tdHeaderValue"><a href="#" class="linkdeletechamp" rel="' + id + "#" + champname + '">X</a></td>';
    }

    row += '</tr>';
    return row;
}

function updateChampions() {
    event.preventDefault();
    var pid = $(this).attr('rel');
    var player = null;
    for(var i = 0; i < userListData.length; i++) {
        if(userListData[i]._id === pid) {
            player = userListData[i];
        }
    }

    var updatedChampions = [];
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
            }

            updatedChampions.push(champion);
        }
    });

    player.champions = updatedChampions;
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
        var row = getChampionFormatedRow (player._id, champ.name, champ.kills, champ.deaths, 
                    champ.assists, champ.kda, champ.wins, champ.games,
                    champ.cs,champ.avgcs,champ.gold,champ.avggold, shouldHideChampions);

        champ.name, 
        tKills += parseInt(champ.kills); 
        tDeaths += parseInt(champ.deaths);
        tAssists += parseInt(champ.assists); 
        tWins += parseInt(champ.wins); 
        tGames += parseInt(champ.games);
        tCs += parseInt(champ.cs);
        tGold += parseInt(champ.gold);

        body += row;
    }

    tAvgCs = Math.round(tCs / tGames);
    tAvgGold = Math.round(tGold / tGames);

    var tRow = getChampionFormatedRow (player._id, "profile", tKills, tDeaths, tAssists, tKda, tWins, 
        tGames,tCs,tAvgCs,tGold, tAvgGold, false);

    ret += tRow;
    ret += body;
    return ret;
}