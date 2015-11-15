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
    row += '</tr>';
    return row;
}

//-----------------------------------------------------------
function getPlayerStatsRow(id, iconid, kills, deaths, assists, kda, wins, games, cs, avgcs, gold, avggold, lastUpdated) {
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
    row += '</tr>';
    return row;
}

//-----------------------------------------------------------
function getChampionRow(id, champname, kills, deaths, assists, wins, games, cs, gold, lastUpdated) {
    var row = '';
    var gamesInt = parseInt(games);
    var kda = Math.round((parseInt(kills) + parseInt(assists)) / Math.max(1, parseInt(deaths))); //(K+A) / Max(1,D)
    var csPerGame = (gamesInt === 0 || cs === 0) ? 0 : Math.round(parseInt(cs)/gamesInt);
    var goldPerGame = (gamesInt === 0 || gold === 0) ? 0 : Math.round(parseInt(gold)/gamesInt);

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
    row += '</tr>';
    return row;
}
