
exports.getUserDetails = function(username, password, callback){
	var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;    

  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    /*var userName = 'jkaria@saba.com';
    var password = 'welcome';*/
   
   // var collection = db.collection('test_insert');
    var users = db.collection('users');
    
      // Locate all the entries using find
    	users.find().toArray(function(err, results) {
        for(var i = 0;i < results.length;i++){
        	console.log('DAO:username:'+results[i].user.username);
        	console.log('DAO password:'+results[i].user.password);
        	if(username === results[i].user.username && password === results[i].user.password){
        		console.log('DAO:inside:');
    			
    			callback(true);
    		}
    		
    	};
    	
            	
        // Let's close the db
        db.close();
          
    });
  })
} 



exports.signUpUser = function(data){
	var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;    

  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    /*var userName = 'jkaria@saba.com';
    var password = 'welcome';*/
    
    var userName = data.username;
    var password = data.password;
    
    
   // var collection = db.collection('test_insert');
    var users = db.collection('users');
    users.insert({user: {
    	'username':userName,
    	'password' : password
    }},function(err, docs){});
   
      // Locate all the entries using find
    	users.find().toArray(function(err, results) {
        for(var i = 0;i < results.length;i++){
        	console.log(results[i].user.username);
        	console.log(results[i].user.password);
        }
        // Let's close the db
        db.close();
          
    });
  })
} 
