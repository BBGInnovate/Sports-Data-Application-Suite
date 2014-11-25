/**
 * @fileOverview 	I hold some basic lookup data.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			Lookup.js
 */

/* *************************** Required Classes **************************** */

var fs = require('fs');
var Config = require('./Config');
var ErrorHandler = require('./ErrorHandler');
var log = require('./Logger.js');


/* *************************** Constructor Code **************************** */

var config = Config.getConfig();


/* *************************** Public Methods ****************************** */

/**
 * I return the team look up object.
 */
function getTeamLookup(){
	
	/*
	return  [
	    {
	        'country': 'Algeria',
	        'abbreviation': 'ALG',
	        'optaid' : 't1215'
	    },
	    {
	        'country': 'Argentina',
	        'abbreviation': 'ARG',
	        'optaid': 't632'
	    },
	    {
	        'country': 'Australia',
	        'abbreviation': 'AUS',
	        'optaid' : 't575'
	    },
	    {
	        'country': 'Belgium',
	        'abbreviation': 'BEL',
	        'optaid' : 't360'
	    },
	    {
	        'country': 'Bosnia and Herzegovina',
	        'abbreviation': 'BIH',
	        'optaid' : 't537'
	    },
	    {
	        'country': 'Brazil',
	        'abbreviation': 'BRA',
	        'optaid' : 't614'
	    },
	    {
	        'country': 'Cameroon',
	        'abbreviation': 'CMR',
	        'optaid' : 't494'

	    },
	    {
	        'country': 'Chile',
	        'abbreviation': 'CHI',
	        'optaid' : 't831'
	    },
	    {
	        'country': 'Colombia',
	        'abbreviation': 'COL',
	        'optaid' : 't832'

	    },
	    {
	        'country': 'Costa Rica',
	        'abbreviation': 'CRC',
	        'optaid' : 't838'

	    },
	    {
	        'country': 'Côte d’Ivoire',
	        'abbreviation': 'CIV',
	        'optaid' : 't1221'
	    },
	    {
	        'country': 'Croatia',
	        'abbreviation': 'CRO',
	        'optaid' : 't535'
	    },
	    {
	        'country': 'Ecuador',
	        'abbreviation': 'ECU',
	        'optaid' : 't830'
	    },
	    {
	        'country': 'England',
	        'abbreviation': 'ENG',
	        'optaid' : 't114'
	    },
	    {
	        'country': 'France',
	        'abbreviation': 'FRA',
	        'optaid' : 't368'
	    },
	    {
	        'country': 'Germany',
	        'abbreviation': 'GER',
	        'optaid' : 't357'
	    },
	    {
	        'country': 'Ghana',
	        'abbreviation': 'GHA',
	        'optaid' : 't1219'
	    },
	    {
	        'country': 'Greece',
	        'abbreviation': 'GRE',
	        'optaid' : 't517'
	    },
	    {
	        'country': 'Honduras',
	        'abbreviation': 'HON',
	        'optaid' : 't847'
	    },
	    {
	        'country': 'Iran',
	        'abbreviation': 'IRN',
	        'optaid' : 't1042'
	    },
	    {
	        'country': 'Italy',
	        'abbreviation': 'ITA',
	        'optaid' : 't119'
	    },
	    {
	        'country': 'Japan',
	        'abbreviation': 'JPN',
	        'optaid' : 't1266'
	    },
	    {
	        'country': 'Korea',
	        'abbreviation': 'KOR',
	        'optaid' : 't1041'
	    },
	    {
	        'country': 'Mexico',
	        'abbreviation': 'MEX',
	        'optaid' : 't659'
	    },
	    {
	        'country': 'Netherlands',
	        'abbreviation': 'NED',
	        'optaid' : 't366'
	    },
	    {
	        'country': 'Nigeria',
	        'abbreviation': 'NGA',
	        'optaid' : 't1216'
	    },
	    {
	        'country': 'Portugal',
	        'abbreviation': 'POR',
	        'optaid' : 't359'
	    },
	    {
	        'country': 'Russia',
	        'abbreviation': 'RUS',
	        'optaid' : 't536'
	    },
	    {
	        'country': 'Spain',
	        'abbreviation': 'ESP',
	        'optaid' : 't118'
	    },
	    {
	        'country': 'Switzerland',
	        'abbreviation': 'SUI',
	        'optaid' : 't497'
	    },
	    {
	        'country': 'USA',
	        'abbreviation': 'USA',
	        'optaid' : 't596'
	    },
	    {
	        'country': 'Uruguay',
	        'abbreviation': 'URU',
	        'optaid' : 't837'
	    }
	]
	*/
	var teamArray = [
		{
			team : 'Arsenal',
			teamShort : 'Arsenal',
			nickName : 'Gunners',
			abbreviation : 'ARS',
			stadium : 'Emirates Stadium',
			IDTeam : 't3'
		},
		{
			team : 'Aston Villa',
			teamShort : 'Aston Villa',
			nickName : 'Villans',
			abbreviation : 'AVL',
			stadium : 'Villa Park',
			IDTeam : 't7'
		},
		{
			team : 'Burnley',
			teamShort : 'Burnley',
			nickName : 'Clarets',
			abbreviation : 'BUR',
			stadium : 'Turf Moor',
			IDTeam : 't90'
		},
		{
			team : 'Chelsea',
			teamShort : 'Chelsea',
			nickName : 'Blues',
			abbreviation : 'CHE',
			stadium : 'Stamford Bridge',
			IDTeam : 't8'
		},
		{
			team : 'Crystal Palace',
			teamShort : 'Crystal Palace',
			nickName : 'Eagles',
			abbreviation : 'CRY',
			stadium : 'Selhurst Park',
			IDTeam : 't31'
		},
		{
			team : 'Everton',
			teamShort : 'Everton',
			nickName : 'Toffees',
			abbreviation : 'EVE',
			stadium : 'Goodison Park',
			IDTeam : 't11'
		},
		{
			team : 'Hull City',
			teamShort : 'Hull',
			nickName : 'Tigers',
			abbreviation : 'HUL',
			stadium : 'KC Stadium',
			IDTeam : 't88'
		},
		{
			team : 'Leicester City',
			teamShort : 'Leicester',
			nickName : 'Foxes',
			abbreviation : 'LEI',
			stadium : 'King Power Stadium',
			IDTeam : 't13'
		},
		{
			team : 'Liverpool',
			teamShort : 'Liverpool',
			nickName : 'Reds',
			abbreviation : 'LIV',
			stadium : 'Anfield',
			IDTeam : 't14'
		},
		{
			team : 'Manchester City',
			teamShort : 'Man City',
			nickName : 'Citizens',	
			abbreviation : 'MCI',
			stadium : 'Etihad Stadium',
			IDTeam : 't43'
		},
		{
			team : 'Manchester United',	
			teamShort : 'Man UTD',
			nickName : 'Red Devils',	
			abbreviation : 'MUN',
			stadium : 'Old Trafford',
			IDTeam : 't1'
		},
		{
			team : 'Newcastle United',	
			teamShort : 'Newcastle',
			nickName : 'Magpies',
			abbreviation : 'NEW',
			stadium : 'St. Jame\'s Park',
			IDTeam : 't4'
		},
		{
			team : 'Queens Park Rangers',	
			teamShort : 'QPR',
			nickName : 'Hoops',
			abbreviation : 'QPR',
			stadium : 'Loftus Road Stadium',
			IDTeam : 't52'
		},
		{
			team : 'Southampton',
			teamShort : 'Southampton',
			nickName : 'Saints',
			abbreviation : 'SOU',
			stadium : 'St. Mary\'s Stadium',
			IDTeam : 't20'
		},
		{
			team : 'Stoke City',
			teamShort : 'Stoke',
			nickName : 'Potters',
			abbreviation : 'STK',
			stadium : 'Britannia Stadium',
			IDTeam : 't110'
		},
		{
			team : 'Sunderland',
			teamShort : 'Sunderland',
			nickName : 'Black Cats',
			abbreviation : 'SUN',
			stadium : 'Stadium of Light',
			IDTeam : 't56'
		},
		{
			team : 'Swansea City',
			teamShort : 'Swansea',
			nickName : 'Swans',
			abbreviation : 'SWA',
			stadium : 'Liberty Stadium',
			IDTeam : 't80'
		},
		{
			team : 'Tottenham Hotspur',
			teamShort : 'Spurs',
			nickName : 'Spurs',
			abbreviation : 'TOT',
			stadium : 'White Hart Lane',
			IDTeam : 't6'
		},
		{
			team : 'West Bromwich Albion',
			teamShort : 'West Brom',
			nickName : 'Baggies',
			abbreviation : 'WBA',
			stadium : 'Hawthorns',
			IDTeam : 't35'
		},
		{
			team : 'West Ham United',
			teamShort : 'West Ham',
			nickName : 'Hammers',
			abbreviation : 'WHU',
			stadium : 'Boleyn Ground',
			IDTeam : 't21'
		}
	];

	return teamArray;
}


/**
 * I return a teams lookup object by its Opta Provided ID.
 * @param {String} IDTeam - I am the Opta team ID.
 */
function getTeamDataByID( IDTeam ) {
	
	var data = getTeamLookup();
	var result = {
		team : '',
		teamShort : '',
		nickName : '',
		abbreviation : '',
		stadium : '',
		IDTeam : ''
	};
	
	for (var i = data.length - 1; i >= 0; i--) {
		
		if ( data[i].IDTeam === IDTeam ){
			result = data[i];
		}
	};

	return result;
}


/**
 * I write the Team Look up JSON file.
 */
function writeTeamLookUpJSON() {
	
	var theJSON = getTeamLookup();
	var jsonString = JSON.stringify(theJSON);
	var fileName = 'teamlookup.json';
	
	fs.writeFile(config.JSONDirectory + '/' + fileName, jsonString, function(error) {
		if( error ) {
			ErrorHandler.handleError('Team Lookup JSON write failed. File:' + fileName, error);
		}
	});
}


/* ************************ Exported Public Methods ************************ */
exports.getTeamDataByID = getTeamDataByID;
exports.writeTeamLookUpJSON = writeTeamLookUpJSON;
exports.getTeamLookup = getTeamLookup;