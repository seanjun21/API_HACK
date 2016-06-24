var leagueHashMap = {};
var teamHashMap = {};
var data = [];

$(function() {
    loadSite();
    $('.home-search').submit(function(event) {
        event.preventDefault();
        var searchTerm = $('.form-control').val();
        getLeague(leagueHashMap[searchTerm]);
    });
    $('.results').on('click', 'a', function(){
        console.log(this.text);
        console.log(teamHashMap);
    });
});

function loadSite() {
    $.ajax({
        headers: { 'X-Auth-Token': 'e34ad8f9aebb436eb3437851ca9b581a' },
        url: 'http://api.football-data.org/v1/soccerseasons',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        // do something with the response, e.g. isolate the id of a linked resource
        // console.log(response, '<---RESPONSE-Season');

        data = [];
        leagueHashMap = {};
        $.each(response, function(key, value) {
            data.push(value.caption);
            leagueHashMap[value.caption] = value.id;
        });
        var options = {
            data: data,
            theme: "square",
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

function getLeague(seasonID) {
    $.ajax({
        headers: { 'X-Auth-Token': 'e34ad8f9aebb436eb3437851ca9b581a' },
        url: 'http://api.football-data.org/v1/soccerseasons/' + seasonID + '/teams',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        // console.log(response);
        $('.results').html('');

        teamHashMap = {};
        $.each(response.teams, function(key, value) {
            var hrefTeams = value._links.fixtures.href;
            var teamID = hrefTeams.match(/\d/g).join("").slice(1);
            teamHashMap[value.name] = teamID;
            // console.log(teamID, value.name, "TEAMID AND VALUE.NAME");
            var league = showLeague(value.name);
            // console.log(league);
            
            // $('.results').append(league);
            $('.results').append(league);
        });
    });
}

// function getTeam(seasonID) {
//     $.ajax({
//         headers: { 'X-Auth-Token': 'e34ad8f9aebb436eb3437851ca9b581a' },
//         url: 'http://api.football-data.org/v1/soccerseasons/' + seasonID + '/teams',
//         dataType: 'json',
//         type: 'GET',
//     }).done(function(response) {
//         // console.log(response);
//         $('.results').html('');

//         teamHashMap = {};
//         $.each(response.teams, function(key, value) {
//             var hrefTeams = value._links.fixtures.href;
//             var teamID = hrefTeams.match(/\d/g).join("").slice(1);
//             teamHashMap[value.name] = teamID;
//             // console.log(teamID, value.name, "TEAMID AND VALUE.NAME");
//             var league = showLeague(value.name);
//             // console.log(league);
            
//             // $('.results').append(league);
//             $('.results').append(league);
//         });
//     });
// }

function showLeague (name) {
    var link = '<div><a>' + name + '</a></div>';
    return link;
    // return result;
}

// function showTeam (id, name) {
//     var copy = $('.template .team').clone();
//     var link = '<p><a target="_blank" ' + 'href="http://api.football-data.org/v1/teams/' + id + '">' + name + '</a></p>';
//     return link;
//     // return result;
// }