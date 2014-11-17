/** 
 * @fileOverview 	I am the Faye Messaging Server.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			server.js
 */

/* *************************** Required Classes **************************** */
var http = require('http');
var faye = require('faye');

/* *************************** Constructor Code **************************** */
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

var secret = '78654323MyVeryL0ngStr1ngTh4tIsC00l4ndYouC4ntT0uchThi5IfY0uTry9907654';

// Handle non-Bayeux requests
var server = http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello, non-Bayeux request');
});

bayeux.attach( server );
server.listen( 8000 );

bayeux.on('publish', function(clientId, channel, data) {
  
  console.log(arguments);
  console.log('something happened');

});


// I am an extension that checks if a publisher is sending a password and that
// the password is correct. If it's not I add the .error key to the message
// object which effectivly kills it.
bayeux.addExtension({
	incoming: function(message, callback) {

		console.log(message);


		if (!message.channel.match(/^\/meta\//)) {
			
			var password = message.ext && message.ext.password;
			
			if (password !== secret){				
				message.error = '403::Password required';
			}
	    }
	    callback(message);
	},

	outgoing: function(message, callback) {
  	
		// kill the password, dont want to send that out.
		if (message.ext) delete message.ext.password;
	    
	    callback(message);
	}
});
