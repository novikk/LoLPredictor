var MongoClient = require('mongodb').MongoClient;
var fs = require("fs");

var totalDone = 0;
var totalChamps = 0;
var filename = 'data_urf.csv';

MongoClient.connect('mongodb://127.0.0.1:27017/lol', function(err, db) {
	if(err) throw err;

	// leemos los campeones y les asignamos una ID
	champs_id = [];
	for (var i = 0; i < 432 + 1; ++i) {
		champs_id[i] = 0;
	}

	var champs = JSON.parse(fs.readFileSync('champion.json', 'utf8'));
	for (var champ in champs.data) {
		champs_id[champs.data[champ].key] = totalChamps++;
	}


	// csv header
	for (var i = 0; i < totalChamps * 2; ++i) {
		fs.appendFileSync(filename, "c" + i % totalChamps + "t" + Math.floor(i / totalChamps) + ",");
	}

	fs.appendFileSync(filename, "winner\n");


	var collection = db.collection('challenge_matches');
	collection.find({}, function(err, res) {
		var info = [];
		for (var i = 0; i < totalChamps * 2 + 1; ++i) info[i] = 0;
	
		res.each(function(err, match) {
			var my_champ_pos = (champs_id[match.championId]) + totalChamps * (match.teamId/100 - 1);
			info[my_champ_pos] = 1;

			participants = match.fellowPlayers;
			for (var i = 0; i < participants.length; ++i) {
				var champ_pos = (champs_id[participants[i].championId]) + totalChamps * (participants[i].teamId/100 - 1);
				info[champ_pos] = 1;
			}
	
			if (match.stats.team == 100 &&  match.stats.win == true) {
				info[info.length-1] = 0;
			} else if (match.stats.team == 200 &&  match.stats.win == true) {
				info[info.length-1] = 1;
			} else if (match.stats.team == 100 &&  match.stats.win == false) {
				info[info.length-1] = 1;
			} else {
				info[info.length-1] = 0;
			}
	
			// escribimos
			fs.appendFileSync(filename, info.join(',') + '\n');
	
			++totalDone;
			if (totalDone % 1000 == 0) console.log("Completados " + totalDone + " partidos");
	
			// ponemos a 0 de nuevo
			for (var i = 0; i < participants.length; ++i) {
				var champ_pos = (champs_id[participants[i].championId]) + totalChamps * (participants[i].teamId/100 - 1);
				info[champ_pos] = 0;
			}

			info[my_champ_pos] = 0;
		});
	});
});