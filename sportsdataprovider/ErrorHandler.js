/**
 * @fileOverview 	I am the application wide Error Handler.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			ErrorHandler.js
 */
 
/* *************************** Required Classes **************************** */

var email = require('./Email.js');
var log = require('./Logger.js');
var Config = require('./Config');

/* *************************** Constructor Code **************************** */

var config = Config.getConfig();

/* *************************** Public Methods ****************************** */

/**
 * I handle error's for the application.
 * @param {String} message - the error message to log
 * @param {Object} data - any data we want to log
 */
function handleError( message, data ){
	
	// return something... 
	var result = false;

	// log stuff to the console for dev development
	if (config.applicationMode != 'dev'){
		log.log(message);
		log.log(data);
	}
	
	var extraData = JSON.stringify(data);
	log.error(message, extraData);
	
	email.send( "ERROR! Football DataProvider Applicaiton: " + message, 
		"An ERROR Happend! Additional Information: " + extraData);

	result = true;

	return result;
}


/* ************************ Exported Public Methods ************************ */

exports.handleError = handleError;