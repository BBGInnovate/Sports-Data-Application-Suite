/**
 * @fileOverview 	I model a Soccer Player.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		0.0.1
 * @module 			Player.js
 */
'use strict';

/* *************************** Constructor Code **************************** */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var defaultPlayerInfo = {
	goal : 0
}

/**
 * Player Schema
 */
var PlayerSchema = new Schema({
	individualGameStat: {
		type: Array
	},
	info: {
		id: {type : String, index: true},
		name: {type : String, default : ''},
		position: {type : String, default : ''},
		dob: Date,
		placeOfBirth: '',
		heightMetric: 0,
		heightEnglish: 0,
		weightMetric: 0,
		weightEnglish: 0,
		goal: 0,
		goalAllowed: 0,
		teamName: '',
		teamID: ''
	}
}, { collection: 'player', autoIndex: true });



/************************* METHODS *************************/
/**
 * I return an empty game object used for the individual game stats array.
 * @returns {Object} - i am the object definition returned.
 */
PlayerSchema.methods.getEmptyGame = function(){
	return {
		accurate_pass: 0,
		touches: 0,
		duel_lost: 0,
		duel_won: 0,
		fouls: 0,
		game_started: 0,
		goal_assist: 0,
		goals: 0,
		mins_played: 0,
		saves: 0,
		red_card: 0,
		shot_fastbreak: 0,
		total_scoring_att: 0,
		yellow_card: 0,
		opposingTeam: {
			team: '',
			teamShort: '',
			nickName: '',
			abbreviation: '',
			stadium: '',
			IDTeam: ''
		},
		IDGame: ''
	}
}

/**
 * I am a helper function that calculates the players total stats when passed
 * the players individual game stats array.
 * @param {Array} games
 */
PlayerSchema.methods.getTotalStats = function( ){

	var totalStat = {
		accurate_pass: 0,
		touches: 0,
		duel_lost: 0,
		duel_won: 0,
		fouls: 0,
		game_started: 0,
		goal_assist: 0,
		goals: 0,
		mins_played: 0,
		saves: 0,
		red_card: 0,
		shot_fastbreak: 0,
		total_scoring_att: 0,
		yellow_card: 0
	};

	// alias
	var games = this.individualGameStat;

	// loop over the passed array.
	for ( var i = games.length - 1; i >= 0; i-- ){

		// the game playes
		var theGame = games[i];

		// loop over each objects properties, if the same add them up.
		for ( var theStat in theGame ){

			for ( var calculatedStat in totalStat ){

				if (theStat === calculatedStat){

					totalStat[calculatedStat] = totalStat[calculatedStat] + theGame[theStat];
				}

			}
		}
	}

	return totalStat;
}


PlayerSchema.methods.getEmptyTotalStatsObject = function( ){

	return {
		accurate_pass: 0,
		touches: 0,
		duel_lost: 0,
		duel_won: 0,
		fouls: 0,
		game_started: 0,
		goal_assist: 0,
		goals: 0,
		mins_played: 0,
		saves: 0,
		red_card: 0,
		shot_fastbreak: 0,
		total_scoring_att: 0,
		yellow_card: 0
	};
}





/************************* STATICS *************************/
/**
 * I load a player by it's Mongodb ID.
 * @param {String} - I am the mongod db id.
 * @param {Function} - I am the callback function cb.
 */
PlayerSchema.statics.load = function( id, cb ) {
	this.findOne({
		_id: id
	}).exec(cb);
};


/**
 * I return data for testing
 * @returns {Object} - I am the test data object
 */
