// Set hash maps to be used later 
var leagueHashMap = {};
var teamHashMap = {};

// Set data to be used later (for easyautocomplete)
var data = [];

// Set searchTerm to be used later
var searchTerm;

// Code Body
$(function() {
    loadSite();
    $('.home-search').submit(function(event) {
        event.preventDefault();
        var searchTerm = $('#square').val();
        getLeague(leagueHashMap[searchTerm]);
    });
    $('.results').on('click', '.clubs', function(event) {
        event.preventDefault();
        searchTerm = $(this).text();
        getTeam(teamHashMap[searchTerm]);
    });
    $('.results').on('click', '.players-detail', function(event) {
        event.preventDefault();
        getPlayer(teamHashMap[searchTerm]);
    });
    $('.results').on('click', '.highlights-detail', function(event) {
        event.preventDefault();
        getHighlight(searchTerm);
    });
});

// Loading website
function loadSite() {
    $.ajax({
        headers: { 'X-Auth-Token': 'e34ad8f9aebb436eb3437851ca9b581a' },
        url: 'http://api.football-data.org/v1/soccerseasons',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {

        data = [];
        leagueHashMap = {};
        $.each(response, function(key, value) {
            data.push(value.caption);
            leagueHashMap[value.caption] = value.id;
        });
        var options = {
            data: data,
            list: {
                maxNumberOfElements: 13,
                match: {
                    enabled: true
                }
            }
        };
        $("#square").easyAutocomplete(options);
    });
}

// Get league data from API
function getLeague(leagueID) {
    $.ajax({
        headers: { 'X-Auth-Token': 'e34ad8f9aebb436eb3437851ca9b581a' },
        url: 'http://api.football-data.org/v1/soccerseasons/' + leagueID + '/leagueTable',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        if (response.leagueCaption !== "Champions League 2015/16") {
            $('.results').html('<table class="table" id="league-result"></table>');
            $('.league #league-category').clone().appendTo('#league-result');
            $.each(response.standing, function(key, value) {
                // Retrieved url from API --> Retrived numbers from url --> Sliced front to get teamID

                var hrefTeams = value._links.team.href;
                var teamID = hrefTeams.match(/\d/g).join("").slice(1);
                teamHashMap[value.teamName] = teamID;

                var leagueShown = showLeague(value.position, value.crestURI, value.teamName, value.playedGames, value.wins, value.draws, value.losses, value.goals, value.points);

                $('.results #league-result').append(leagueShown);
            });
        } else {

            // Clear our results and append new table set for Champs
            $('.results').html('');
            // Run each method over A ~ H (8 Groups)
            $.each(response.standings, function(key, value) {
                $('.results').append('<table class="table" id="champs-result-' + key + '"></table>');
                $('.champs #champs-category').clone().appendTo('#champs-result-' + key);

                // Run each method again over 4 teams
                $.each(value, function(index, value) {

                    var teamID = value.teamId;
                    teamHashMap[value.team] = teamID;

                    // Set variable ChampsShown and use it to store outcome of showChamps function
                    var champsShown = showChamps(value.group, value.rank, value.crestURI, value.team, value.playedGames, value.goals, value.points);

                    // Append the outcome to new table
                    $('.results #champs-result-' + key).append(champsShown);
                });
            });
        }
    });
}

// Get team data from API
function getTeam(teamID) {
    $.ajax({
        headers: { 'X-Auth-Token': 'e34ad8f9aebb436eb3437851ca9b581a' },
        url: 'http://api.football-data.org/v1/teams/' + teamID,
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        $('.results').html('');
        var teamShown = showTeam(response);
        $('.results').append(teamShown);
    });
}

// Get player data from API
function getPlayer(teamID) {
    $.ajax({
        headers: { 'X-Auth-Token': 'e34ad8f9aebb436eb3437851ca9b581a' },
        url: 'http://api.football-data.org/v1/teams/' + teamID + '/players',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        $('.results .players-detail-container').html('<table class="table" id="players-result"></table>');
        $('.players #players-category').clone().appendTo('#players-result');
        $.each(response.players, function(key, value) {
            var playerShown = showPlayer(value.name, value.position, value.jerseyNumber, value.nationality, value.marketValue);

            $('.results #players-result').append(playerShown);
        });
    });
}

function getHighlight(searchTerm) {
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/search',
        datatype: 'json',
        data: {
            part: 'snippet',
            key: 'AIzaSyC-ClHe3ITaHtgy2KsW0ntuCFOmyxIQXhg',
            q: searchTerm
        }
    }).done(function(results) {
        var html = "";
        $.each(results.items, function(key, value) {
            html += '<a href="' + 'https://www.youtube.com/embed/' + value.id.videoId + '" target="iframe_a">' +
                '<img src="' + value.snippet.thumbnails.default.url + '" alt="" />' + '</a>';
        });
        $('.results .highlights-detail-container').html(html).append('<iframe width="775px" height="436px" name="iframe_a"></iframe>');
    });

}


