
var mongoDao = require('./dao.js');
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server),
  Guid;

Guid = require('guid');

server.listen(8000);


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/chatClient.html');
});
/*app.get('/socket.io/socket.io.js', function (req, res) {
  res.sendfile(__dirname + '/node_modules/socket.io/lib/socket.io.js');
});*/


var socketCount = 0,
    socketMap = {},
    socketsMap = {};
io.sockets.on('connection', function (socket) {
  var randDomguid ;//= Guid.raw();
  socket.on('loginUser',function(data){
      socketCount++;
      randDomguid =  data.username
    socketMap[randDomguid] = {
      guid: randDomguid,
      //sockete: socket,
      username: data.username,
      password: data.password
    };
      socketsMap[randDomguid] = {
    	      guid: randDomguid,
    	      socket: socket,
    	      username: data.username,
    	      password: data.password
    	    };
    socket.guid = randDomguid;
    // mongoDao.signUpUser(data);
   callBack= function(successResult){
	  if(successResult) {
		  console.log('Authentication successfull');
		  	 debugger;
		  	    console.log(socketCount);
		  	    socket.emit('news', { hello: 'world' });
		  	    socket.on('pingserver', function (data) {
		  	      console.log('pingserver:'+data);

		  	  // io.sockets.emit('pingrecieved',{data: data});
	
				var exec = require('child_process').exec;
				var child;
				var child2;
				var child2output;
				var count =0;
				

				child2 = exec('echo '+data.my+' | nc arya-Lenovo-G460 1987',
				   function (error, stdout, stderr) {
				      console.log('stdout enen: ' + stdout);
				      console.log('stderr: ' + stderr);
				      if (error !== null) {
					  console.log('exec error: ' + error);
				      }
				      child2output = stdout;	
//			  	      socketsMap[data.username].socket.emit('pingrecieved',{data: data});
					
				     child3 = exec('echo '+child2output.trim()+' | nc arya-Lenovo-G460 1986',
					function(error,stdout,stderr){
					console.log('translation of love '+stdout);
					console.log('stderr: '+stderr);
					if(error !== null){
						console.log('exec error during love translation '+error);
					}
					      data.my = stdout;	
				  	      socketsMap[data.username].socket.emit('pingrecieved',{data: data});
					});

				

				   });
				console.log(' child2output post sleep '+child2output);
		  	    });
		  	    socket.broadcast.emit('personOnline', {
		  	      data: socketMap[randDomguid].username
		  	    });
		  	    socket.emit('personsOnline', {
		  	      data: socketMap
		  	    });
	  }
	  else {
		  console.log('erroMessage:username or password is incorrect.');
	    	socket.emit('erroMessage', {
	  	      data: 'erroMessage:username or password is incorrect.'
		    });
	  }
   };
    authenticate(data.username, data.password,callBack);
   
  });
  //debugger;
  
  socket.on('disconnect', function(socket){
    debugger;
    delete socketMap[randDomguid];
  });

  socket.on('end', function(socket){
    debugger;
    delete socketMap[socket.guid];
  });

  socket.on('destroy', function(socket){
    debugger;
    delete socketMap[socket.guid];
  });

});

function authenticate(username, password, callback){
	console.log('username:'+username);
	console.log('password:'+password);
	var result = mongoDao.getUserDetails(username,password,function(result){
		callback(result);
	});
	
	
}

/*io.sockets.on('message', function (socket) {
  //debugger;
  socketCount++;
  var randDomguid = Guid.raw();
  socketMap[randDomguid] = {
    guid: randDomguid

  };
  socket.guid = randDomguid;
  debugger;
  console.log(socketCount);
  socket.emit('news', { hello: 'world' });
  socket.on('pingserver', function (data) {
    console.log(data);
    io.sockets.emit('pingrecieved',{data: data});
  });
  socket.broadcast.emit('personOnline', {
    data: socketMap[randDomguid].guid
  });
  socket.emit('personsOnline', {
    data: socketMap
  });

});*/
