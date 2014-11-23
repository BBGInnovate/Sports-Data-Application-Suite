/**
 * @fileOverview 	I take JSON objects aggrigate data and generate display  
 * 					friendly JSON files for the front end to use.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			Transformer.js
 */
 
/* *************************** Required Classes **************************** */
var fs = require('fs');
var util = require('util');
var Config = require('./Config');
var ErrorHandler = require('./ErrorHandler');
var Lookup = require('./Lookup.js');
var log = require('./Logger.js');
var utils = require('./Utils.js');
var Twit = require('twit');
var moment = require('moment');
var aggDataService = require('./AggregateDataService');
var Controller = require('./Controller');

// only fire aggregate data methods if told to do so passed in 
// e.g.: node app.js true false
var allowAggregateFileBuild = false;
if(process.argv[2] != undefined && process.argv[2] === 'true'){
	allowAggregateFileBuild = true;	
}

/* *************************** Constructor Code **************************** */
var config = Config.getConfig();
var twitter = new Twit({
    consumer_key: config.twitterOAuth.consumer_key, 
    consumer_secret: config.twitterOAuth.consumer_secret, 
    access_token: config.twitterOAuth.access_token, 
    access_token_secret: config.twitterOAuth.access_token_secret
})


/* *************************** Public Methods ****************************** */

/**
 * I update the current game.json file. If a game file XML says it's the latest
 * I write the game ID to the file so other applications can know what is the
 * current game or last game played. I return true if I passed.
 * @param {Object} data - I am the JSON data to make the current game file 
 * from.
 * @return {Boolean}
 */
function updateCurrentGameFile( data ){

	var isLive = false;

	if (data.SoccerFeed.SoccerDocument['@attributes'] 
		&&
		data.SoccerFeed.SoccerDocument['@attributes']['Type'] === 'Latest') {
		isLive = true;
	}

	if ( isLive ){

		try {

			var latestGameFilePath = config.JSONDirectory + '/latestgame.json';
			var binaryData = fs.readFileSync( latestGameFilePath );
			var latestGameJSON = JSON.parse( binaryData.toString() );

			var incomingID = data.SoccerFeed.SoccerDocument['@attributes']['uID'];

			// this is the latest ID, so over write the file with the new ID.
			if ( latestGameJSON[0]['id'] != incomingID ){
				latestGameJSON[0]['id'] = incomingID;
			}

			var jsonToWrite = JSON.stringify( latestGameJSON );

			// write the new file...
			fs.writeFile(latestGameFilePath, jsonToWrite, function(error) {
				
				if( error ) {
					console.log('LATEST GAME FILE File Write Failed!');
					ErrorHandler.handleError( 'LATEST GAME FILE File Write Failed!', error );
				}
			});

		} catch( e ){
			
			log.error("LATEST GAME FILE File Write Failed!", "bummer", jsonToWrite);

			var objectToWrite = [
				{'id' : incomingID}
			]

			var newJSON = JSON.stringify( objectToWrite );

			// write the new file...
			fs.writeFile(latestGameFilePath, newJSON, function(error) {
				
				if( error ) {
					console.log('LATEST GAME FILE File Write Failed!');
					ErrorHandler.handleError( 'LATEST GAME FILE File Write Failed!', error );
				}
			});

			log.application("LATEST GAME FILE File WRITTEN AFRE FAIL!", "Fixed it", newJSON);
		}
	}

	return true;
}



/**
 * I build comment JSON file. I am really just a method to gather the async
 * Twitter timelines and then fire off the real method doBuildCommentFile().
 * @param {Object} data - I am the JSON data to make the comment file from.
 * @return {void}
 */
function buildCommentFile ( data ) {

	// array of twitter user names
	var twitterUsers = config.twitterCommentaryAccountArray;

	// the array of returned tweets from twitter
	var twitterTimelines = [];

	// we do NOT want to hit twitter when building ALL the commentary files....
	// we only wnat to hit it when we're in 'live mode' after all the previous 
	// commentary have been written
	if  ( 
			( global.numberOfStartUpXMLFiles <= global.numberOfSartUpJobsCommited ) 
			&& 
			( global.numberOfStartUpXMLFiles > 0 )
			//&&
			//config.applicationMode != 'dev'
		){
		
		for (var i = twitterUsers.length - 1; i >= 0; i--) {
			// get the Twitter data
			twitter.get(
				'statuses/user_timeline/:screen_name', 
				{ screen_name: twitterUsers[i] },	
				function ( err, tweets, response ) {
					
					twitterTimelines.push( tweets );
			
					// if the len of the configed users is the same as 
					// the timelines array we have gotten all the tweets
					// so build the comment array
					if(twitterUsers.length === twitterTimelines.length){
						doBuildCommentFile(data, twitterTimelines);
					}
				}
			);
		};
	} else {
		doBuildCommentFile( data, twitterTimelines );
	};
}


/**
 * I do the actual building of the twitter data.
 * @param {Object} data - I am the JSON data to make the comment file from.
 * @param {Object} twitterData - I am the array of twitter timelines.
 * @return {void}
 */
