'use strict';

var fs = require('fs');
var assert = require('assert');
var util = require('util');
var utils = require('../Utils');
var dom = require('xmldom').DOMParser;
var transformer = require('../Transformer');
var errorHandler = require('../ErrorHandler');
var Controller = require('../Controller');

// set up some vars will use to test with

// these paths need to be relitive to the parent directory cause Mocha
// is using it from there.
var commentXMLPath = process.cwd() + '/test/testdata/commentary.xml';
var gameXMLPath = process.cwd() + '/test/testdata/game.xml';
var squadXMLPath = process.cwd() + '/test/testdata/squads.xml';
var scheduleXMLPath = process.cwd() + '/test/testdata/schedule.xml';

var commentJSONBad = [{}];
var commentJSONGood = getXMLAsJSON(commentXMLPath);
var gameJSONBad = {};
var gameJSONGood = getXMLAsJSON(gameXMLPath);
var scheduleJSONBad = {};
var scheduleJSONGood = getXMLAsJSON(scheduleXMLPath);
var squadJSONBad = {};
var squadJSONGood = getXMLAsJSON(squadXMLPath);


/**
 * Controller
 */
describe('Controller', function(){

	describe('#handleComment should PASS', function(){
		it('should return boolean true.', function(){
			assert(Controller.handleComment(commentJSONGood) );
		});
	});
	describe('#handleComment should FAIL', function(){
		it('I should thow an error.', function(){
			//assert.throws( false, Cat.sleep( 'john' ) );
			assert.throws( function() { Controller.handleComment(gameJSONBad); }, Error );
		});
	});

	describe('#handleGame should PASS', function(){
		it('should return boolean true.', function(){
			assert(Controller.handleGame(gameJSONGood) );
		});
	});
	describe('#handleGame should FAIL', function(){
		it('I should thow an error.', function(){
			//assert.throws( false, Cat.sleep( 'john' ) );
			assert.throws( function() { Controller.handleGame(gameJSONBad); }, Error );
			// rewrite the latest game file....
			transformer.updateCurrentGameFile(gameJSONGood);
		});
	});

	describe('#handleSchedule should PASS', function(){
		it('should return boolean true.', function(){
			assert(Controller.handleSchedule(scheduleJSONGood) );
		});
	});
	describe('#handleSchedule should FAIL', function(){
		it('I should thow an error.', function(){
			//assert.throws( false, Cat.sleep( 'john' ) );
			assert.throws( function() { Controller.handleSchedule(scheduleJSONBad); }, Error );
		});
	});

	describe('#handleSquad should PASS', function(){
		it('should return boolean true.', function(){
			assert(Controller.handleSquad( squadJSONGood ) );
		});
	});
	describe('#handleSquad should FAIL', function(){
		it('I should thow an error.', function(){
			assert.throws( function() { Controller.handleSquad( squadJSONBad ); }, Error );
		});
	});
});


/**
 * Transformer
 */
