/* ****************************************************************************
 * File: 		Lookup.js
 * Purpose: 	I hold some basic lookup data.
 * Author: 		John Allen
 * Company: 	Fig Leaf Software
 *************************************************************************** */

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
}


/**
 * I return a teams lookup object by its Opta Provided ID.
 * @param {String} IDTeam - I am the Opta team ID.
 */
function getTeamDataByID( IDTeam ) {
	
	var data = getTeamLookup();
	var result = {
		'country' : '',
		'abbreviation' : '',
		'optaid' : ''
	};
	
	for (var i = data.length - 1; i >= 0; i--) {
		
		if ( data[i].optaid === IDTeam ){
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
			ErrorHandler.handleError('Team Lookup JSON write failed. File:' + fileName, err);
		}
	});
}


/* ************************ Exported Public Methods ************************ */
exports.getTeamDataByID = getTeamDataByID;
exports.writeTeamLookUpJSON = writeTeamLookUpJSON;
exports.getTeamLookup = getTeamLookup;