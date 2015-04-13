var fs = require('fs');

var totalChamps = 0;

var champs = JSON.parse(fs.readFileSync('champion.json', 'utf8'));
for (var champ in champs.data) {
	console.log(champ + " - " + (totalChamps++));
}