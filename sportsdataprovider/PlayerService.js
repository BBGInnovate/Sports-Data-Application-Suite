/**
 * @fileOverview 	I provide data access and persistence functionality for
 *                  player data.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			PlayerService.js
 */

/* *************************** Required Classes **************************** */
var mongoose = require('mongoose');
var playerModel = require('./model/Player');

/* *************************** Constructor Code **************************** */
var player = mongoose.model('Player');

var updateCount = 0;
var newCount = 0;

/*
var theData = player.getFauxData();
function myCallback(player){
	console.log('in callback');
	//console.log(player);
	console.log(player.getTotalStats(player.individualGameStat));
}
getPlayerByOptaID(theData.info.id, myCallback);
*/

function deleteAllPlayers(){
	player.find().remove().exec();
}
exports.deleteAllPlayers = deleteAllPlayers;


/**
 * I list players by their opta ID.
 * @param id
 * @param callback
 */
function listPlayerByOptaID ( id, callback ) {

	callback = callback || function(){};

	player.find({'info.id': id}, function( error, list ){

		if (error){
			console.log(error);
		}

		console.log( list.length );

		callback( list );
	});
}
exports.listPlayerByOptaID = listPlayerByOptaID;



/**
 * I get a player by it's OPTA id and then execute the callback function. If no
 * player is found I return an empty player object
 * @param {String} - I am the players optaID
 * @param {Function} - I am the callback
 */
function getPlayerByOptaID( optaID, callback, passthroughArgs ){

	player.findOne({'info.id' : optaID}, function(error, foundPlayer){

		if( error ){
			return callback( error );
		}

		if( foundPlayer !== null ){

			return callback( foundPlayer, passthroughArgs );

		} else { // no player found so we create a new one and save it.

			var newPlayerData = {};
			newPlayerData.info = {};
			newPlayerData.info.id = optaID;

			var newPlayer = new player( newPlayerData );

			newPlayer.save(function( error, theNewPlayer ){

				return callback( theNewPlayer, passthroughArgs );

			});
		}
	});
}
exports.getPlayerByOptaID = getPlayerByOptaID;


/**
 * I update a soccer player.
 * @param {Object} - I am the data to update the soccer player with.
 */
function update ( data, callback ){

	callback = callback || function(){};

	player.findOneAndUpdate({'info.id': data.info.id}, data, function (error, foundPlayer) {

		if (error){
			console.log(error);
		}

		return callback( foundPlayer );

		//console.log(foundPlayer);
	});
}
exports.update = update;





/**
 * I update or save a new Player based on player.info.id.
 * @param {Object} I am the data to save or update
 */
function save( data ){

	player.findOne({'info.id': data.info.id}, function (error, foundPlayer) {

		console.log( data.info.id );

		if ( foundPlayer !== null ) {

			updateCount ++;
			console.log("UPDATEING " + updateCount);

			foundPlayer.update(data, function (error) {

				if (error) {
					console.log(error);
				}
			});

		} else { // no player found so we create a new one and save it.

			newCount++;
			console.log("NEW PLAYER INSERT " + newCount);

			var newPlayer = new player(
				data
			);

			newPlayer.save(function ( error, savedPlayer ) {

				if (error) {
					console.log(error);
				}

			});
		}
	});
}
exports.save = save;