function doBuildCommentFile( data, twitterData ){

	var commentArray = data.Commentary.message;
	var commentary = [];
	var timeFormat = 'YYYY-MM-DD HH:mm:ss';
	var startTime = moment(data.Commentary['@attributes'].game_date).format(timeFormat);
	var IDGame = data.Commentary['@attributes'].game_id;

	try{
		// handle when the XML has only one message. it shows up NOT as an array
		if( Object.prototype.toString.call( data.Commentary.message ) != '[object Array]' ) {
	    	
			var comment = getComment();

			comment.id = data.Commentary.message['@attributes']['id'];
			comment.IDGame = IDGame;
			comment.dateTime = moment(data.Commentary.message['@attributes']['last_modified']).format();
			comment.formatedDateTime = moment(comment.dateTime).format(timeFormat);
			comment.comment = data.Commentary.message['@attributes']['comment'];
			comment.period = 0;
			comment.minute = 0;
			comment.second = 0;
			comment.sortKey = comment.formatedDateTime;

			commentary.push( comment );

		} else { // there are an array of messages.

			// add the opta comments to the commentary
			for (var i = commentArray.length - 1; i >= 0; i--) {

				var comment = getComment();

				comment.id = commentArray[i]['@attributes']['id'];
				comment.IDGame = IDGame;
				comment.dateTime = moment(commentArray[i]['@attributes']['last_modified']).format();
				comment.formatedDateTime = moment(comment.dateTime).format(timeFormat);
				comment.comment = commentArray[i]['@attributes']['comment'];
				comment.sortKey = comment.formatedDateTime;

				// initial comments don't have period min or seconds so check
				
				if ( commentArray[i]['@attributes']['period'] === undefined ){
					comment.period = 1;
				} else {
					comment.period = parseInt(commentArray[i]['@attributes']['period']);
				}

				if ( commentArray[i]['@attributes']['minute'] === undefined ){
					comment.minute = 0;
				} else {
					comment.minute = parseInt( commentArray[i]['@attributes']['minute'] );
				}

				if ( commentArray[i]['@attributes']['second'] === undefined ){
					comment.second = 0;
				} else {
					comment.second = parseInt( commentArray[i]['@attributes']['second'] );
				}

				// handle the LAST "match ends" comment. no one want's the min to be
				// 0, which it is in the XML, so get it from the previous element in
				// the array.

				if (commentArray[i]['@attributes']['type'] === 'end 14'){
					
					try{
						comment.minute = parseInt(commentArray[i + 1]['@attributes']['minute']);
					
					} catch(e){
						// remove this try catch if everything is working properly.
					}
				}

				commentary.push( comment );
			};
		}
	} catch ( error ) {
		// fail silently, there were 0 comments
	}
	
	var now = '';
	var then = '';
	var minOfComment = 0;
	var secondOfComment = 0;

	// add the twitter timelines
	for (var i = twitterData.length - 1; i >= 0; i--) {
		
		var timeline = twitterData[i];

		if( timeline != undefined ){
		
			for (var x = timeline.length - 1; x >= 0; x--) {

				var tweetComment = getComment();
				tweetComment.IDGame = IDGame;
				
				var testString = timeline[i].text.toLowerCase();
				var hashTagTest = config.twitterHashTagFlag.toLowerCase();

				// is the configured hash tag in the tweet text???
				if( testString.indexOf( hashTagTest ) > -1 ){

					// set up some dates to work with
					var theTweetDate = moment(timeline[x].created_at);
					// subtract 4 hours, don't know exactly why but it's the only
					// way i get the XML date to be in the correct range.
					
					//this was used during world cup cause england is 4 hours behind brazil...
					//var setUpDate = moment(startTime).add( 'hours', -4 );

					var setUpDate = moment(startTime);
					
					var theGameStartDate = moment(setUpDate);
					// we will assume that a game, including extra time and penality
					// kicks wont last longer than 200 min...
					var theGameEndDate = moment(theGameStartDate).add( 'hours', 2 );

					// test the date of the tweet
					var afterStartTest = theTweetDate.isAfter(theGameStartDate);
					var beforeEndTest = theTweetDate.isBefore(moment(theGameStartDate).add( 'hours', 2 ));

					//afterStartTest = true;
					//beforeEndTest = true;

					if( testString.indexOf( 'stingtotesthardtorepeat' ) > -1 ){

						var logObject = {
							'tweetDate' : theTweetDate._d,
							'theGameStartDate' : theGameStartDate._d,
							'theGameEndDate' : theGameEndDate._d
						}
						log.dump(logObject);
					}

					/*
					if(afterStartTest && beforeEndTest){
						log.log('yeaaaaa')
					}else{
						log.log('noooooo')
					}
					*/

					// if the tweet is after the game start and before the game end
					// create it and push it onto the stack of tweets
					if(afterStartTest && beforeEndTest){

						tweetComment.dateTime = moment(timeline[x].created_at).format();
						tweetComment.formatedDateTime = moment(tweetComment.dateTime).format(timeFormat);
						tweetComment.comment = processTweetLinks(timeline[x].text);
						tweetComment.sortKey = tweetComment.formatedDateTime;

						// calculate the difference in time form the start of the game
						now  = tweetComment.formatedDateTime;
						then = startTime;
						minOfComment = moment.utc(moment(now,timeFormat).diff(moment(then,timeFormat))).format('mm');
						secondOfComment = moment.utc(moment(now,timeFormat).diff(moment(then,timeFormat))).format('ss');
						
						if ( minOfComment <= 47 ){
							tweetComment.period = 1;
						} else {
							tweetComment.period = 2;	
						}
						
						tweetComment.minute = minOfComment;
						tweetComment.second = secondOfComment;

						tweetComment.twitterImage = timeline[x].user.profile_image_url;
						tweetComment.twitterHandle = timeline[x].user.screen_name;
						tweetComment.twitterURL = 'http://twitter.com/' + tweetComment.twitterHandle;

						// do we have any media?
						if( timeline[x].entities.hasOwnProperty('media') ){

							// grab the meida array
							var mediaArray = timeline[x].entities.media;

							for (var y = mediaArray.length - 1; y >= 0; y--) {
								
								// is the meida a photo?
								if ( 
									( mediaArray[y].hasOwnProperty('type') ) 
									&& 
									( mediaArray[y].type === 'photo') 
									){
									
									tweetComment.twitterMediaURL = mediaArray[y].media_url;
						
									// for the commentary feed were only going to use
									// the first image. Also, I've never seen multi images
									// on tweets.
									break;
								}
							}
						}
						commentary.push(tweetComment);
					}// end test of isbefore and is after
				}// end conditional if the configured hash tag is in there
			}
		}
	}
	
	commentary = sortCommentary( commentary );

	// reverse so it reads top to bottom on the front end
	commentary.reverse();

	// tell the controller that we have finished doing commentary building
	Controller.handleCommentPostParsing(commentary);

	return true;
	
	/***************** helper functions *****************/
	/**
	 * I add link, tweet links, and search links to the Tweet
	 *
	 * @param {string} text - I am the string to transform
	 * @return {string}
	 */
	function processTweetLinks( text ) {
	    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
	    text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
	    exp = /(^|\s)#(\w+)/g;
	    text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
	    exp = /(^|\s)@(\w+)/g;
	    text = text.replace(exp, "$1<a href='http://www.twitter.com/$2' target='_blank'>@$2</a>");
	    return text;
	}

	/**
	 * I return an empty comment object
	 *
	 * @return {object}
	 */
	function getComment(){
		
		var comment = {
			'IDComment' : '',
			'dateTime' : '',
			'formatedDateTime' : '',
			'comment' : '',
			'period' : 0,
			'minute' : 0,
			'second' : 0,
			'sortKey' : 0,
			'twitterImage' : '',
			'twitterHandle' : '',
			'twitterURL' : '',
			'twitterMediaURL' : '',
			'language' : ''
		}

		return comment;
	}

	/**
	 * I sort the commentary by min, sec, and period
	 *
	 * @param {array} commentary - I am the array of objects to sort
	 * @return {array}
	 */
	function sortCommentary ( commentary ) {
		
		//TODO: this should be made more generic and put in the Utils class
		/* multi key sort from: 
		stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
		*/
		var sort_by;

		(function() {
		    // utility functions
		    var default_cmp = function(a, b) {
		            if (a == b) return 0;
		            return a < b ? -1 : 1;
		        },
		        getCmpFunc = function(primer, reverse) {
		            var dfc = default_cmp, // closer in scope
		                cmp = default_cmp;
		            if (primer) {
		                cmp = function(a, b) {
		                    return dfc(primer(a), primer(b));
		                };
		            }
		            if (reverse) {
		                return function(a, b) {
		                    return -1 * cmp(a, b);
		                };
		            }
		            return cmp;
		        };

		    // actual implementation
		    sort_by = function() {
		        var fields = [],
		            n_fields = arguments.length,
		            field, name, reverse, cmp;

		        // preprocess sorting options
		        for (var i = 0; i < n_fields; i++) {
		            field = arguments[i];
		            if (typeof field === 'string') {
		                name = field;
		                cmp = default_cmp;
		            }
		            else {
		                name = field.name;
		                cmp = getCmpFunc(field.primer, field.reverse);
		            }
		            fields.push({
		                name: name,
		                cmp: cmp
		            });
		        }

		        // final comparison function
		        return function(A, B) {
		            var a, b, name, result;
		            for (var i = 0; i < n_fields; i++) {
		                result = 0;
		                field = fields[i];
		                name = field.name;

		                result = field.cmp(A[name], B[name]);
		                if (result !== 0) break;
		            }
		            return result;
		        }
		    }
		}());

		
		// TODO: this should be passed in as arguments!
		//return commentary.sort( sort_by( 'sortKey' ) );
		return commentary.sort( sort_by( 'period', 'minute', 'second' ) );
		//return schedule.sort( sort_by( 'group', 'date' ) );
	}
}



