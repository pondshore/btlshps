var express = require('express');
var app = express();
	
app.get('/api/', function (req, res) {
  res.send('Hello World!')
})

app.use(
	"/", //the URL throught which you want to access to you static content
	express.static(__dirname + '/dist') //where your static content is located in your filesystem
);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})