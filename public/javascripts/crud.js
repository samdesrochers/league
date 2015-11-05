// Userlist data array for filling in info box
var userListData = [];
var apikey = "b4283e24-9216-4553-9e73-ac664a6a9d8b";

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<div class="lbrow"><ul>';
            tableContent += '<li><a href="#" class="linkshowuser" rel="' + this.playername + '">' + this.playername + '</a></li>';
            tableContent += '<li><input class="lbrow_input" type="text" value="'+ this.games +'"></input></li>';
            tableContent += '<li>' + this.wins + '</li>';
            tableContent += '<li>' + this.losses + '</li>';
            tableContent += '<li><img src="http://ddragon.leagueoflegends.com/cdn/5.22.1/img/champion/' + this.topchamp + '.png" alt="' + this.topchamp +'"/></li>';
            tableContent += '<li><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></li>';
            tableContent += '</ul></div>';
        });

        // Inject the whole content string into our existing HTML table
        $('#leaderboard').append(tableContent);

        showPlayerInfo(0);
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