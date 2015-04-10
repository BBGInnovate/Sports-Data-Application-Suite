/** 
 * @fileOverview 	I am the Faye Service. I handle all things that have to do
 *					with interacting with the Faye Server.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			FayeService.js
 */

/* *************************** Required Classes **************************** */
var faye = require('faye');
var Config = require('./Config');
var util = require('util');
var log = require('./Logger.js');

/* *************************** Constructor Code **************************** */
var config = Config.getConfig();

var fayClient = new faye.Client(config.faye.url);

// we need to send the password to the server so lets add an extension to do
// this.
fayClient.addExtension({
	outgoing: function( message, callback ) {

		message.ext = message.ext || {};
		message.ext.password = config.faye.publishPassword;

		callback( message );
	}
});

console.log(fayClient);



/* *************************** Public Methods ****************************** */
/**
 * I boradcast JSON to the Faye server. I return a boolean: true if I did false
 * if I did not.
 * @param {Object} fayeData - I am JSON to push.
 * @param {String} type - I am the type of feed to push
 * @return {boolean}
 */
function broadcastToFaye( fayeData, type ){

	// default these
	type = type || '';
	fayeData = fayeData || '';
	
	var fayeChannel = '';
	var dataToSendDownTheWire = JSON.stringify( fayeData );
	var result = false;

	// should we log stuff?
	var doLogging = false;
	if (config.applicationMode === 'dev'){
		doLogging = true;
	}
	//doLogging = false;

	// create the correct fayeChannel to push to based on the type that's passed
	// to us.
	switch( type ){

		case "game":
			fayeChannel = config.faye.channel.gamestats + '-' + fayeData.IDGame;
			break;

		case 'commentary':
			

			try{

				// pick out the game id from one of the comments.
				var ID = fayeData[0]['IDGame'];
				fayeChannel = config.faye.channel.commentary + '-f' + ID;

			} catch (e){

				log.dump(arguments);
				log.dump(e);
			}
			break;



		case 'schedule':
			fayeChannel = config.faye.channel.schedule;
			break;

		default:
			log.application( 'NO TYPE PASSED TO FayeService', fayeData );
	}

	// log what were about to push
	if ( doLogging ){
		util.log(fayeChannel + " before Faye Push IN NEW SERVICE");
	}

	// in app.js this is calculated, i know this break encapsulation but this is the
	// only var in the global scope were hitting.
	if ( global.allHistoryFilesProcessed ){
		if( fayeChannel.length ){

			fayClient.publish('/' + fayeChannel, {text: dataToSendDownTheWire} );

			if( doLogging ){
				util.log( fayeChannel + " was pushed." );	
			}
		}
	}
}
exports.broadcastToFaye = broadcastToFaye;

/* *************************** Private Methods ***************************** */