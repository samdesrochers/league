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
    row += '<td class="tdHeaderTitle">Delete</td>';
    row += '</tr>';
    return row;
}

function getNewPlayerRow(id, name, iconid) {
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
    row += '<td class="tdHeaderValue"> - </td>';
    row += '</tr>';
    return row;
}

function getPlayerHeaderRow(id, iconid, kills, deaths, assists, kda, wins, games, cs, avgcs, gold, avggold) {
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
    row += '<td class="tdHeaderValue"> - </td>';
    row += '</tr>';
    return row;
}


function getChampionRow(id, champname, kills, deaths, assists, wins, games, cs, gold, hidden) {
    var row = '';
    var gamesInt = parseInt(games);
    var kda = Math.round((parseInt(kills) + parseInt(assists)) / Math.max(1, parseInt(deaths))); //(K+A) / Max(1,D)
    var csPerGame = Math.round(parseInt(cs)/gamesInt);
    var goldPerGame = Math.round(parseInt(gold)/gamesInt);

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
        row += '<td class="tdHeaderValue">' + kda + ' </input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="wins" value=' + wins + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="games" value=' + games + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="cs" value=' + cs + '></input></td>';
        row += '<td class="tdHeaderValue"> ' + csPerGame + ' </input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="gold" value=' + gold + '></input></td>';
        row += '<td class="tdHeaderValue"> ' + goldPerGame + ' </input></td>';
        row += '<td class="tdHeaderValue"><a href="#" class="linkdeletechamp" rel="' + id + "#" + champname + '">X</a></td>';
    } else {
        row += '<td class="tdChampSquare"><input type="hidden" name="name" value=' + champname + '><img class="imgSmallSquare" src="http://ddragon.leagueoflegends.com/cdn/5.22.1/img/champion/' + champname + '.png" alt="' + champname +'"/></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="kills" value=' + kills + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="deaths" value=' + deaths + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="assists" value=' + assists + '></input></td>';
        row += '<td class="tdHeaderValue">' + kda + ' </input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="wins" value=' + wins + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="games" value=' + games + '></input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="cs" value=' + cs + '></input></td>';
        row += '<td class="tdHeaderValue"> ' + csPerGame + ' </input></td>';
        row += '<td class="tdHeaderValue"><input type="text" name="gold" value=' + gold + '></input></td>';
        row += '<td class="tdHeaderValue"> ' + goldPerGame + ' </input></td>';
        row += '<td class="tdHeaderValue"><a href="#" class="linkdeletechamp" rel="' + id + "#" + champname + '">X</a></td>';
    }

    row += '</tr>';
    return row;
}