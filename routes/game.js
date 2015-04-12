var express = require('express');
var request = require('request');
var simple_logistic = require('../simple_logistic.js')
var fs = require('fs');

var router = express.Router();

// api limits
var rate = 300.0;
var per = 1.0;
var allowance = rate;
var last_check = Date.now();
var api_key = process.env.RIOT_API_KEY;
var api_url = '.api.pvp.net';

var platforms_from_region = {
	"euw": "EUW1",
	"na": "NA1",
	"br": "BR1",
	"eune": "EUN1",
	"kr": "KR",
	"oce": "OC1",
	"ru": "RU",
	"tr": "TR1",
	"lan": "LA1",
	"las": "LA2"
};

// initialize champs
var champs = JSON.parse(fs.readFileSync('champion.json', 'utf8'));
var champs_ids = [];
var champs_names = [];
var champs_codenames = [];
var totalChamps = 0;
for (var champ in champs.data) {
	champs_ids[champs.data[champ].key] = totalChamps++;
	champs_names[champs.data[champ].key] = champs.data[champ].name;
	champs_codenames[champs.data[champ].key] = champ;
}

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

router.get('/:region/:summoner', function(req, res, next) {
	var region = req.params.region.toLowerCase();
	if (!canSend()) {
		res.render('error', {error: "Our site is under heavy load. Please try in a few seconds!"});
	} else {
		// get summoner id

		request('https://' + region + api_url + '/api/lol/' + req.params.region.toLowerCase() + '/v1.4/summoner/by-name/' + encodeURI(req.params.summoner) + '/?api_key=' + api_key, function(err, resp, body) {
			if (resp.statusCode == 200) {
				body = JSON.parse(body);
				var summonerId = body[Object.keys(body)[0]].id;
				request('https://' + region + api_url + '/observer-mode/rest/consumer/getSpectatorGameInfo/' + platforms_from_region[req.params.region.toLowerCase()] + '/' + summonerId + '/?api_key=' + api_key, function(err, resp, body) {
					if (resp.statusCode == 200) {
						body = JSON.parse(body);
						var playing_champs = [];
						for (champ in body.participants) {
							playing_champs.push(champs_ids[body.participants[champ].championId]);
						}

						body.probability = (simple_logistic.getProbability(playing_champs) * 100).toFixed(2);
						for (var i = 0; i < body.participants.length; ++i) {
							body.participants[i].name = champs_names[body.participants[i].championId];
							body.participants[i].codename = champs_codenames[body.participants[i].championId];
						}
						res.render('game_view', {info: body});
					} else {
						res.render('error', {error: "Summoner not in game"});
					} 
				});
			} else if (resp.statusCode == 404) {
				res.render('error', {error: "Summoner not found"});
			} else {
				res.send(resp);
				res.render('error', {error: "There was an error! Please try again"});
			}
		});
	}
});

module.exports = router;
