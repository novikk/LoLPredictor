var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var total_matches = 0;
var starting_id = 33409394;
var done_players = [starting_id];

// api limits
var rate = 25.0;
var per = 1.0;
var allowance = rate;
var last_check = Date.now();
var api_key = process.env.RIOT_API_KEY;
var api_url = 'https://euw.api.pvp.net'
// MI ID = 33409394

function canSend() {
	var current = Date.now();
	var time_passed = current - last_check;
	last_check = current;
	allowance += (time_passed/1000.0) * (rate/per);
	if (allowance > rate) allowance = rate;
	if (allowance < 1.0) return false;
	else {
		allowance -= 1.0;
		return true;
	}
}

function apiGetMatches(playerId, region, callback) {
	if (!canSend()) setTimeout(function() { apiGetMatches(playerId, region, callback)}, 1000);
	else request(api_url + '/api/lol/' + region + '/v1.3/game/by-summoner/' + playerId + '/recent?api_key=' + api_key, callback);
}

function getMatches(playerId, region, collection) {
	apiGetMatches(playerId, region, function(err, res, body) {
		if (err) console.error(err);
		else {
			try {
				matches = JSON.parse(body).games;
				console.log("Found " + matches.length + " matches of " + playerId);

				for (var i = 0; i < matches.length; ++i) {
					var currentMatch = matches[i];
					if (currentMatch.subType !== undefined && currentMatch.subType == "URF") {
						collection.insert(currentMatch, function(err, res) {
							if (!err) console.log("Match saved");
							else console.error("Error adding match (probably already in DB): " + err);
						});

						// ahora cogemos los participantes de ese partido, y buscamos sus partidos tambien
						var participants = currentMatch.fellowPlayers;
						for (var j = 0; j < participants.length; ++j) {
							summonerId = participants[j].summonerId;
							if (done_players.indexOf(summonerId) == -1)	{
								done_players.push(summonerId);
								getMatches(summonerId, region, collection);
							}
						}
					}
				}
			} catch(er) {
				console.error(er);
			}
		}
	});
}

MongoClient.connect('mongodb://127.0.0.1:27017/lol', function(err, db) {
	if(err) throw err;

	var collection = db.collection('challenge_matches');
	collection.ensureIndex('gameId', {unique: true}, function(err, indexName) {
		// cogemos los jugadores de challenger
		getMatches(starting_id, 'euw', collection);
	});

	
});