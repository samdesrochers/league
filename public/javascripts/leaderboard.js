var playerListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
});

// =============================================================
function toggleShowChampions(event) {

    event.preventDefault();
    var pid = $(this).attr('rel');
    $("#container_" + pid + " .playerTable tr").each(function(i, row) {

        // Skip header and TOP values
        if(i > 1) {
            $(row).toggle("fast");
        }
    });
}

// =============================================================
function populateTable(shouldHideChampions) {

    lastHiddenState = shouldHideChampions;

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
                tableContent += '<div class="playerName"><a href="#" class="linkshowuser" rel="' + this.name + '">#' + index++ + ": " + this.name + '</a></div>';
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
                tableContent += '<div class="champOps"><a href="#/" class="linkshowchamps" rel="' + this._id + '">Toggle Champions</a></div>';
                tableContent += '</div>';

            } catch(e) {
                console.log(e);
            }
        });

        // Inject the whole content string into our existing HTML table
        $('#leaderboard').html(tableContent);
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
        var statsRow = getChampionRow (
                        player._id, champ.name, champ.kills, champ.deaths, 
                        champ.assists, champ.wins, champ.games,
                        champ.cs, champ.gold, champ.lastUpdated);
        body += statsRow;

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
