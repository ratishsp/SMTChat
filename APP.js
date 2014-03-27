var http = require("http");
var express = require('express');
var express = require('dao');
//var parseCookie = require('connect').utils.parseCookie;
var bunyan = require('bunyan');
var log = bunyan.createLogger(
	{
		name: "Chat Server",
		streams: [
		          {
		            level: 'info',
		            stream: process.stdout,           // log INFO and above to stdout
		          },
		          {
		            level: 'error',
		            path: '/home/mmishra/my_working_directory/personal/projects/nodejs/hacknight/chatserverapp-error.log'  // log ERROR and above to a file
		          }
		        ],
	    level: 'debug'
	});

var app = express();




/*app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.session({secret: 'secret', key: 'express.sid'}));
    app.use(function (req, res) {
        res.end('<h2>Hello, your session id is ' + req.sessionID + '</h2>');
    });
});*/

var server = http.createServer(app);

var sio = require('socket.io').listen(server);

server.listen(8000);
//var sio = io.listen(app);

log.info("hi my chat server ");
app.get('/', function (req, res) {
	// res.writeHead('<h2>Hello, your session id is ' + req.sessionID + '</h2>');
	log.info("session id is:");
  res.sendfile(__dirname + '/index.html');
 
});

/*io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
*/

var socketCount = 0;

/*sio.set('authorization', function (data, accept) {
    // check if there's a cookie header
    if (data.headers.cookie) {
        // if there is, parse the cookie
        data.cookie = parseCookie(data.headers.cookie);
        // note that you will need to use the same key to grad the
        // session id, as you specified in the Express setup.
        data.sessionID = data.cookie['express.sid'];
    } else {
       // if there isn't, turn down the connection with a message
       // and leave the function.
       return accept('No cookie transmitted.', false);
    }
    // accept the incoming connection
    accept(null, true);
});*/

/*sio.sockets.on('connection', function (socket) {
    console.log('A socket with sessionID ' + socket.handshake.sessionID 
        + ' connected!');
});*/

sio.sockets.on('connection', function (socket) {
  socketCount++;
  console.log(socketCount);
  socket.emit('news', { hello: 'world' });
  socket.on('pingserver', function (data) {
    console.log(data);
    io.sockets.emit('pingrecieved',{data: data});
  });
});