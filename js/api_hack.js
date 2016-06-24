var season_hash_map = {};

$(function() {
    getSeasons();
    $('.home-search').submit(function(event) {
        event.preventDefault();

        var searchTerm = $('.form-control').val();
        getTeam(season_hash_map[searchTerm]);
    });
});

function getSeasons(searchTerm) {
    $.ajax({
        headers: { 'X-Auth-Token': 'e34ad8f9aebb436eb3437851ca9b581a' },
        url: 'http://api.football-data.org/v1/soccerseasons',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        // do something with the response, e.g. isolate the id of a linked resource
        console.log(response, '<---RESPONSE-Season');
        var data = [];
        season_hash_map = {};
        $.each(response, function (key, value) {
            data.push(value.caption);
            season_hash_map[value.caption] = value.id;
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

function getTeam(teamID) {
    $.ajax({
        headers: { 'X-Auth-Token': 'e34ad8f9aebb436eb3437851ca9b581a' },
        url: 'http://api.football-data.org/v1/soccerseasons/' + teamID + '/teams',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        // do something with the response, e.g. isolate the id of a linked resource
        console.log(response, '<---RESPONSE-Team');
        $.each(response.teams, function (key, value) {
            $('.results').append('<p>' + value.name + '</p>');
        });
    });
}
