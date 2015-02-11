/** 
 * @fileOverview 	I handle reading and writting the JSON data files.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			JSONFileService.js
 */

/* *************************** Required Classes **************************** */
var fs = require('fs');
var log = require('./Logger.js');
var Config = require('./Config');
var ErrorHandler = require('./ErrorHandler');

/* *************************** Constructor Code **************************** */
var config = Config.getConfig();

/* *************************** Public Methods ****************************** */

/** 
 * I write the JSON data file to the disk. The file name and location are based
 * on what type of file it is.
 * @param {Object} data - I am the JSON data to write to disk. I am required.
 * @param {String} type - I am the type of JSON; game, comment, squad ect..ect...
 * @return {Boolean}
 */
function writeJSONDataFile( data, type ){

	var fileName = '';
	var json = JSON.stringify( data );

	switch( type ){

		case 'game':
			fileName = 'game/game-' + data.IDGame + '.json';
			break;

		case 'commentary':

			try {
				// pick out the game id from one of the comments.
				var IDGame = data[0]['IDGame'];
				fileName = 'commentary/commentary-f' + IDGame + '.json';
			} catch (e) {
				//fileName = 'commentary/commentary-f' + 'error-out' + '.json';
			}
			
			break;

		case 'schedule':
			fileName = 'schedule.json';
			break;

		case 'squad':
			fileName = 'squad.json';
			break;

		case 'player':
			fileName = 'player.json';
			break;

		default:
	}

	if( json.length && fileName.length ){
		fs.writeFile(config.JSONDirectory + '/' + fileName, json, function(error) {
			if( error ) {
				ErrorHandler.handleError( 'JSON File Write Failed! File: ' + fileName, error );
			}
		});
	}

	return true;
}
exports.writeJSONDataFile = writeJSONDataFile;
/* *************************** Private Methods ***************************** */