PlayerSchema.statics.getFauxData = function(){
	return {
		"individualGameStat": [
			{
				"accurate_pass": 61,
				"touches": 85,
				"duel_lost": 3,
				"duel_won": 4,
				"fouls": 0,
				"game_started": 1,
				"goal_assist": 0,
				"goals": 0,
				"mins_played": 90,
				"saves": 0,
				"red_card": 0,
				"shot_fastbreak": 0,
				"total_scoring_att": 1,
				"yellow_card": 0,
				"opposingTeam": {
					"team": "Leicester City",
					"teamShort": "Leicester",
					"nickName": "Foxes",
					"abbreviation": "LEI",
					"stadium": "King Power Stadium",
					"IDTeam": "t13"
				},
				"IDGame": "f755305"
			},
			{
				"accurate_pass": 58,
				"touches": 81,
				"duel_lost": 2,
				"duel_won": 3,
				"fouls": 1,
				"game_started": 1,
				"goal_assist": 0,
				"goals": 0,
				"mins_played": 90,
				"saves": 0,
				"red_card": 0,
				"shot_fastbreak": 0,
				"total_scoring_att": 0,
				"yellow_card": 0,
				"opposingTeam": {
					"team": "Arsenal",
					"teamShort": "Arsenal",
					"nickName": "Gunners",
					"abbreviation": "ARS",
					"stadium": "Emirates Stadium",
					"IDTeam": "t3"
				},
				"IDGame": "f755316"
			},
			{
				"accurate_pass": 63,
				"touches": 86,
				"duel_lost": 3,
				"duel_won": 6,
				"fouls": 0,
				"game_started": 1,
				"goal_assist": 0,
				"goals": 0,
				"mins_played": 90,
				"saves": 0,
				"red_card": 0,
				"shot_fastbreak": 0,
				"total_scoring_att": 0,
				"yellow_card": 0,
				"opposingTeam": {
					"team": "Chelsea",
					"teamShort": "Chelsea",
					"nickName": "Blues",
					"abbreviation": "CHE",
					"stadium": "Stamford Bridge",
					"IDTeam": "t8"
				},
				"IDGame": "f755325"
			},
			{
				"accurate_pass": 84,
				"touches": 98,
				"duel_lost": 1,
				"duel_won": 1,
				"fouls": 0,
				"game_started": 1,
				"goal_assist": 0,
				"goals": 0,
				"mins_played": 84,
				"saves": 0,
				"red_card": 0,
				"shot_fastbreak": 0,
				"total_scoring_att": 0,
				"yellow_card": 0,
				"opposingTeam": {
					"team": "Crystal Palace",
					"teamShort": "Crystal Palace",
					"nickName": "Eagles",
					"abbreviation": "CRY",
					"stadium": "Selhurst Park",
					"IDTeam": "t31"
				},
				"IDGame": "f755345"
			},
			{
				"accurate_pass": 40,
				"touches": 62,
				"duel_lost": 1,
				"duel_won": 7,
				"fouls": 0,
				"game_started": 1,
				"goal_assist": 0,
				"goals": 0,
				"mins_played": 90,
				"saves": 0,
				"red_card": 0,
				"shot_fastbreak": 0,
				"total_scoring_att": 0,
				"yellow_card": 0,
				"opposingTeam": {
					"team": "Sunderland",
					"teamShort": "Sunderland",
					"nickName": "Black Cats",
					"abbreviation": "SUN",
					"stadium": "Stadium of Light",
					"IDTeam": "t56"
				},
				"IDGame": "f755408"
			},
			{
				"accurate_pass": 29,
				"touches": 52,
				"duel_lost": 9,
				"duel_won": 3,
				"fouls": 0,
				"game_started": 1,
				"goal_assist": 0,
				"goals": 0,
				"mins_played": 90,
				"saves": 0,
				"red_card": 0,
				"shot_fastbreak": 0,
				"total_scoring_att": 0,
				"yellow_card": 0,
				"opposingTeam": {
					"team": "West Ham United",
					"teamShort": "West Ham",
					"nickName": "Hammers",
					"abbreviation": "WHU",
					"stadium": "Boleyn Ground",
					"IDTeam": "t21"
				},
				"IDGame": "f755417"
			},
			{
				"accurate_pass": 60,
				"touches": 89,
				"duel_lost": 2,
				"duel_won": 12,
				"fouls": 0,
				"game_started": 1,
				"goal_assist": 0,
				"goals": 0,
				"mins_played": 90,
				"saves": 0,
				"red_card": 0,
				"shot_fastbreak": 0,
				"total_scoring_att": 0,
				"yellow_card": 0,
				"opposingTeam": {
					"team": "Tottenham Hotspur",
					"teamShort": "Spurs",
					"nickName": "Spurs",
					"abbreviation": "TOT",
					"stadium": "White Hart Lane",
					"IDTeam": "t6"
				},
				"IDGame": "f755430"
			}
		],
		"info": {
			"id": "p6219",
			"name": "Sylvain Distin",
			"position": "Defender",
			"dob": "1977-12-16 00:00:00",
			"placeOfBirth": "",
			"heightMetric": 193,
			"heightEnglish": 633,
			"weightMetric": 87,
			"weightEnglish": 191,
			"goal": "",
			"goalAllowed": "",
			"teamName": "Everton",
			"teamID": "t11"
		},
		"totalStat": {
			"accurate_pass": 395,
			"touches": 553,
			"duel_lost": 21,
			"duel_won": 36,
			"fouls": 1,
			"game_started": 7,
			"goal_assist": 0,
			"goals": 0,
			"mins_played": 624,
			"saves": 0,
			"red_card": 0,
			"shot_fastbreak": 0,
			"total_scoring_att": 1,
			"yellow_card": 0
		}
	}
}

mongoose.model('Player', PlayerSchema);
