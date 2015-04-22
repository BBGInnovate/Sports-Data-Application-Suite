/** 
 * @fileOverview 	I am the controller for the application. app.js asks me to
 *					perform tasks and I use the service layers to accomplish
 *					the task.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			Controller.js
 */

/* *************************** Required Classes **************************** */
var Transformer = require('./Transformer.js');
var FayeService = require('./FayeService.js');
var JSONFileService = require('./JSONFileService');
var log = require('./Logger.js');

/* *************************** Constructor Code **************************** */
/* *************************** Public Methods ****************************** */

/** 
 * I handle the Comment data. I get the properly formatted JSON file and broadcast 
 * the JSON data to the Faye server.
 * @param {Object} data I am the comment JSON data. I am required.
 * @return {Boolean}
 */
function handleComment( data ){

	Transformer.buildCommentFile( data );

	return true;
}
exports.handleComment = handleComment;


/** 
 * I handle the handle what happens AFTER the comments are built. I still
 * suck at async programming so this is why this method is here. Check out
 * the Transformer.buildCommentFile... it makes an async call to twitter
 * and then it calls another function.... bla bla bla... so this will be the
 * only example of this type of mess and why you see a reference to Controller
 * in the Transformer... :P
 * @param {Object} data I am the game JSON object. I am required.
 * @return {Boolean}
 */
function handleCommentPostParsing( data ){

	FayeService.broadcastToFaye( data, 'commentary' );
	JSONFileService.writeJSONDataFile( data, 'commentary' );

	return true;
}
exports.handleCommentPostParsing = handleCommentPostParsing;


/** 
 * I handle the game data. I get the properly formatted JSON file and broadcast 
 * the JSON data to the Faye server.
 * @param {Object} data I am the game JSON object. I am required.
 * @return {Boolean}
 */
function handleGame( data, writefile ){

	// for aggregation we don't want to write the file and update the
	// current game file..
	writefile = writefile || true;

	var gameObject = Transformer.buildGameFile( data );

	if( writefile ){
		FayeService.broadcastToFaye( gameObject, 'game' );
		JSONFileService.writeJSONDataFile( gameObject, 'game' );
		Transformer.updateCurrentGameFile( data );
	}

	return true;
}
exports.handleGame = handleGame;


/** 
 * I handle the schedule. I get the properly formatted JSON file and broadcast
 * the JSON data to the Faye server.
 * @param {Object} data I am the schedule JSON object. I am required.
 * @return {Boolean}
 */
function handleSchedule( data ){

	var scheduleObject = Transformer.buildSchedule( data );
	FayeService.broadcastToFaye( scheduleObject, 'schedule' );
	JSONFileService.writeJSONDataFile( scheduleObject, 'schedule' );

	return true;
}
exports.handleSchedule = handleSchedule;


/** 
 * I handle the Squad data. I get the properly formatted JSON file.
 * @return {Boolean}
 */
function handleSeasonStats(){

	Transformer.buildSeasonStats();
	return true;
}
exports.handleSeasonStats = handleSeasonStats;


/** 
 * I handle the Squad data. I get the properly formatted JSON file write it to
 * disk. I also handle the player.json file as well.
 * @param {Object} data I am the Squad JSON data. I am required.
 * @return {Boolean}
 */
function handleSquad ( data ){

	var squadAndPlayerData = Transformer.buildSquadFile( data );

	JSONFileService.writeJSONDataFile( squadAndPlayerData.squad, 'squad' );
	JSONFileService.writeJSONDataFile( squadAndPlayerData.player, 'player' );

	return true;
}
exports.handleSquad = handleSquad;
/* *************************** Private Methods ***************************** */
