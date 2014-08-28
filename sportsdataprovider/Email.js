/* ****************************************************************************
 * File: 		Email.js
 * Purpose: 	I handle emailing for the application.
 * Author: 		John Allen
 * Company: 	Fig Leaf Software
 *************************************************************************** */

/* *************************** Required Classes **************************** */

//https://www.npmjs.org/package/emailjs
var Config = require('./Config.js');
var email = require('emailjs');
var log = require('./Logger.js');


/* *************************** Constructor Code **************************** */

var config = Config.getConfig();

// set up the server
var server = email.server.connect({
	user:     config.emailUserAccount, 
	password: config.emailUserPassword, 
	host:     config.emailSMPT, 
	ssl:     true
});


/* *************************** Public Methods ****************************** */

/**
 * I send emails.
 * @param {String} subject - I am the subject of the email.
 * @param {Object} data - I message body of the email.
 */
function send( subject, body ){

	server.send({
		text:    body, 
		from:    config.emailUserAccount, 
		to:      config.emailSendList,
		cc:      config.emailCCList,
		subject: subject
	}, function( err, message ) { 
			log.log(err || message); 
	});
}

/* ************************ Exported Public Methods ************************ */
exports.send = send;