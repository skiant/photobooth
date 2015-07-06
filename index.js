var express = require('express');
var browserify = require('browserify-middleware');
var app = express();

// static files
app.use(express.static('public'));
app.get('/bundle.js', browserify('./client/app/index.js'));

// statr server
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