describe('Transformer', function(){

	// updateCurrentGameFile()
	describe('#updateCurrentGameFile should PASS', function(){
		it('should return boolean true', function(){
			assert.equal( true, transformer.updateCurrentGameFile(gameJSONGood) );
		});
	});
	describe('#updateCurrentGameFile should FAIL', function(){
		it('I return false if passed a non numeric number', function(){
			//assert.throws( false, Cat.sleep( 'john' ) );
			assert.throws( function() { transformer.updateCurrentGameFile(gameJSONBad); }, Error );
			transformer.updateCurrentGameFile(gameJSONGood);
		});
	});

	// doBuildCommentFile
	describe('#doBuildCommentFile should PASS', function(){
		it('should return boolean true', function(){
			assert(transformer.doBuildCommentFile(commentJSONGood, []) );
		});
	});
	describe('#updateCurrentGameFile should FAIL', function(){
		it('I should fail because I dont pass in a second argument of an array.', function(){
			//assert.throws( false, Cat.sleep( 'john' ) );
			assert.throws( function() { transformer.doBuildCommentFile(commentJSONGood); }, Error );
		});
	});
	describe('#updateCurrentGameFile should FAIL', function(){
		it('I should fail because I passed in an empty array fo comment data.', function(){
			//assert.throws( false, Cat.sleep( 'john' ) );
			assert.throws( function() { transformer.doBuildCommentFile(commentJSONBad, []); }, Error );
		});
	});

	//buildSquadFile
	var finalSquadData = transformer.buildSquadFile(squadJSONGood);

	describe('#buildSquadFile should PASS object test', function(){
		it('should be an object', function(){
			assert.equal(true,  typeof finalSquadData === 'object');
		});
	});
	describe('#buildSquadFile should PASS array test of squad key', function(){
		it('should return an array for the squad key', function(){
			assert.equal(true,  Array.isArray(finalSquadData.squad));
		});
	});
	describe('#buildSquadFile should PASS array test of player key', function(){
		it('should return an array for the player key', function(){
			assert.equal(true,  Array.isArray(finalSquadData.player));
		});
	});
	describe('#buildSquadFile should FAIL', function(){
		it('I should fail because I dont pass in a proper JSON data object to work with.', function(){
			//assert.throws( false, Cat.sleep( 'john' ) );
			assert.throws( function() { transformer.buildSquadFile(squadJSONBad); }, Error );
		});
	});

	// buildGameFile
	var finalGameJSON = transformer.buildGameFile(gameJSONGood);

	describe('#buildGameFile should PASS object test', function(){
		it('should be an object', function(){
			assert.equal(true,  typeof finalGameJSON === 'object');
		});
	});
	describe('#buildGameFile should PASS. "IDGame" should be a string.', function(){
		it('should be an string', function(){
			assert.equal(true,  typeof finalGameJSON.IDGame === 'string');
		});
	});
	describe('#buildGameFile should PASS. "type" should be a string.', function(){
		it('should be an string', function(){
			assert.equal(true,  typeof finalGameJSON.type === 'string');
		});
	});
	describe('#buildGameFile should PASS. "venue" should be a string.', function(){
		it('should be an string', function(){
			assert.equal(true,  typeof finalGameJSON.venue === 'string');
		});
	});
	describe('#buildGameFile should PASS. "matchOfficialFirstName" should be a string.', function(){
		it('should be an string', function(){
			assert.equal(true,  typeof finalGameJSON.matchOfficialFirstName === 'string');
		});
	});
	describe('#buildGameFile should PASS. "matchOfficialLastName" should be a string.', function(){
		it('should be an string', function(){
			assert.equal(true,  typeof finalGameJSON.matchOfficialLastName === 'string');
		});
	});
	describe('#buildGameFile should PASS. "firstHalfTime" should be a number.', function(){
		it('should be an number', function(){
			assert.equal(true,  typeof parseInt(finalGameJSON.firstHalfTime) === 'number');
		});
	});
	describe('#buildGameFile should PASS. "secondHalfTime" should be a number.', function(){
		it('should be an number', function(){
			assert.equal(true,  typeof parseInt(finalGameJSON.secondHalfTime) === 'number');
		});
	});
	describe('#buildGameFile should PASS. "matchTime" should be a number.', function(){
		it('should be an number', function(){
			assert.equal(true,  typeof parseInt(finalGameJSON.matchTime) === 'number');
		});
	});
	describe('#buildGameFile should PASS. "isGameLive" should be a Boolean.', function(){
		it('should be an boolean', function(){
			assert.equal(true,  typeof finalGameJSON.isGameLive === 'boolean');
		});
	});
	describe('#buildGameFile should PASS. "home" should be a key and valid object', function(){
		it('should be an object', function(){
			assert.equal(true,  typeof finalGameJSON.home === 'object');
		});
	});
	describe('#buildGameFile should PASS. "away" should be a key and valid object', function(){
		it('should be an object', function(){
			assert.equal(true,  typeof finalGameJSON.away === 'object');
		});
	});
	describe('#buildGameFile should PASS. "home.shootout" should be an array.', function(){
		it('should be an array', function(){
			assert.equal(true,  Array.isArray(finalGameJSON.home.shootout));
		});
	});
	describe('#buildGameFile should PASS. "away.shootout" should be an array.', function(){
		it('should be an array', function(){
			assert.equal(true,  Array.isArray(finalGameJSON.away.shootout));
		});
	});
	describe('#buildGameFile should PASS. "home.goal" should be an array.', function(){
		it('should be an array', function(){
			assert.equal(true,  Array.isArray(finalGameJSON.home.goal));
		});
	});
	describe('#buildGameFile should PASS. "away.goal" should be an array.', function(){
		it('should be an array', function(){
			assert.equal(true,  Array.isArray(finalGameJSON.away.goal));
		});
	});
	describe('#buildGameFile should PASS. "home.booking" should be an array.', function(){
		it('should be an array', function(){
			assert.equal(true,  Array.isArray(finalGameJSON.home.booking));
		});
	});
	describe('#buildGameFile should PASS. "away.booking" should be an array.', function(){
		it('should be an array', function(){
			assert.equal(true,  Array.isArray(finalGameJSON.away.booking));
		});
	});
	describe('#buildGameFile should PASS. "home.startingLineUp.starting" should be an array.', function(){
		it('should be an array', function(){
			assert.equal(true,  Array.isArray(finalGameJSON.home.startingLineUp.starting));
		});
	});
	describe('#buildGameFile should PASS. "away.startingLineUp.starting" should be an array.', function(){
		it('should be an array', function(){
			assert.equal(true,  Array.isArray(finalGameJSON.away.startingLineUp.starting));
		});
	});
	describe('#buildGameFile should PASS. "home.name" should be a string.', function(){
		it('should be an string', function(){
			assert.equal(true,  typeof finalGameJSON.home.name === 'string');
		});
	});
	describe('#buildGameFile should PASS. "away.name" should be a string.', function(){
		it('should be an string', function(){
			assert.equal(true,  typeof finalGameJSON.away.name === 'string');
		});
	});

	// buildSchedule
	var finalSchedulaJSON = transformer.buildSchedule( scheduleJSONGood );
	var matchObject = finalSchedulaJSON[0];
	var matchHomeObject = matchObject.homeTeam;
	var matchAwayObject = matchObject.awayTeam;

	describe('#buildSchedule should PASS. The result should be an array.', function(){
		it('should be an array', function(){
			assert.equal(true,  Array.isArray(finalSchedulaJSON));
		});
	});
	describe('#buildSchedule should FAIL', function(){
		it('I should fail because I was not passed an object to work with.', function(){
			//assert.throws( false, Cat.sleep( 'john' ) );
			assert.throws( function() { transformer.buildSchedule(); }, Error );
		});
	});
	describe('#buildSchedule should PASS. A single Match object should be an object.', function(){
		it('should be an object', function(){
			assert.equal( true,  typeof matchObject === 'object' );
		});
	});
	describe('#buildSchedule should PASS. A single Match objects "IDMatch" should be a string.', function(){
		it('should be an object', function(){
			assert.equal( true,  typeof matchObject.IDMatch === 'string' );
		});
	});
	describe('#buildSchedule should PASS. A single Match objects "venue" should be a string.', function(){
		it('should be an object', function(){
			assert.equal( true,  typeof matchObject.venue === 'string' );
		});
	});

	describe('#buildSchedule should PASS. A single Match objects "city" should be a string.', function(){
		it('should be an object', function(){
			assert.equal( true,  typeof matchObject.city === 'string' );
		});
	});
	describe('#buildSchedule should PASS. A Match objects away team should be an object.', function(){
		it('should be an object', function(){
			assert.equal( true,  typeof matchAwayObject === 'object' );
		});
	});
	describe('#buildSchedule should PASS. A Match objects home team should be an object.', function(){
		it('should be an object', function(){
			assert.equal( true,  typeof matchHomeObject === 'object' );
		});
	});

	describe('#buildSchedule should PASS. A Match objects away team "ID" should be an string.', function(){
		it('should be an string', function(){
			assert.equal( true,  typeof matchAwayObject.ID === 'string' );
		});
	});
	describe('#buildSchedule should PASS. A Match objects home team "ID" should be an string.', function(){
		it('should be an string', function(){
			assert.equal( true,  typeof matchHomeObject.ID === 'string' );
		});
	});

	describe('#buildSchedule should PASS. A Match objects away team "ID" length should be greater than 0.', function(){
		it('should be an string', function(){
			assert.equal( true,  matchAwayObject.ID.length > 0 );
		});
	});
	describe('#buildSchedule should PASS. A Match objects home team "ID" length should be greater than 0', function(){
		it('should be an string', function(){
			assert.equal( true,  matchHomeObject.ID.length > 0 );
		});
	});

	describe('#buildSchedule should PASS. A Match objects away team "name" should be an string.', function(){
		it('should be an string', function(){
			assert.equal( true,  typeof matchAwayObject.name === 'string' );
		});
	});
	describe('#buildSchedule should PASS. A Match objects home team "name" should be an string.', function(){
		it('should be an string', function(){
			assert.equal( true,  typeof matchHomeObject.name === 'string' );
		});
	});

	describe('#buildSchedule should PASS. A Match objects away team "name" length should be greater than 0.', function(){
		it('should be an string', function(){
			assert.equal( true,  matchAwayObject.name.length > 0 );
		});
	});
	describe('#buildSchedule should PASS. A Match objects home team "name" length should be greater than 0.', function(){
		it('should be an string', function(){
			assert.equal( true,  matchHomeObject.name.length > 0 );
		});
	});

});

// ErrorHandler
describe('ErrorHandler', function(){

	var testErrorData = {
		"this is a" : "test",
		"that happens": "during unit tests"
	}

	// updateCurrentGameFile()
	describe('#handleError should PASS', function(){
		it('should return boolean true', function(){
			assert.equal( true, errorHandler.handleError('unitTestEmail!', testErrorData) );
		});
	});
});

/**
 * I read an xml file and return it as a JSON object.
 * @param {Strint} path - I am the path to the XML file.
 * @return {Object}
 */
function getXMLAsJSON( path ){
	var data = fs.readFileSync( path );
	var xmlDoc = new dom().parseFromString( data.toString() );
	var json = utils.xmlToJson( xmlDoc );
	return json;
}