// Userlist data array for filling in info box
var userListData = [];
var apikey = "b4283e24-9216-4553-9e73-ac664a6a9d8b";

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Add User button click
    $('#btnAddUser').on('click', addUser);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

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
        var topChampRow = getChampionFormatedRow(
            this.champions[0].name, 
            this.champions[0].kills,
            this.champions[0].kills,
            this.champions[0].kills,
            this.champions[0].kills,
            this.champions[0].kills,
            this.champions[0].kills,
            this.champions[0].kills,
            this.champions[0].kills,
            this.champions[0].kills,
            this.champions[0].kills
        );

            tableContent += '<div class="playerContainer" id="container_' + this._id +'"">';
            tableContent += '<div class="playerName"><a href="#" class="linkshowuser" rel="' + this.name + '">' + this.name + '</a> - <a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></div>';
            tableContent += '<table class="playerTable">';
            tableContent += '<tr class="playerTableRow1">';
                tableContent += '<td class="tdHeaderTitle">Top</td>';
                tableContent += '<td class="tdHeaderTitle">Kills</td>';
                tableContent += '<td class="tdHeaderTitle">Deaths</td>';
                tableContent += '<td class="tdHeaderTitle">Assists</td>';
                tableContent += '<td class="tdHeaderTitle">KDA</td>';
                tableContent += '<td class="tdHeaderTitle">Wins</td>';
                tableContent += '<td class="tdHeaderTitle">Games</td>';
                tableContent += '<td class="tdHeaderTitle">CS</td>';
                tableContent += '<td class="tdHeaderTitle">AVG CS</td>';
                tableContent += '<td class="tdHeaderTitle">Gold</td>';
                tableContent += '<td class="tdHeaderTitle">AVG Gold</td>';
                tableContent += '<td class="tdHeaderTitle">Delete</td>';
            tableContent += '</tr>';
            tableContent += topChampRow;
            tableContent += '</table>';
            tableContent += '<div><a href="#" class="linkaddchampion" rel="' + this._id + '">Add Champion</a> | <a href="#" class="linkupdatechamps" rel="' + this._id + '">Update Champions</a></div>';
            tableContent += '</div>';
        } catch(e) {}
        });

        // Inject the whole content string into our existing HTML table
        $('#leaderboard').html(tableContent);

        // Add delete click after appending content
        $('.linkdeleteuser').click(deleteUser);

        // Add champion click after appending content
        $('.linkaddchampion').click(addEmptyChampion);
    });
};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'playername': $('#addUser fieldset input#inputPlayerName').val(),
            'games': $('#addUser fieldset input#inputGamesPlayed').val(),
            'wins': $('#addUser fieldset input#inputWins').val(),
            'losses': $('#addUser fieldset input#inputLosses').val(),
            'topchamp': $('#addUser fieldset input#inputTopChamp').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addUser fieldset input').val('');
                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};

// Delete User
function addEmptyChampion(event) {

    event.preventDefault();

    var pid = $(this).attr('rel');
    var container = $("#container_" + pid + " .playerTable");
    var newChampRow = getChampionFormatedRow(null, 2, 1, 4, 6, 4, 333, 2, 1, 5, 340);

    container.append(newChampRow);

    // Add Update/Delete events for Champions  
    $('.linkupdatechamps').click(updateChampions);

    // Add champion click after appending content
    $('.linkdeletechamp').click(deleteChampion);

};

function getChampionFormatedRow(champname, kills, deaths, assists, kda, wins, games, cs, avgcs, gold, avggold) {
    var row = '';
    row += '<tr class="playerTableRowN">';

    if(champname === null) {
        row += '<td class="tdHeaderValue champname"><input type="text" name="champname"></td>';
    } else {
        row += '<td class="tdChampSquare"><img class="imgSmallSquare" src="http://ddragon.leagueoflegends.com/cdn/5.22.1/img/champion/' + champname + '.png" alt="' + champname +'"/></td>';
    }

    row += '<td class="tdHeaderValue"><input type="text" name="kills" value=' + kills + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="deaths" value=' + deaths + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="assists" value=' + assists + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="kda" value=' + kda + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="wins" value=' + wins + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="games" value=' + games + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="cs" value=' + cs + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="avgcs" value=' + avgcs + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="gold" value=' + gold + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="avggold" value=' + avggold + '></input></td>';
    row += '<td class="tdHeaderValue"><a href="#" class="linkdeletechamp" rel="' + this._id + '">X</a></td>';

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

    $("#container_" + pid + " .playerTable tr").each(function(i, row) {
        // Skip header and TOP values
        if(i > 1) {

            var champion = {
                'name' : kills = $(row).find("input[name='champname']").val(),
                'kills' : $(row).find("input[name='kills']").val(),
                'deaths' : $(row).find("input[name='deaths']").val(),
                'assists' : $(row).find("input[name='assists']").val(),
                'kda' : $(row).find("input[name='kda']").val(),
                'wins' : $(row).find("input[name='wins']").val(),
                'games' : $(row).find("input[name='games']").val(),
                'cs' : $(row).find("input[name='cs']").val(),
                'avgcs' : $(row).find("input[name='avgcs']").val(),
                'gold' : $(row).find("input[name='gold']").val(),
                'avggold' : $(row).find("input[name='avggold']").val()
            }

            player.champions.push(champion);
        }
    });

    // Use AJAX to post the object to our update service
    $.ajax({
        type: 'PUT',
        data: player,
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
            alert('Error: ' + response.msg);
        }
    });

}

function deleteChampion() {

}