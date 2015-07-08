var express = require('express');
var browserify = require('browserify-middleware');
var app = express();
var fs = require('fs');
var path = require('path');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILLKEY);

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

	socket.on('save-pic', function (data) {
		var dataBuffer = new Buffer(data.replace(/^data:image\/png;base64,/, ""), 'base64');
		var fileName = path.join(__dirname, 'capture', Date.now() + '.png');
		fs.writeFile(fileName, dataBuffer, function (err) {
			if(err) {
				console.log(err);
			}
		});
	})

	var message = {
			html: '<p>Salut !</p><p>Voici un petit souvenir du mariage de Juliette et Mathieu.</p>',
			subject: 'Tu t\'es vu quand t\'as bu?',
			from_email: 'info@julietteetmathieu.be',
			from_name: 'Photobooth Juliette et Mathieu',
			to: [{}],
			attachments: [{
				type: 'image/png',
				name: 'photobooth-picture',
				content: ''
			}]
	}

	socket.on('mail-pic', function (data) {
		console.log('Sending email');
		var newMessage = message;
		newMessage.to[0].email = data.email;
		newMessage.attachments[0].content = data.image.replace('data:image/png;base64,', '');
		mandrill_client.messages.send({message: newMessage},
			function (result) {console.log(result)},
			function (error) {console.log(error)}
		);
	},
	function (error) {
		console.log(error);
	})
});
