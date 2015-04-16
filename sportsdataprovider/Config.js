/**
 * @fileOverview 	I am a simple configuration object.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		0.0.1
 * @module 			Config.js
 */

/* *************************** Required Classes **************************** */
var path = require('path');
// this file has all the look up strings for checking if FTP files are for
// this specific instance of the software.
var engagementConfig = require('./EngagementConfig');

/* *************************** Constructor Code **************************** */
var rootPath = path.normalize(__dirname + '/..');

/* *************************** Public Methods ****************************** */
/**
 * I return all the applications configuration data.
 *
 * @return {Object}
 */
function getConfig(){

	var config = {
		'applicationMode' : engagementConfig.applicationMode,
		'FPTDirectory' : engagementConfig.FPTDirectory,
		'JSONDirectory' :  rootPath + '/sportsdataviewer/data/json',
		'squadFileName' : engagementConfig.squadFileName,
		'scheduleFileName' : engagementConfig.scheduleFileName,
		'rootPath' : rootPath,
		'db' : engagementConfig.db,

		'competitionName' : engagementConfig.competitionName,
		'competitionID' : engagementConfig.competitionID,
		'season' : engagementConfig.season,
		'seasonName' : engagementConfig.seasonName,
		'seasonID' : engagementConfig.seasonID,


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
			'url' : engagementConfig.fayClientURL,
			'publishPassword' : '78654323MyVeryL0ngStr1ngTh4tIsC00l4ndYouC4ntT0uchThi5IfY0uTry9907654'
		}
	}

	return config;
}


/* ************************ Exported Public Methods ************************ */
exports.getConfig = getConfig;