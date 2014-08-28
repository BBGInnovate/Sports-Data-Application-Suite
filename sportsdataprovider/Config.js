/* ****************************************************************************
 * File: 		Config.js
 * Purpose: 	I am a simple configuration object
 * Author: 		John Allen
 * Company: 	Fig Leaf Software
 *************************************************************************** */

/* *************************** Required Classes **************************** */

/* *************************** Constructor Code **************************** */

/* *************************** Public Methods ****************************** */

/**
 * I return all the applications configuration data.
 *
 * @return {Object}
 */
function getConfig(){

	var config = {
		'applicationMode' : 'dev',
		'FPTDirectory' : process.cwd() + '/FTP',
		//'JSONDirectory' : process.cwd() + '/JSON',
		'JSONDirectory' : '/Users/lbacker/Documents/nodeapps/sportsdataapplication/sportsdataviewer/data/json/soccer/worldcup2014',
		'squadFileName' : 'srml-4-2013-squads.xml',

		'competitionName' : 'World Cup',
		'competitionID' : '4',
		'season' : 'Season 2013/2014',
		'seasonName' : 'Season 2013/2014',
		'seasonID' : '2013',

		'aggregateDataDirectory' : process.cwd() + '/aggregate_data',
		'feedTypeStringID' : {
			'f1' : '-results',
			'f9' : '-matchresults',
			'f13': 'commentary-',
			'f30': 'seasonstats-',
			'f40': '-squads'
		},
		//'emailSendList' : 'jallen@figleaf.com,bwilliamson@bbg.gov,jallen@bbg.gov',
		'emailSendList' : 'jallen@bbg.gov',
		//'emailCCList' : 'stran@bbg.gov',
		'emailCCList' : '',
		'emailUserAccount' : 'bbg.football.dataprovider@gmail.com',
		'emailUserPassword' : '!football.voa!',
		'emailSMPT' : 'smtp.gmail.com',
		'twitterOAuth' : {
			'consumer_key' : 'F1RxHzCB7AYuwwzXAhUCxNQkk',
			'consumer_secret' : 'wKIwLrEntCqrGJtYxbKbuvBMlzJjA6rz5rnazGmPip8r2bXaeN',
			'access_token' : '2385596425-dRqims08qgef2Alp8Ug5ShLKxXnsf0IYjFrQ5l5',
			'access_token_secret' : 'JvlnzrHOItZzhWIoewe5KpJilyJODXq1TWWtjxr6YoMj8'
		},
		//'twitterCommentaryAccountArray' : ['testbbgsoccer', 'BagassyVOA','VOASonnySports','ntabo0'],
		'twitterCommentaryAccountArray' : ['testbbgsoccer'],
		'twitterHashTagFlag' : '#WC14',
		'faye' : {
			'channel' : {
				'commentary' : 'commentary',
				'default' : 'faye',
				'gamestats' : 'gamestats',
				'schedule' : 'schedule',
				'scoreboard' : 'scoreboard',
				'squad' : 'squad'
			},
			//'url' : 'http://54.83.5.149:8000/faye',
			'url' : 'http://127.0.0.1:8000/faye',
			'publishPassword' : '78654323MyVeryL0ngStr1ngTh4tIsC00l4ndYouC4ntT0uchThi5IfY0uTry9907654'
		}
	}

	return config;
}


/* ************************ Exported Public Methods ************************ */
exports.getConfig = getConfig;