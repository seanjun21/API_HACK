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
        url: 'http://api.football-data.org/v1/soccerseasons/' + leagueID + '/teams',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        $('.results').html('');

        teamHashMap = {};
        $.each(response.teams, function(key, value) {
            // Retrieved url from API --> Retrived numbers from url --> Sliced front to get teamID
            var hrefTeams = value._links.fixtures.href;
            var teamID = hrefTeams.match(/\d/g).join("").slice(1);
            teamHashMap[value.name] = teamID;

            var leagueShown = showLeague(value.name);
            $('.results').append(leagueShown);
        });
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
        $('.results .extra-container').html('<table class="table" id="players-result"></table>');
        $('.players #category').clone().appendTo('#players-result');
        $.each(response.players, function(key, value) {
            var playerShown = showPlayer(value.name, value.position, value.jerseyNumber, value.nationality, value.marketValue);

            $('.results #players-result').append(playerShown);
        });
    });
}

// Display league info on HTML
function showLeague(league) {
    var link = '<div><a class="clubs">' + league + '</a></div>';
    return link;
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
    var copy = $('.template #values ').clone();

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
