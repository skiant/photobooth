var express = require('express');
var browserify = require('browserify-middleware');
var app = express();

// allow websockets
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', "http://"+req.headers.host+':8000');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next();
});

// static files
app.use(express.static('public'));
app.get('/bundle.js', browserify('./client/app/index.js'));

// statr server
var server = app.listen(8080, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('App listening at http://%s:%s', host, port);
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
	socket.on('log', function (data) {
		console.log(data);
	});
});
