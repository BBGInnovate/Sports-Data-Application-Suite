/** 
 * @fileOverview 	I am the Faye Messaging Server.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			server.js
 */

/* *************************** Required Classes **************************** */
//var http = require('http');
var https = require('https');
var faye = require('faye');

/* *************************** Constructor Code **************************** */
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

var secret = '78654323MyVeryL0ngStr1ngTh4tIsC00l4ndYouC4ntT0uchThi5IfY0uTry9907654';


var options = {
  key: fs.readFileSync('/etc/apache2/SSL/soccer-epl-home.voanews.com.key'),
  cert: fs.readFileSync('/etc/apache2/SSL/soccer-epl-home.voanews.com.crt'),
  ca: fs.readFileSync('/etc/apache2/SSL/gd_bundle-g2-g1.crt')
};

// Handle non-Bayeux requests
var server = https.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello, non-Bayeux request');
});

bayeux.attach( server );
server.listen( 443 );

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
