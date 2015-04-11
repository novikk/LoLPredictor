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
var api_url = 'https://euw.api.pvp.net';

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
var totalChamps = 0;
for (var champ in champs.data) {
	champs_ids[champs.data[champ].key] = totalChamps++;
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
	console.log(api_key);
	if (!canSend()) {
		res.send('pls wait');
	} else {
		// get summoner id
		request(api_url + '/api/lol/' + req.params.region + '/v1.4/summoner/by-name/' + req.params.summoner + '/?api_key=' + api_key, function(err, resp, body) {
			if (resp.statusCode == 200) {
				body = JSON.parse(body);
				var summonerId = body[Object.keys(body)[0]].id;
				request(api_url + '/observer-mode/rest/consumer/getSpectatorGameInfo/' + platforms_from_region[req.params.region] + '/' + summonerId + '/?api_key=' + api_key, function(err, resp, body) {
					if (resp.statusCode == 200) {
						body = JSON.parse(body);
						var playing_champs = [];
						for (champ in body.participants) {
							playing_champs.push(champs_ids[body.participants[champ].championId]);
						}

						console.log(playing_champs);
						console.log(simple_logistic.getProbability(playing_champs));
						res.send(body);
					} else {
						res.send("Summoner not in game");
					} 
				});
			} else if (resp.statusCode == 404) {
				res.send("Summoner not found");
			} else {
				res.send("Unknown error");
			}
		});
	}
});

module.exports = router;
