/** 
 * @fileOverview 	I am the API for interacting with soccer data and all things
 *					that have to do with soccer.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			SoccerService.js
 */

/* *************************** Required Classes **************************** */
var fs = require('fs');
var path = require('path');
var util = require('util');


/* *************************** Constructor Code **************************** */
// get the frameworks config.
var config = geddy.config;


/* *************************** Public Methods ****************************** */

/**
 * I return an array of games being played right now.
 */
function getCurrentGames(){
	var path = getJSONDirectory() + '/latestgame.json';

	var currentGameArray = readJSONFile( path );

	return currentGameArray;
}
exports.getCurrentGames = getCurrentGames;


/**
 * I return the game JSON data. If no IDGame is passed to me I will return the
 * latest OR current game.
 *
 * @param {string} IDGame - I am the ID of the game to return.
 * @return {object}
 */
function getGame( IDGame ){

	IDGame = IDGame || getLatestGameID();

	var result = {};
	result.stat = getGameJSON( IDGame );
	result.commentary = getCommentaryJSON( IDGame );

	return result;
}
exports.getGame = getGame;




/**
 * I return a players JSON data by ID.
 *
 * @param {string} IDPlayer - I am the ID of the player to get.
 * @return {object}
 */
function getPlayer( IDPlayer ){

	var result = {};

	var playerJSONPath = getJSONDirectory() + '/player/' + IDPlayer + '.json';
	var playerJSON = readJSONFile( playerJSONPath );

	result = playerJSON;

	var teamMetaPath = getJSONDirectory() + '/teamlookup.json';
	var teamMetaData = readJSONFile( teamMetaPath );

	for ( var i = teamMetaData.length - 1; i >= 0; i-- ) {
		
		if ( teamMetaData[i].optaid === playerJSON.info.teamID ){
			result.teamMetadata = teamMetaData[i];
		}
	};

	return result;
}
exports.getPlayer = getPlayer;


/**
 * I return the schedule JSON.
 *
 * @return {object}
 */
function getSchedule(){

	var schedulePath = getJSONDirectory() + '/schedule.json';
	var result = readJSONFile( schedulePath );

	return result;
}
exports.getSchedule = getSchedule;


/**
 * I return teams JSON data by ID.
 *
 * @param {string} IDTeam - I am the ID of the team to get.
 * @return {object}
 */
function getSquad( IDTeam ){

	var result = {};

	var teamJSONPath = getJSONDirectory() + '/squad.json';
	var teamLookupJSON = readJSONFile( teamJSONPath );

	for ( var i = teamLookupJSON.length - 1; i >= 0; i-- ) {
		
		if ( teamLookupJSON[i].id === IDTeam ){
			result.team = teamLookupJSON[i];
		}
	};

	// TODO: this stuff should be in the squad json... NOT seperate...
	var teamMetaPath = getJSONDirectory() + '/teamlookup.json';
	var teamMetaData = readJSONFile( teamMetaPath );

	for ( var i = teamMetaData.length - 1; i >= 0; i-- ) {
		
		if ( teamMetaData[i].IDTeam === IDTeam ){
			result.teamMetadata = teamMetaData[i];
		}
	};

	return result;
}
exports.getSquad = getSquad;

/**
 * I return teams JSON data by ID.
 *
 * @param {string} IDTeam - I am the ID of the team to get.
 * @return {object}
 */
function getSquadArray() {
	
	var result = {};
	
	var squadFilePath = getJSONDirectory() + '/squad-results-sorted.json';
	var teamLookupPath = getJSONDirectory() + '/teamlookup.json';

	result.squadJSON = readJSONFile( squadFilePath );
	result.lookupJSON = readJSONFile( teamLookupPath );

	return result;

}
exports.getSquadArray = getSquadArray;


/**
 * I return the lookup data JSON.
 *
 * @return {object}
 */
function getTeamLookUpJSON(){

	var teamLookupPath = getJSONDirectory() + '/teamlookup.json';
	return readJSONFile( teamLookupPath );

}
exports.getTeamLookUpJSON = getTeamLookUpJSON;



/**
 * I return the aggregated team data.
 *
 * @return {object}
 */
function getAggregagtedSquadJSON(){

	var squadLookUpPath = getJSONDirectory() + '/squad-results-sorted.json';
	return readJSONFile( squadLookUpPath );

}
exports.getAggregagtedSquadJSON = getAggregagtedSquadJSON;





/* *************************** Private Methods ***************************** */
/**
 * I read a a file written by the SDA application which should have the current/
 * latest game id as the 1st element in an array of game ID's.
 *
 * @return {string}
 */
function getLatestGameID(){
	
	var jsonPath = getJSONDirectory() + '/latestgame.json';
	var idJSON = readJSONFile( jsonPath );

	return idJSON[0]['id'];
}


/**
 * I read a games Stats JSON file and return it.
 *
 * @param {string} id - I am the games ID.
 * @return {object}
 */
function getGameJSON( id ){
	
	var jsonPath = getJSONDirectory() + '/game/' + 'game-' + id + '.json';
	var gameJSON = readJSONFile( jsonPath );

	return gameJSON;
}


/**
 * I read a games Commentary file and return it.
 *
 * @param {string} id - I am the games ID.
 * @return {object}
 */
function getCommentaryJSON( id ){
	
	try{
	var jsonPath = getJSONDirectory() + '/commentary/' + 'commentary-' + id + '.json';
	var commentaryJSON = readJSONFile( jsonPath );
	}catch(e){
		commentaryJSON = [];
	}

	return commentaryJSON;
}


/**
 * I read a JSON text file and return the data as a JSON object.
 *
 * @param {string} path - I am the full system path to the JSON file.
 * @return {object}
 */
function readJSONFile( path ){
	
	var binaryData = fs.readFileSync( path );
	
	return JSON.parse( binaryData.toString() );
}


/**
 * I return the configured JSON directory.
 *
 * @return {string}
 */
function getJSONDirectory(){
	return config.jsonDirectory;
}


/**
 * I dump data
 *
 * @return {void}
 */
function dump( data, depth ){

	data = data || {'nothing':'passed'};
	depth = depth || null;

	console.log(util.inspect(data, {colors: true, depth: depth }));
}