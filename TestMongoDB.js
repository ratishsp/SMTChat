 var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;  
   


  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    var userName = 'sandeep';
    var password = 'welcome';
    
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
