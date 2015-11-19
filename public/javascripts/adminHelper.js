//-----------------------------------------------------------
function getStatsHeaderRow() {
    var row = ""
    row += '<tr class="playerTableHeader">';
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
    row += '<td class="tdHeaderTitle">Last Update</td>';
    row += '<td class="tdHeaderTitle">Delete</td>';
    row += '</tr>';
    return row;
}

//-----------------------------------------------------------
function getNewPlayerRow(id, name, iconid, date) {
    var formattedDate = getFormattedDate(date);
    var row = ""
    row += '<tr class="playerTotalRow">';
    row += '<td class="tdChampSquare"><img class="imgSmallSquare" src="http://ddragon.leagueoflegends.com/cdn/5.22.1/img/profileicon/' + iconid + '.png" alt="' + name +'"/></td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">0</td>';
    row += '<td class="tdHeaderValue">' + formattedDate + '</td>';
    row += '<td class="tdHeaderValue"> - </td>';
    row += '</tr>';
    return row;
}

//-----------------------------------------------------------
function getPlayerStatsRow(id, iconid, kills, deaths, assists, kda, wins, games, cs, avgcs, gold, avggold, lastUpdated) {
    var formattedDate = getFormattedDate(lastUpdated);
    var row = ""
    row += '<tr class="playerTotalRow">';
    row += '<td class="tdChampSquare"><img class="imgSmallSquare" src="http://ddragon.leagueoflegends.com/cdn/5.22.1/img/profileicon/'+ iconid +'.png" alt="' + iconid +'"/></td>';
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
    row += '<td class="tdHeaderValue">' + formattedDate + '</td>';
    row += '<td class="tdHeaderValue"> - </td>';
    row += '</tr>';
    return row;
}

//-----------------------------------------------------------
function getNewChampionRow(id, kills, deaths, assists, wins, games, cs, gold, lastUpdated) {
    
    var formattedDate = getFormattedDate(lastUpdated);
    var row = '';
    row += '<tr class="playerTableNewChampRow rowValues">';
    row += '<td class="tdHeaderValue champname"><input type="text" name="name"></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="kills" value=' + kills + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="deaths" value=' + deaths + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="assists" value=' + assists + '></input></td>';
    row += '<td class="tdHeaderValue"> - </input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="wins" value=' + wins + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="games" value=' + games + '></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="cs" value=' + cs + '></input></td>';
    row += '<td class="tdHeaderValue"> -</input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="gold" value=' + gold + '></input></td>';
    row += '<td class="tdHeaderValue"> - </input></td>';
    row += '<td class="tdHeaderValue"> ' + formattedDate + ' </input></td>';
    row += '<td class="tdHeaderValue"><a href="#" class="linkdeletechamp" rel="' + id + '#new">X</a></td>';
    row += '</tr>';
    return row;
}

//-----------------------------------------------------------
function getChampionInputRow(champname) {
    var row = '';
    row += '<tr class="rowValues canHide" style="display:none">';

    // Input per champion
    row += '<td class="tdHeaderValue"><input type="hidden" name="name" value=' + champname + '>Update ' + champname + '</td>';
    row += '<td class="tdHeaderValue"><input type="text" name="kills"></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="deaths"></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="assists"></input></td>';
    row += '<td class="tdHeaderValue"> - </input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="wins"></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="games"></input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="cs"></input></td>';
    row += '<td class="tdHeaderValue"> - </input></td>';
    row += '<td class="tdHeaderValue"><input type="text" name="gold"></input></td>';
    row += '<td class="tdHeaderValue"> - </input></td>';
    row += '<td class="tdHeaderValue"> - </input></td>';
    row += '<td class="tdHeaderValue"> - </td>';
    row += '</tr>';
    return row;
}

//-----------------------------------------------------------
function getChampionRow(id, champname, kills, deaths, assists, wins, games, cs, gold, lastUpdated) {
    var row = '';
    var gamesInt = parseInt(games);
    var kda = (parseInt(kills) + parseInt(assists)) / Math.max(1, parseInt(deaths)); //(K+A) / Max(1,D)
    kda = kda.toFixed(2);
    var csPerGame = (gamesInt === 0 || cs === 0) ? 0 : Math.round(parseInt(cs)/gamesInt);
    var goldPerGame = (gamesInt === 0 || gold === 0) ? 0 : Math.round(parseInt(gold)/gamesInt);
    var formattedDate = getFormattedDate(lastUpdated);

    row += '<tr class="rowValues canHide" style="display:none">';
    
    // Header per champion
    row += '<td class="tdChampSquare"><input type="hidden" name="name" value=' + champname + '><img class="imgSmallSquare" src="http://ddragon.leagueoflegends.com/cdn/5.22.1/img/champion/' + champname + '.png" alt="' + champname +'" title="' + champname + '"/></td>';
    row += '<td class="tdHeaderValue">' + kills + '</td>';
    row += '<td class="tdHeaderValue">' + deaths + '</td>';
    row += '<td class="tdHeaderValue">' + assists + '</td>';
    row += '<td class="tdHeaderValue">' + kda + '</td>';
    row += '<td class="tdHeaderValue">' + wins + '</td>';
    row += '<td class="tdHeaderValue">' + games + '</td>';
    row += '<td class="tdHeaderValue">' + cs + '</td>';
    row += '<td class="tdHeaderValue">' + csPerGame + '</td>';
    row += '<td class="tdHeaderValue">' + gold + '</td>';
    row += '<td class="tdHeaderValue">' + goldPerGame + '</td>';
    row += '<td class="tdHeaderValue">' + formattedDate + '</td>';
    row += '<td class="tdHeaderValue"><a href="#" class="linkdeletechamp" rel="' + id + "#" + champname + '">X</a></td>';

    row += '</tr>';
    return row;
}

//-----------------------------------------------------------
var monthNames = [
  "Jan", "Feb", "Mar",
  "Apr", "May", "June", "July",
  "Aug", "Sep", "Oct",
  "Nov", "Dec"
];

function getFormattedDate(d) {
    var date = new Date(d);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day + ' ' + monthNames[monthIndex];
}