/**
 * I build the Squad AND Player JSON files.
 *
 * @param {Object} data - I am the JSON data to make the comment file from.
 * @return {void}
 */
function buildSquadFile ( data ) {

	var timeFormat = 'YYYY-MM-DD HH:mm:ss';
	var teamArray = data.SoccerFeed.SoccerDocument.Team;




	// the array of squads
	var resultArray = [];
	
	// we'll also make a JSON files of just players so looking
	// them up for the front end will be easy
	var playerArray = [];

	for ( var i = teamArray.length - 1; i >= 0; i-- ) {

		// only add the ones that have a defined country, these
		if (teamArray[i]['@attributes'].country != undefined){

			var team = getTeamObjectDefinition();

			team.country = teamArray[i]['@attributes'].country;
			team.countryISO = teamArray[i]['@attributes'].country_iso;
			team.regionName = teamArray[i]['@attributes'].region_name;
			team.id = teamArray[i]['@attributes'].uID;
			team.name = teamArray[i].Name['#text'];
			
			// need to check these semi finalists and beyond are NOT yet defined
			if(teamArray[i].hasOwnProperty( 'Nickname' )){
				team.nickName = teamArray[i].Nickname['#text'];
			}
			if(teamArray[i].hasOwnProperty( 'FifaRank' )){
				team.fifaRank = teamArray[i].FifaRank['#text'];
			}

			if(teamArray[i].hasOwnProperty( 'TeamOfficial' )){

				try{
					
					var official = teamArray[i].TeamOfficial;

					if( Object.prototype.toString.call( official ) === '[object Array]' ) {
					    
					    official = teamArray[i].TeamOfficial[0];
					}
					team.manager.name = official.PersonName.First['#text'] + ' ' + official.PersonName.Last['#text'];
					team.manager.country = official['@attributes'].country;
					team.manager.dob = moment(official.PersonName.BirthDate['#text']).format(timeFormat);
					team.manager.joinDate = moment(official.PersonName.join_date['#text']).format(timeFormat);
				}catch(e){
					ErrorHandler.handleError(e);
					
				}
			}

			// loop over the player array of each team and add them to the squad
			for ( var x = teamArray[i].Player.length - 1; x >= 0; x-- ){
				var player = getTeamPlayer( teamArray[i].Player[x] );

				// add the team name and team ID for the player array.
				player.teamName = team.name;
				player.teamID = team.id;
				
				// add them to the squad
				team.player.push( player );

				// also add them to the player array
				playerArray.push( player );
			};

			resultArray.push(team);	
		};
	};

	// sort the squad object by team name
	resultArray = sortSquad( resultArray );

	var resultObject = {
		'squad' : resultArray,
		'player' : playerArray
	}

	return resultObject;
	
	// **************** Helper functions for squad parsing ***************** //
	
	/**
	 * I do the parsing of the squad file to produce a player object
	 *
	 * @param {object} player - I am the player object from source XML
	 * @return {object}
	 */
	function getTeamPlayer( player ){

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';
		
		// use a default object so all the properties are there
		var result = getPlayerObjectDefinition();

		result.id = player['@attributes'].uID;
		result.name = player.Name['#text'];
		result.position = player.Position['#text'];

		// the stats for a player are pretty stupidly designed, and array
		// of data with the attr saying what the property is.
		for (var i = player.Stat.length - 1; i >= 0; i--) {
			// dob
			if(player.Stat[i]['@attributes'].Type === 'birth_date'){
				result.dob = moment(player.Stat[i]['#text']).format(timeFormat);
			}
			// birth place
			if(player.Stat[i]['@attributes'].Type === 'birth_place'){
				result.placeOfBirth = player.Stat[i]['#text'];
			}
			// height
			if(player.Stat[i]['@attributes'].Type === 'height'){
				result.heightMetric = parseInt(player.Stat[i]['#text']);
				result.heightEnglish = parseInt(convertToFeet(player.Stat[i]['#text']));
			}
			// weight
			if(player.Stat[i]['@attributes'].Type === 'weight'){
				result.weightMetric = parseInt(player.Stat[i]['#text']);
				result.weightEnglish = parseInt(kToLbs(player.Stat[i]['#text']).pounds);
			}
			// goals
			if(player.Stat[i]['@attributes'].Type === 'goals'){
				result.goal = parseInt(player.Stat[i]['#text']);
			}
		};

		// I turn kilos into pounds
		function kToLbs( pK ) {
		    var nearExact = pK/0.45359237;
		    var lbs = Math.floor(nearExact);
		    var oz = (nearExact - lbs) * 16;
		    return {
		        pounds: lbs,
		        ounces: oz
		    };
		}

		// i convert metters to feet
		function convertToFeet( m ) {
			return Math.round(m / .3048 * 100) * .01;
		}
		return result
	}

	
	/**
	 * I return the default definition of a player
	 *
	 * @return {object}
	 */
	function getPlayerObjectDefinition (){
		var player = {
			'id' : '',
			'name' : '',
			'position' : '',
			'dob' : '',
			'placeOfBirth' : '',
			'heightMetric' : '',
			'heightEnglish' : '',
			'weightMetric' : '',
			'weightEnglish' : '',
			'goal' : '',
			'goalAllowed' : '',
			'teamName' : '',
			'teamID' : ''
		}
		return player;
	}

	/**
	 * I return the default definition of a team
	 *
	 * @return {object}
	 */
	function getTeamObjectDefinition (){
		var team = {
			'country' : '',
			'countryISO' : '',
			'regionName' : '',
			'id' : '',
			'name' : '',
			'nickName' : '',
			'fifaRank' : '',
			'manager' : {
				'name' : '',
				'country' : '',
				'dob' : '',
				'joinDate' : ''
			},
			'player' : []
		}
		return team;
	}

	/**
	 * I sort the squad object by team name
	 *
	 * @param {array} squads - I am the array of objects to sort
	 * @return {array}
	 */
	function sortSquad ( squad ) {
		
		//TODO: this should be made more generic and put in the Utils class
		/* multi key sort from: 
		stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
		*/
		var sort_by;

		(function() {
		    // utility functions
		    var default_cmp = function( a, b ) {
		            if (a == b) return 0;
		            return a < b ? -1 : 1;
		        },
		        getCmpFunc = function( primer, reverse ) {
		            var dfc = default_cmp, // closer in scope
		                cmp = default_cmp;
		            if (primer) {
		                cmp = function(a, b) {
		                    return dfc(primer(a), primer(b));
		                };
		            }
		            if (reverse) {
		                return function(a, b) {
		                    return -1 * cmp(a, b);
		                };
		            }
		            return cmp;
		        };

		    // actual implementation
		    sort_by = function() {
		        var fields = [],
		            n_fields = arguments.length,
		            field, name, reverse, cmp;

		        // preprocess sorting options
		        for (var i = 0; i < n_fields; i++) {
		            field = arguments[i];
		            if (typeof field === 'string') {
		                name = field;
		                cmp = default_cmp;
		            }
		            else {
		                name = field.name;
		                cmp = getCmpFunc(field.primer, field.reverse);
		            }
		            fields.push({
		                name: name,
		                cmp: cmp
		            });
		        }

		        // final comparison function
		        return function(A, B) {
		            var a, b, name, result;
		            for (var i = 0; i < n_fields; i++) {
		                result = 0;
		                field = fields[i];
		                name = field.name;

		                result = field.cmp(A[name], B[name]);
		                if (result !== 0) break;
		            }
		            return result;
		        }
		    }
		}());

		// TODO: this should be passed in as arguments!
		return squad.sort( sort_by( 'name' ) );
	}
}



