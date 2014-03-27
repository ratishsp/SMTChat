var http = require("http");
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client.html');
});

var chat = io
.of('/chat')
.on('connection', function (socket) {
  socket.emit('a message', {
      that: 'only'
    , '/chat': 'will get'
  });
  chat.emit('a message', {
      everyone: 'in'
    , '/chat': 'will get'
  });
});

var news = io
.of('/news')
.on('connection', function (socket) {
  socket.emit('item', { news: 'item' });
  
});