// Display champs info on HTML
function showChamps(groups, rank, crest, name, games, goals, points) {
    // Clone template
    var copy = $('.template #champs-values ').clone();

    // Set champs group
    var champsGroup = copy.find('.champs-group');
    champsGroup.text(groups);

    // Set champs rank
    var champsRank = copy.find('.champs-rank');
    champsRank.text(rank);

    // Set champs crest
    var champsCrest = copy.find('.champs-crest img');
    champsCrest.attr('src', crest);

    // Set champs name
    var champsName = copy.find('.champs-name');
    champsName.html('<div class="clubs"><a>' + name + '</a></div>');

    // Set champs games
    var champsGames = copy.find('.champs-games');
    champsGames.text(games);

    // Set champs goals
    var champsGoals = copy.find('.champs-goals');
    champsGoals.text(goals);

    // Set champs points
    var champsPoints = copy.find('.champs-points');
    champsPoints.text(points);

    return copy;
}

// Display league info on HTML
function showLeague(rank, crest, name, games, wins, draws, losses, goals, points) {
    // Clone template
    var copy = $('.template #league-values ').clone();

    // Set league rank
    var leagueRank = copy.find('.league-rank');
    leagueRank.text(rank);

    // Set league crest
    var leagueCrest = copy.find('.league-crest img');
    leagueCrest.attr('src', crest);

    // Set league name
    var leagueName = copy.find('.league-name');
    leagueName.html('<div class="clubs"><a>' + name + '</a></div>');

    // Set league games
    var leagueGames = copy.find('.league-games');
    leagueGames.text(games);

    // Set league wins
    var leagueWins = copy.find('.league-wins');
    leagueWins.text(wins);

    // Set league draws
    var leagueDraws = copy.find('.league-draws');
    leagueDraws.text(draws);

    // Set league losses
    var leagueLosses = copy.find('.league-losses');
    leagueLosses.text(losses);

    // Set league goals
    var leagueGoals = copy.find('.league-goals');
    leagueGoals.text(goals);

    // Set league points
    var leaguePoints = copy.find('.league-points');
    leaguePoints.text(points);

    return copy;
}

// Display team info on HTML
function showTeam(team) {
    // Clone template
    var copy = $('.template .team').clone();

    // Set team crest
    var crest = copy.find('.team-crest img');
    crest.attr('src', team.crestUrl);

    // Set team name
    var name = copy.find('.team-name');
    name.text(team.name);

    // Set team market value
    var marketvalue = copy.find('.team-marketvalue');
    marketvalue.text(team.squadMarketValue);

    return copy;
}

function showPlayer(player, position, number, nationality, value) {
    // Clone template
    var copy = $('.template #players-values ').clone();

    // Set player name
    var playerName = copy.find('.players-name');
    playerName.text(player);

    // Set player jersey number
    var playerNumber = copy.find('.players-number');
    playerNumber.text(number);

    // Set player position
    var playerPosition = copy.find('.players-position');
    playerPosition.text(position);

    // Set player nationality
    var playerNationality = copy.find('.players-nationality');
    playerNationality.text(nationality);

    // Set player value
    var playerValue = copy.find('.players-value');
    playerValue.text(value);

    return copy;
}