/**
 * I build a games JSON file.
 *
 * @param {Object} data - I am the JSON data to make the game file.
 * @return {void}
 */
function buildGameFile( data ){

	// search the doc and get the nodes we want
	var soccerDocument = utils.objectSearch('SoccerFeed.SoccerDocument',data);
	var competitionData = utils.objectSearch('SoccerFeed.SoccerDocument.Competition',data);
	var matchData = utils.objectSearch('SoccerFeed.SoccerDocument.MatchData',data);
	var venuData = utils.objectSearch('SoccerFeed.SoccerDocument.Venue',data);
	var teamMetaData = utils.objectSearch('SoccerFeed.SoccerDocument.Team',data);

	// alias out the needed info, make it easer to work with.
	var matchMetaData = matchData.MatchInfo;
	var teamData = matchData.TeamData;

	//figure out who is home and who is away
	for (var i = teamData.length - 1; i >= 0; i--) {

		if ( teamData[i]['@attributes'].Side === "Home" ){
			var hTeam = teamData[i];
		}

		if ( teamData[i]['@attributes'].Side === "Away" ){
			var vTeam = teamData[i];
		}
	};

	// figure out whos team meta data is home and away
	for ( var i = teamMetaData.length - 1; i >= 0; i-- ) {

		if ( teamMetaData[i]['@attributes'].uID === hTeam['@attributes']['TeamRef'] ){
			var hTeamMetaData = teamMetaData[i];
		}

		if ( teamMetaData[i]['@attributes'].uID === vTeam['@attributes']['TeamRef'] ){
			var vTeamMetaData = teamMetaData[i];
		}
	};

	var hPlayerArray = hTeam.PlayerLineUp.MatchPlayer;
	var vPlayerArray = vTeam.PlayerLineUp.MatchPlayer;

	// were wrapping try/catch around these because aborted games will NOT
	// have these properties in the XML.
	// get the match,first half and second half times

	var matchTime = 0;
	var firstHalfTime = 0;
	var secondHalfTime = 0;
	try{
		for (var property in matchData.Stat){
			if (matchData.Stat[property]['@attributes'].Type === 'match_time'){
				matchTime = matchData.Stat[property]['#text'];
			}

			if (matchData.Stat[property]['@attributes'].Type === 'first_half_time'){
				firstHalfTime = matchData.Stat[property]['#text'];
			}

			if (matchData.Stat[property]['@attributes'].Type === 'second_half_time'){
				secondHalfTime = matchData.Stat[property]['#text'];
			}
		}
	} catch( error ){/* fail silently, aborted game */}

	// ok so the above is failing until the second half so try to set the matchTime
	// again
	try{

		for (var property in matchData.Stat){
			if (matchData.Stat['@attributes']['Type'] === 'match_time'){
				matchTime = parseInt(matchData.Stat['#text']);
			}
		}
	} catch (e) {
		// fail silently, pre match or aborted game
	}

	// get the Pool the game was in
	var pool = '';
	try{
		// get the Pool data, sometimes its not there
		if (typeof competitionData.Round.Pool !== 'undefined'){
			var pool = competitionData.Round.Pool['#text'];
		}
	} catch (error){/*fail silently, aborted game*/}

	// attendence
	var attendence = 0;
	try {
		attendence = matchMetaData.Attendance['#text'];
	} catch ( error ){/*fail silently, aborted game*/}

	// round
	var round = 0;
	try {
		round = competitionData.Round.RoundNumber['#text'];
	} catch ( error ){ /*fail silently, aborted game or playoff */ }

	// Is this a live game?
	// we need to make a proper date to check, the XML date is kinda wak.
	var checkDate = utils.formatOptaDate( matchData.MatchInfo.Date['#text'] );
	var isLiveGame = isGameLive(checkDate, data);

	var result = {
		"isGameLive" : isLiveGame,
		"IDGame" : soccerDocument['@attributes']['uID'],
		"type" : soccerDocument['@attributes']['Type'],
		"time" : matchMetaData.Date['#text'],
		"attendence": attendence,
		"venue" : venuData.Name['#text'],
		"pool" : pool,
		"round" : round,
		"firstHalfTime" : firstHalfTime,
		"secondHalfTime" : secondHalfTime,
		"matchTime" : matchTime,
		"matchOfficialFirstName" : matchData.MatchOfficial.OfficialName.First['#text'],
		"matchOfficialLastName" : matchData.MatchOfficial.OfficialName.Last['#text'],

		"home" : {
			"IDTeam" : hTeam['@attributes']['TeamRef'], 
			"abbreviation" : Lookup.getTeamDataByID( hTeam['@attributes']['TeamRef'] )['abbreviation'],
			"score" : hTeam['@attributes']['Score'],
			"name" : hTeamMetaData.Name['#text'],
			"total" : getTeamTotals(hPlayerArray),
			"goal" : getTeamGoal(hTeam.Goal, hTeamMetaData, vTeamMetaData),
			"booking" : getTeamBooking(hTeam.Booking, hTeamMetaData),
			"substitution" : getTeamSubstitution( hTeam.Substitution, hTeamMetaData ),
			"startingLineUp" : getLineUp( hPlayerArray, hTeamMetaData ),
			"shootout" : getShootOut( hTeam, hTeamMetaData ).shootOutArray,
			"shootoutGoals" : getShootOut( hTeam, hTeamMetaData ).scored
		},

		"away" : {
			"IDTeam" : vTeam['@attributes']['TeamRef'], 
			"abbreviation" : Lookup.getTeamDataByID( vTeam['@attributes']['TeamRef'] )['abbreviation'],
			"score" : vTeam['@attributes']['Score'],
			"name" : vTeamMetaData.Name['#text'],
			"total" : getTeamTotals(vPlayerArray),
			"goal" : getTeamGoal(vTeam.Goal, vTeamMetaData, hTeamMetaData),
			"booking" : getTeamBooking(vTeam.Booking, vTeamMetaData),
			"substitution" : getTeamSubstitution(vTeam.Substitution, vTeamMetaData),
			"startingLineUp" : getLineUp( vPlayerArray, vTeamMetaData ),
			"shootout" : getShootOut( vTeam, vTeamMetaData ).shootOutArray,
			"shootoutGoals" : getShootOut( vTeam, vTeamMetaData ).scored
		}
	}

	if( allowAggregateFileBuild ){
		aggDataService.buildPlayerData( data );
		aggDataService.buildTeamData( data, result ); 
		aggDataService.buildRefData( data, result );
		aggDataService.buildGoalieData( data, result );
	}

	return result;

	/************** BUILD THE AGGREGATE DATA FILES ***************/
	// were only going to do this when told to by arguments passed in process.argv
	// from the command line
	//if( allowAggregateFileBuild ){
	/*
	if (global.numberOfStartUpXMLFiles < global.numberOfSartUpJobsCommited){
		
		if ( !isLiveGame ){
			
			console.log("GONNA DO THE AGG!");

			setTimeout(function() { 

				aggDataService.buildPlayerData( data );

			},100);

			setTimeout(function() { 

				aggDataService.buildTeamData( data, result ); 

			},100);

			setTimeout(function() { 

				aggDataService.buildRefData( data, result );

			},100);

			setTimeout(function() { 

				aggDataService.buildGoalieData( data, result );

			},100);

			
		}
	}
	*/
	

	/***************** helper functions *****************/

	/**
	 * I return an array of Penalty Shoot out data
	 *
	 * @param {array} team - team match data array
	 * @param {array} teamMetaData - meta data of the team, the players
	 * @return {array}
	 */
	function getShootOut( team, teamMetaData ){

		var shootOutArray = [];
		var scored = 0;
		var saved = 0;
		var result = {};
		
		// was there a shoot out?
		if (team.ShootOut != undefined){

			// alias, make it easy to work with
			var shootOut = team.ShootOut.PenaltyShot;

			try{

				for (var i = shootOut.length - 1; i >= 0; i--) {
					
					var goal = shootOut[i]['@attributes'];
					var player = getTeamPlayer( goal.PlayerRef, teamMetaData);
					
					var entry = {};
					entry.IDPlayer = goal.PlayerRef;
					entry.playerFirstName = player.firstName;
					entry.playerLastName = player.lastName;
					entry.result = goal.Outcome;

					if ( goal.Outcome === 'Scored' ){
						scored++
					}

					if ( goal.Outcome === 'Saved' ){
						saved++
					}

					shootOutArray.push(entry)
				};
			}catch(e){
				// fail silently.
			}
		}

		shootOutArray = shootOutArray.reverse();
		
		result.shootOutArray = shootOutArray;
		result.scored = scored;
		result.missed = saved;

		return result;
	}


	/**
	 * I return the lineup for a team, starters and substitutions
	 *
	 * @param {array} playerArray - I am the array of players
	 * @param {array} squads - I am team object
	 * @return {array}
	 */
	function getLineUp( playerArray, team ){

		var result = {};
		result.starting = [];
		result.substitution = [];

		for (var i = 0; i < playerArray.length; i++) {

			var player = {
				'id' : playerArray[i]['@attributes']['PlayerRef'],
				'number' : playerArray[i]['@attributes']['ShirtNumber'],
				'position' : playerArray[i]['@attributes']['Position'],
				'status' : playerArray[i]['@attributes']['Status'],
				'name' : getTeamPlayer(playerArray[i]['@attributes']['PlayerRef'], team)
			}

			// are they a starter?
			if(player.status === 'Start'){

				// we only want to use the term 'forward' not stricker.
				if( player.position === 'Striker' ){
					player.position = 'Forward'
				}

				result.starting.push(player);
			}

			// are they a sub?
			if(player.status === 'Sub'){
				// over write the position, XML is kinda stupid...
				player.position = playerArray[i]['@attributes']['SubPosition'];

				// we only want to use the term 'forward' not stricker.
				if( player.position === 'Striker' ){
					player.position = 'Forward'
				}
	
				result.substitution.push(player);
			}
		};

		return result;
	}



	/**
	 * I return an array of a teams substitutions
	 *
	 * @param {array} subArray - I am the array of substitutions
	 * @param {array} squads - I am team object
	 * @return {array}
	 */
	function getTeamSubstitution( subArray, team ){
 
		var result = [];

		try{
			for (var i = 0; i < subArray.length; i++) {

				var sub = getDefaultSubstituionObject();

				var offPlayer = getTeamPlayer(subArray[i]['@attributes']['SubOff'] , team);
				sub.offFirstName = offPlayer.firstName;
				sub.offLastName = offPlayer.lastName;

				var onPlayer = getTeamPlayer(subArray[i]['@attributes']['SubOn'] , team);
				sub.onFirstName = onPlayer.firstName;
				sub.onLastName = onPlayer.lastName;

				sub.position = parseInt(subArray[i]['@attributes']['SubstitutePosition']);
				sub.reason = subArray[i]['@attributes']['Reason'];
				
				sub.time = parseInt(subArray[i]['@attributes']['Time']);

				result.push(sub);
			};
		} catch(e){
			// fail silently no subs...
		}

		return result;

		function getDefaultSubstituionObject(){

			var object = {
				'offFirstName': '',
				'offLastName' : '',
				'onFirstName': '',
				'onLastName': '',
				'position': 0,
				'reason': '',
				'time': 0
			}

			return object;
		}
	}

	/**
	 * I return an array of objects describing Yellow and Red cards
	 *
	 * @param {array} subArray - I am the array of bookings
	 * @param {array} squads - I am team object
	 * @return {array}
	 */
	function getTeamBooking(bookingObject, team){

		var result = [];

		for (var property in bookingObject){

			var booking = {}

			// OPTA has 'vairence' :P in their XML so catch and try this again
			// NOT in the attrs.
			try{
			
				booking.period = bookingObject[property]['@attributes'].Period;
				booking.time = bookingObject[property]['@attributes'].Time;
				booking.timeStamp = bookingObject[property]['@attributes'].TimeStamp;
				booking.card = bookingObject[property]['@attributes'].Card;
				booking.cardType = bookingObject[property]['@attributes'].CardType;
				booking.IDPlayer = bookingObject[property]['@attributes'].PlayerRef;
			}
			catch(e){
				// nope not in the attributes
				try{
					booking.period = bookingObject[property].Period;
					booking.time = bookingObject[property].Time;
					booking.timeStamp = bookingObject[property].TimeStamp;
					booking.card = bookingObject[property].Card;
					booking.cardType = bookingObject[property].CardType;
					booking.IDPlayer = bookingObject[property].PlayerRef;
				}
				catch(finalError){
					
					ErrorHandler.handleError(
						"Booking XML from Opta Seems wrong again. Transformer.getTeamBooking()", 
						finalError + bookingObject
					);
				}
			}
			
			var bookingPlayerInfo = getTeamPlayer(booking.IDPlayer , team);
			booking.playerFirstName = bookingPlayerInfo.firstName;
			booking.playerLastName = bookingPlayerInfo.lastName;

			result.push(booking);
		}

		return result;
	}

	/**
	 * I return an array of objects describing goals of a game
	 *
	 * @param {array} subArray - I am the array of goals
	 * @param {array} squads - I am team object
	 * @param {array} squads - I am opposing team object
	 * @return {array}
	 */
	function getTeamGoal( goalArray, team, opposingTeam ){
	
		var result = [];

		for (var property in goalArray){

			// ******* Real goal, NOT a penelaty ******* //
			if ( typeof goalArray[property]['@attributes'] !== 'undefined' ){

				var goal = {}

				goal.period = goalArray[property]['@attributes'].Period;
				goal.time = goalArray[property]['@attributes'].Time;
				goal.timeStamp = goalArray[property]['@attributes'].TimeStamp;
				goal.type = goalArray[property]['@attributes'].Type;
				goal.IDPlayer = goalArray[property]['@attributes'].PlayerRef;

				var scoringPlayerInfo = getTeamPlayer(goal.IDPlayer , team);
				goal.playerFirstName = scoringPlayerInfo.firstName;
				goal.playerLastName = scoringPlayerInfo.lastName;

				// some one scored on themselves.... handle
				if (goal.type === 'Own'){

					var scoringPlayerInfo = getTeamPlayer(goal.IDPlayer , opposingTeam);
					goal.playerFirstName = scoringPlayerInfo.firstName;
					goal.playerLastName = scoringPlayerInfo.lastName;
				}
				
				result.push(goal);

			// ******* Goal was the result of a penelity ******* //
			// this is kinda stupid they built the XML this way so a Penelaty
			// goal info isnt in the attributes like a normal goal is....
			} else if (typeof goalArray[property] !== 'undefined') {

				var goal = {};
				goal.period = goalArray[property].Period;
				goal.time = goalArray[property].Time;
				goal.timeStamp = goalArray[property].TimeStamp;
				goal.type = goalArray[property].Type;
				goal.IDPlayer = goalArray[property].PlayerRef;

				var scoringPlayerInfo = getTeamPlayer(goal.IDPlayer , team);
				goal.playerFirstName = scoringPlayerInfo.firstName;
				goal.playerLastName = scoringPlayerInfo.lastName;

				// some one scored on themselves.... handle
				if (goal.type === 'Own'){

					var scoringPlayerInfo = getTeamPlayer(goal.IDPlayer , opposingTeam);
					goal.playerFirstName = scoringPlayerInfo.firstName;
					goal.playerLastName = scoringPlayerInfo.lastName;
				}

				result.push(goal);
			}
		}

		return result;
	}

	/**
	 * I return an object of a players first name and last name by ID.
	 *
	 * @param {string} IDPlayer - I am the ID of the player
	 * @param {array} squads - I am team object
	 * @return {object}
	 */
	function getTeamPlayer( IDPlayer, team ){
		
		var player = {}; 
		
		for ( var property in team.Player ){
			
			if( team.Player[property]['@attributes']['uID'] === IDPlayer ){

				player.firstName = team.Player[property].PersonName.First['#text'];
				player.lastName = team.Player[property].PersonName.Last['#text'];
			}
		}

		return player;
	}

	/**
	 * I return an object of a games totals
	 *
	 * @param {array} playerArray - I am array of a games player data form XML
	 * @return {object}
	 */
	function getTeamTotals( playerArray ){

		var result = {
			'redCard' : getPropertyCountFromPlayerArray( playerArray, 'red_card' ),
			'yellowCard' : getPropertyCountFromPlayerArray( playerArray, 'yellow_card' ),
			'shotOnGoal' : getPropertyCountFromPlayerArray( playerArray, 'total_scoring_att' ),
			'tackle' : getPropertyCountFromPlayerArray( playerArray, 'total_tackle' ),
			'foulCount' : getPropertyCountFromPlayerArray( playerArray, 'fouls' ),
			'offSide' : getPropertyCountFromPlayerArray( playerArray, 'total_offside' ),
			'wonCorner' : getPropertyCountFromPlayerArray( playerArray, 'won_corners' ),
			'save' : getPropertyCountFromPlayerArray( playerArray, 'saves' )
		}

		return result;
	}

	// I return a property from the stats array
	function getPropertyCountFromPlayerArray( playerArray, property ){

		var theCount = 0;
		var theType = '';

		for ( var i = playerArray.length - 1; i >= 0; i-- ) {

			for ( var x = playerArray[i].Stat.length - 1; x >= 0; x-- ) {

				theType = playerArray[i].Stat[x]['@attributes']['Type'];

				if ( theType === property ){
					 theCount = theCount + +playerArray[i].Stat[x]['#text'] ;
				}
			};
		};
		return theCount;
	}
}


