var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var gameState = {
	turn: 1,
	players: {
		'1': {
			field: [
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 3, 2, 1, 0],
			], 
			ready: false
		}, 
		'2': {
			field: [
				[0, 1, 2, 3, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			],
			ready: false
		}
	}
};	

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())
	
app.get('/api/turn', function (req, res) {
	res.send({ turn: gameState.players['1'].ready && gameState.players['2'].ready ? gameState.turn : 0 });
})	
	
app.get('/api/mine', function (req, res) {
  res.send(gameState.players[req.query.player].field)
})

app.get('/api/his', function (req, res) {
  res.send(gameState.players[req.query.player].field.map(function(row) {
	  return row.map(function(cell){
		  return cell > 2 ? cell : 0;
	  })
  }))
})

app.post('/api/ready', function (req, res) {
	gameState.players[req.query.player].field = req.body;
	gameState.players[req.query.player].ready = true;
	res.sendStatus(201);
})

app.post('/api/shoot', function (req, res) {
	if(gameState.turn == req.query.target) {
		res.send({ error: 'wait your turn, man!'});
		return;
	}
	var {y, x} = req.body;
	var val = gameState.players[req.query.target].field[y][x] == 2 ? 3 : 4;
	gameState.players[req.query.target].field[y][x] = val;	
	if(gameState.turn == 1){
		gameState.turn = 2;
	} else {
		gameState.turn = 1;
	}
	res.send({ value: val });
})

app.use(
	"/", //the URL throught which you want to access to you static content
	express.static(__dirname + '/dist') //where your static content is located in your filesystem
);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})