/**
 * I build the schedule JSON.
 *
 * @param {Object} data - I am the JSON data to make the schedule from
 * @return {void}
 */
function buildSchedule( data ){
	
	// thow an error if we didn't get data
	if (typeof data.SoccerFeed.SoccerDocument.MatchData === 'undefined'){
		 throw ("Invalid Data");
	}

	var schedule  = [];
	var matchArray = utils.objectSearch( 'SoccerFeed.SoccerDocument.MatchData',data );
	var teamArray = utils.objectSearch( 'SoccerFeed.SoccerDocument.Team',data );
	var match = {};

	for (var property in matchArray){

		match.IDMatch = matchArray[property]['@attributes']['uID'];
		match.IDMatch = match.IDMatch.replace("g", "f");

		match.group = 'playoff';
		if (typeof matchArray[property].MatchInfo['@attributes']['GroupName'] != 'undefined'){
			match.group = matchArray[property].MatchInfo['@attributes']['GroupName'];
		}

		match.roundType = matchArray[property].MatchInfo['@attributes']['RoundType'];
		match.roundNumber = matchArray[property].MatchInfo['@attributes']['RoundNumber'];
		match.day = matchArray[property].MatchInfo['@attributes']['MatchDay'];
		match.date = matchArray[property].MatchInfo['Date']['#text'];

		// venu details
		var matchMetaData = matchArray[property].Stat;
		for (var i = matchMetaData.length - 1; i >= 0; i--) {

			if (matchMetaData[i]['@attributes'].Type === 'City'){
				match.city = matchMetaData[i]['#text'];
			}

			if (matchMetaData[i]['@attributes'].Type === 'Venue'){
				match.venue = matchMetaData[i]['#text'];
			}
		};

		// team ID and scores
		var teamMetaData = matchArray[property].TeamData;
		
		var awayTeam = {};
		var homeTeam = {};
		
		for (var i = teamMetaData.length - 1; i >= 0; i--) {
			
			if (teamMetaData[i]['@attributes'].Side === 'Away'){
				
				awayTeam.ID = teamMetaData[i]['@attributes'].TeamRef;

				awayTeam.score = '';
				awayTeam.penalityScore = '';
				if ( teamMetaData[i]['@attributes'].Score !== undefined ){
					awayTeam.score = parseInt(teamMetaData[i]['@attributes'].Score);
				}

				if ( teamMetaData[i]['@attributes'].PenaltyScore !== undefined ){
					awayTeam.penalityScore = parseInt(teamMetaData[i]['@attributes'].PenaltyScore);
				}		
			}

			if (teamMetaData[i]['@attributes'].Side === 'Home'){
				
				homeTeam.ID = teamMetaData[i]['@attributes'].TeamRef;

				homeTeam.score = '';
				homeTeam.penalityScore = '';
				if ( teamMetaData[i]['@attributes'].Score !== undefined ) {
					homeTeam.score = parseInt(teamMetaData[i]['@attributes'].Score);
				}
				if ( teamMetaData[i]['@attributes'].PenaltyScore !== undefined ){
					homeTeam.penalityScore = parseInt(teamMetaData[i]['@attributes'].PenaltyScore);
				}
			}
		};

		// front end code needs this for flag display EVERYWHERE, so put it here.
		// PHP will use it for server side rendering, other display pages might, so
		// really, its cool to put this here instead of writting it on the
		var awayTeamAbbvr = Lookup.getTeamDataByID( awayTeam.ID )['abbreviation'];

		if ( typeof awayTeamAbbvr != 'undefined' ) {
			awayTeam.abbreviation = awayTeamAbbvr;
		} else {
			awayTeam.abbreviation = '';
		}

		var homeTeamAbbvr = Lookup.getTeamDataByID( homeTeam.ID )['abbreviation'];
		if ( typeof homeTeamAbbvr != 'undefined' ) {
			homeTeam.abbreviation = homeTeamAbbvr;
		} else {
			homeTeam.abbreviation = '';
		}

		// figure out the team names
		for (var i = teamArray.length - 1; i >= 0; i--) {
			if (teamArray[i]['@attributes']['uID'] === awayTeam.ID){
				awayTeam.name = teamArray[i].Name['#text'];
			}

			if (teamArray[i]['@attributes']['uID'] === homeTeam.ID){
				homeTeam.name = teamArray[i].Name['#text']
			}
		};

		match.awayTeam = awayTeam;
		match.homeTeam = homeTeam;

		schedule.push( match );

		match = {};
	}
	
	schedule = sortSchedule( schedule );

	return schedule;

	/***************** helper functions *****************/
	// I sort the schedule by group then date
	function sortSchedule ( schedule ) {
		
		//TODO: this should be made more generic and put in the Utils class
		/* multi key sort from: 
		stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
		*/
		var sort_by;

		(function() {
		    // utility functions
		    var default_cmp = function(a, b) {
		            if (a == b) return 0;
		            return a < b ? -1 : 1;
		        },
		        getCmpFunc = function(primer, reverse) {
		            var dfc = default_cmp, // closer in scope
		                cmp = default_cmp;
		            if (primer) {
		                cmp = function(a, b) {
		                    return dfc(primer(a), primer(b));
		                };
		            }
		            if (reverse) {
		                return function(a, b) {
		                    return -1 * cmp(a, b);
		                };
		            }
		            return cmp;
		        };

		    // actual implementation
		    sort_by = function() {
		        var fields = [],
		            n_fields = arguments.length,
		            field, name, reverse, cmp;

		        // preprocess sorting options
		        for (var i = 0; i < n_fields; i++) {
		            field = arguments[i];
		            if (typeof field === 'string') {
		                name = field;
		                cmp = default_cmp;
		            }
		            else {
		                name = field.name;
		                cmp = getCmpFunc(field.primer, field.reverse);
		            }
		            fields.push({
		                name: name,
		                cmp: cmp
		            });
		        }

		        // final comparison function
		        return function(A, B) {
		            var a, b, name, result;
		            for (var i = 0; i < n_fields; i++) {
		                result = 0;
		                field = fields[i];
		                name = field.name;

		                result = field.cmp(A[name], B[name]);
		                if (result !== 0) break;
		            }
		            return result;
		        }
		    }
		}());


		// TODO: this should be passed in as arguments!
		return schedule.sort( sort_by( 'date' ) );
		//return schedule.sort( sort_by( 'group', 'date' ) );
	}
}



/**
 * I do nothing and am here for backward compatibility. Ill be removed in the
 * future.
 *
 * @return {void}
 */
function buildSeasonStats(){
	
	return true;
}


/* *************************** Private Methods ***************************** */

/**
 * I check if a game is live by the date object passed to me.
 *
 * @param {String} startDateTime - I am th date/time object to check if a game is live by.
 * @param {object} data - I the entire xml object. I am ALSO used to check if a game is live
 * 						  by looking at the object information.
 *
 * @return {boolean} - I return true if the game is live, false if it is not.
 */
function isGameLive( scheduledDateTime, data ){

	/* NEW CODE! */

	// MAYBE USE THIS BUT AS SUBSITIUE FOR argumetn scheduledDateTime 
	// BUT FOR NOW NOW.... JUST USE THE LATEST CHECK BELOW...
	//var gameDateTime = utils.formatOptaDate(data.SoccerFeed.SoccerDocument.MatchData.MatchInfo.Date['#text']);

	var result = false;

	if( data != undefined ){

		if (data.SoccerFeed.SoccerDocument['@attributes'] 
			&&
			data.SoccerFeed.SoccerDocument['@attributes']['Type'] === 'Latest') {
			result = true;
		} else {
			result = false;
		}
	}

	return result;
}


function isCommentFeedLive ( data ) {

	var result = false;
	var startTime = moment( data.Commentary['@attributes']['game_date'] + '(GMT)' );
	var endTime = moment( startTime ).add( 'm', 128 );
	var now = moment();

	var isBeforeGame = startTime.isBefore(now);
	var isAfterGame = endTime.isAfter(now);

	if (isBeforeGame && isAfterGame){
		result = true;
	}

	return result;
}



/* ************************ Exported Public Methods ************************ */
exports.buildSchedule = buildSchedule;
exports.buildGameFile = buildGameFile;
exports.buildCommentFile = buildCommentFile;
exports.buildSquadFile = buildSquadFile;
exports.buildSeasonStats = buildSeasonStats;
exports.updateCurrentGameFile = updateCurrentGameFile;
exports.doBuildCommentFile = doBuildCommentFile;
