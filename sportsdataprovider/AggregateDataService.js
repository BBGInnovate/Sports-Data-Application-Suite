/** 
 * @fileOverview 	I take JSON objects and build the Aggregate data files for 
 					players and teams.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		0.0.1
 * @module 			AggregateDataService.js
 */

/* *************************** Required Classes **************************** */
var fs = require('fs');
var Config = require('./Config');
var transformer = require('./Transformer');
var ErrorHandler = require('./ErrorHandler');
var Lookup = require('./Lookup.js');
var log = require('./Logger.js');
var utils = require('./Utils.js');
var moment = require('moment');
var faye = require('faye');


/* *************************** Constructor Code **************************** */

var config = Config.getConfig();
var playerJSONDirectory = config.JSONDirectory + '/player/';
var teamJSONDirectory = config.JSONDirectory + '/team/';
var refJSONDirectory = config.JSONDirectory + '/ref/';
var refAggregateFile = config.JSONDirectory + '/refereeData.json';
var goalieJSONDirectory = config.JSONDirectory + '/goalie/';
var goalieAggregateFile = config.JSONDirectory + '/goalieData.json';


var buildAllTheFiles = false;

// only kill the files if aggregate stuff was passed in e.g.: node app.js true 
if(process.argv[2] != undefined && process.argv[2] === 'true'){
	buildAllTheFiles = true;	
}

if ( buildAllTheFiles ){

	// we need to delete the current aggregate data cause the application just
	// started. It will be rebuilt as game files are read and game data is created.
	utils.emptyDirectory( playerJSONDirectory );
	utils.emptyDirectory( teamJSONDirectory );
	utils.emptyDirectory( refJSONDirectory );
	utils.emptyDirectory( goalieJSONDirectory );
	
	// kill the ref aggregate file store
	if (fs.existsSync( refAggregateFile )){
		fs.unlinkSync( refAggregateFile );
	}

	// kill the ref aggregate file store
	if (fs.existsSync( goalieAggregateFile )){
		fs.unlinkSync( goalieAggregateFile );
	}
}



/* *************************** Public Methods ****************************** */

/**
 * I build the goalie aggregate data.
 *
 * @param {Object} data - I am the JSON data to make the data from
 * @return {void}
 */
function buildGoalieData( data ){
	
	var teamArray = data.SoccerFeed.SoccerDocument.MatchData.TeamData;

	var homeTeam = data.SoccerFeed.SoccerDocument.Team[0];
	var awayTeam = data.SoccerFeed.SoccerDocument.Team[1];

	// loop over the teams
	for (var i = 0; i < teamArray.length; i++) {

		// over the each teams players
		var player = teamArray[i].PlayerLineUp.MatchPlayer;

		for (var x = 0; x < player.length; x++) {
			
			// if its a goalie			
			if (player[x]['@attributes']['Position'] === 'Goalkeeper'){

				var IDGoalie = player[x]['@attributes']['PlayerRef'];

				// the goalie JSON file name
				var goalieJSONFilePath = goalieJSONDirectory + IDGoalie + '.json';
				
				//log.dump(goalieJSONFilePath);

				// do we already have a goalie JSON file?
				if ( fs.existsSync( goalieJSONFilePath ) ){
					
					var goalieBinaryData = fs.readFileSync( goalieJSONFilePath );
	   				var goalie = JSON.parse(goalieBinaryData.toString());

	   			} else { // no we dont so populate some basic information
	   				var goalie = {};
	
					goalie.id = player[x]['@attributes']['PlayerRef'];
					var meta = getPlayerName(goalie.id, homeTeam, awayTeam);
					goalie.firstName = meta.firstName;
					goalie.lastName = meta.lastName;
					goalie.IDTeam = meta.IDTeam;
					goalie.team = meta.team;
					goalie.gameArray = [];
					
				}

				var temp = getGoalieStatDefinition();
				temp.IDGame = data.SoccerFeed.SoccerDocument['@attributes']['uID'];

				// loop over the stat object and check if one of the props
				// is the same as a property in the definition object,
				// if it is, populate.
				var stat = player[x]['Stat'];

				for ( var y = 0; y < stat.length; y++ ) {
					
					var statToCheck = stat[y]['@attributes']['Type'];	
					
					for ( var key in temp ) {

						if( key === statToCheck ){
							temp[ key ] = parseInt( stat[y]['#text'] );
						};
					};
				};

				goalie.gameArray.push( temp );

				goalie.goals_conceded = 0;
				goalie.saves = 0;
				goalie.goals_conceded_ibox = 0;
				goalie.saved_obox = 0;
				goalie.saved_ibox = 0;
				goalie.touches = 0;

				// lets aggregate some data
				for (var i = 0; i < goalie.gameArray.length; i++) {

					var theGame = goalie.gameArray[i];

					goalie.goals_conceded = theGame.goals_conceded + goalie.goals_conceded;
					goalie.saves = theGame.saves + goalie.saves;
					goalie.goals_conceded_ibox = theGame.goals_conceded_ibox + goalie.goals_conceded_ibox;
					goalie.saved_obox = theGame.saved_obox + goalie.saved_obox;
					goalie.saved_ibox = theGame.saved_ibox + goalie.saved_ibox;
					goalie.touches = theGame.touches + goalie.touches;
				};
				
				// write the goalie specific file to disk.
				var finalJSON = JSON.stringify( goalie );

				fs.writeFileSync(goalieJSONFilePath, finalJSON);

				// now add or write to the aggregate file
				buildGoalieAggregateFile( goalie );
			};
		};
	};


	function buildGoalieAggregateFile( goalie ){
		
		var dataArray = [];

		// if the file exists use it...
		if (fs.existsSync( goalieAggregateFile )){
			var goalieBinaryData = fs.readFileSync( goalieAggregateFile );
	   		// when we start the application, this file will be empty
	   		try {
	   			var dataArray = JSON.parse( goalieBinaryData.toString() );
	   		} catch(e) {
	   			console.log(e)
	   		}
	   	}

	   	var addGolie = true;
	   	
	   	for (var i = 0; i < dataArray.length; i++) {
	   		if (dataArray[i].id === goalie.id){
	   			dataArray[i] = goalie;
	   			addGolie = false;
	   		}
	   	};

	   	if(addGolie){
	   		dataArray.push(goalie);
	   	}
	   	
	   	// write the goalie specific file to disk.
		var finalGoalieAggJSON = JSON.stringify( dataArray );

		fs.writeFileSync(goalieAggregateFile, finalGoalieAggJSON);
	}



	function getGoalieStatDefinition(){
		var object = {
			'goals_conceded' : 0,
			'saves' : 0,
			'goals_conceded_ibox' : 0,
			'saved_obox' : 0,
			'saved_ibox' : 0,
			'touches' : 0
		}
		return object;
	}


	function getPlayerName(IDPlayer, homeTeam, awayTeam){

		var result = {
			'firstName' : '',
			'lastName' : '',
			'team' : '',
			'IDTeam' : ''
		}
		
		var foundIt = false;

		var homePlayers = homeTeam.Player;
		var awayPlayers = awayTeam.Player;

		for (var i = homePlayers.length - 1; i >= 0; i--) {
			
			if(homePlayers[i]['@attributes']['uID'] === IDPlayer){

				result.firstName = homePlayers[i]['PersonName']['First']['#text'];
				result.lastName = homePlayers[i]['PersonName']['Last']['#text'];

				result.team = homeTeam.Country['#text'];
				result.IDTeam = homeTeam['@attributes']['uID'];

				foundIt = true;

				break;
			};
		};

		if(!foundIt){
			for (var i = awayPlayers.length - 1; i >= 0; i--) {
				
				if(awayPlayers[i]['@attributes']['uID'] === IDPlayer){

					result.firstName = awayPlayers[i]['PersonName']['First']['#text'];
					result.lastName = awayPlayers[i]['PersonName']['Last']['#text'];

					result.team = awayTeam.Country['#text'];
					result.IDTeam = awayTeam['@attributes']['uID'];

					foundIt = true;

					break;
				};
			};
		}

		return result;
	}
}



/**
 * I build the reffrie aggregate data.
 *
 * @param {Object} data - I am the JSON data to make the data from
 * @return {void}
 */
function buildRefData( data, result ){
	var refData = data.SoccerFeed.SoccerDocument.MatchData.MatchOfficial;
	var IDRef = refData['@attributes']['uID'];

	// whats the refs file path??
	var refDataFilePath = refJSONDirectory + IDRef + '.json';

	// if the file exists, read its content, else default the objeect so
	// it's easy to work with
	if ( fs.existsSync( refDataFilePath ) ) {
	   		
	   	var refBinaryData = fs.readFileSync( refDataFilePath );
	   	var refJSONFromDisk = JSON.parse(refBinaryData.toString());
		var refTotalStat = refJSONFromDisk.totalStat;
		var refInidvidualGameStatArray = refJSONFromDisk.individualGameStat;

	} else {

		// no ref file to get data from so get the predefined object
		var refTotalStat = getRefStatObject();
		var refInidvidualGameStatArray = [];
		var refTotalStat = getRefStatObject();
		var refInidvidualGameStatArray = [];
	}

	var ref = {};
	ref.firstName = refData.OfficialName.First['#text'];
	ref.lastName = refData.OfficialName.Last['#text'];
	ref.id = IDRef;
	ref.totalStat = refTotalStat;
	ref.individualGameStat = refInidvidualGameStatArray;

	var refThisGame = getRefStatObject();
	refThisGame.IDGame = data.SoccerFeed.SoccerDocument['@attributes']['uID'];

	// EXTRA TIME stat loop over the match stats array and add them to the 
	// ref's total stats and individual game stats
	var gameStat = data.SoccerFeed.SoccerDocument.MatchData.Stat;

	for (var i = 0; i < gameStat.length; i++) {
		
		if( gameStat[i]['@attributes']['Type'] === 'first_half_time' ){

			var firstHalfTime = parseInt(gameStat[i]['#text']);
			firstHalfTime = firstHalfTime - 45;
			
			ref.totalStat.firstHalfExtraTime = ref.totalStat.firstHalfExtraTime + firstHalfTime;
			refThisGame.firstHalfExtraTime = firstHalfTime;
		}

		if( gameStat[i]['@attributes']['Type'] === 'second_half_time' ){

			var secondHalfTime = parseInt(gameStat[i]['#text']);
			secondHalfTime = secondHalfTime - 45;
			
			ref.totalStat.secondHalfExtraTime = ref.totalStat.secondHalfExtraTime + secondHalfTime;
			refThisGame.secondHalfExtraTime = secondHalfTime;
		}

		/*
		if( gameStat[i]['@attributes']['Type'] === 'first_half_extra_time' ){

			var firstHalfTime = parseInt(gameStat[i]['#text']);
			
			ref.totalStat.firstHalfExtraTime = ref.totalStat.firstHalfExtraTime + firstHalfTime;
			refThisGame.firstHalfExtraTime = firstHalfTime;
		}

		if( gameStat[i]['@attributes']['Type'] === 'second_half_extra_time' ){

			var secondHalfTime = parseInt(gameStat[i]['#text']);
			
			ref.totalStat.secondHalfExtraTime = ref.totalStat.secondHalfExtraTime + secondHalfTime;
			refThisGame.secondHalfExtraTime = secondHalfTime;
		}
		*/
	};

	// YELLOW Card
	ref.totalStat.yellowCard = ref.totalStat.yellowCard + result.home.total.yellowCard;
	ref.totalStat.yellowCard = ref.totalStat.yellowCard + result.away.total.yellowCard;

	refThisGame.yellowCard = result.home.total.yellowCard + result.away.total.yellowCard;

	// RED Card
	ref.totalStat.redCard = ref.totalStat.redCard + result.home.total.redCard;
	ref.totalStat.redCard = ref.totalStat.redCard + result.away.total.redCard;

	refThisGame.redCard = result.home.total.redCard + result.away.total.redCard;

	// OFFSIDES
	ref.totalStat.offSide = ref.totalStat.offSide + result.home.total.offSide;
	ref.totalStat.offSide = ref.totalStat.offSide + result.away.total.offSide;

	refThisGame.offSide = result.home.total.offSide + result.away.total.offSide;

	// push this game onto the refs individual game stat array
	ref.individualGameStat.push(refThisGame);

	updateRefAggregateFile(ref);

	var finalJSON = JSON.stringify( ref );

	fs.writeFileSync(refDataFilePath, finalJSON);


	/**
	 * I return an empty ref data object.
	 *
	 * @return {object}
	 */
	function getRefStatObject(){
		var object = {
			'offSide' : 0,
			'yellowCard' : 0,
			'redCard' : 0,
			'firstHalfExtraTime' : 0,
			'secondHalfExtraTime' : 0 
		}

		return object;
	}

	/**
	 * I update the aggregate ref game file.
	 *
	 * @return {object}
	 */
	function updateRefAggregateFile( ref ){

		var dataArray = [];

		// if the file exists use it...
		if (fs.existsSync( refAggregateFile )){
			var refBinaryData = fs.readFileSync( refAggregateFile );
	   		// when we start the application, this file will not be there
	   		try{
	   			var dataArray = JSON.parse( refBinaryData.toString() );
	   		} catch(e){}
	   	} 
		
		var refToPush = {}
		refToPush.id = ref.id;
		refToPush.firstName = ref.firstName;
		refToPush.lastName = ref.lastName;
		refToPush.offSide = ref.totalStat.offSide;
		refToPush.yellowCard = ref.totalStat.yellowCard;
		refToPush.redCard = ref.totalStat.redCard;
		refToPush.firstHalfExtraTime = ref.totalStat.firstHalfExtraTime;
		refToPush.secondHalfExtraTime = ref.totalStat.secondHalfExtraTime;
		refToPush.totalGame = ref.individualGameStat.length;
		refToPush.gameArray = ref.individualGameStat;

		// loop over and check if we need to update or add to teh aggregate data
		var needPush = true;
		for (var i = dataArray.length - 1; i >= 0; i--) {
			
			if ( dataArray[i].id === ref.id){

				dataArray[i] = refToPush;
				needPush = false;
				break;
			}
		};
		
		if ( needPush ){
			dataArray.push(refToPush);
		}
			
		var finalRefJSON = JSON.stringify( dataArray );

		fs.writeFileSync( refAggregateFile, finalRefJSON );
	}
}


/**
 * I build the write aggregate data for players based on match files.
 *
 * @param {Object} data - I am the JSON data to make the schedule from
 * @return {void}
 */
function buildPlayerData( data ){
	
	var playerLookupBinary = fs.readFileSync( config.JSONDirectory + '/player.json' );
	var playerLookup = JSON.parse(playerLookupBinary.toString());

	//lets put all the players of the MATCH into ONE array
	var playerArray1 = data.SoccerFeed.SoccerDocument.MatchData.TeamData[0].PlayerLineUp.MatchPlayer;
	var playerArray2 = data.SoccerFeed.SoccerDocument.MatchData.TeamData[1].PlayerLineUp.MatchPlayer;
	var matchPlayerArray = [];

	for (var i = playerArray1.length - 1; i >= 0; i--) {
		matchPlayerArray.push(playerArray1[i]);
	};
	for (var i = playerArray2.length - 1; i >= 0; i--) {
		matchPlayerArray.push(playerArray2[i]);
	};

	var teamData = data.SoccerFeed.SoccerDocument.Team;

	// loop over the all the tournaments players and build each players
	// individual stats JSON file based on what they did in the match.
	for (var i = 0; i < playerLookup.length; i++) {
		
		for (var x = 0; x < matchPlayerArray.length; x++) {
			
			if (playerLookup[i].id === matchPlayerArray[x]['@attributes'].PlayerRef){

				aggregatePlayerData(playerLookup[i], matchPlayerArray[x], teamData);
			}
		};
	};

	/***************** helper functions *****************/

	// I aggregate a players Data from the game data and write the file to disk.
	function aggregatePlayerData(playerInfo, matchData, teamData){
		
		// whats the players file path??
		var playerDataFilePath = playerJSONDirectory + playerInfo.id + '.json';


		// if the file exists, read its content
		if ( fs.existsSync( playerDataFilePath ) ) {
 	   		
 	   		var playerBinaryData = fs.readFileSync( playerDataFilePath );
 	   		var playerJSONFromDisk = JSON.parse(playerBinaryData.toString());
			var playerTotalStat = playerJSONFromDisk.totalStat;
			var playerInidvidualGateStatArray = playerJSONFromDisk.individualGameStat;

		} else {

			// no player file to get data from so get the predefined object
			var playerTotalStat = getPlayerStatsObject();
			var playerInidvidualGateStatArray = [];
		}

		// figure out the players team and opposing team
		var playerTeam = Lookup.getTeamDataByID(playerInfo.teamID);
		// default this to an empty object
		var opposingTeam = Lookup.getTeamDataByID('foo');
		
		// look up the opposing team
		for (var i = teamData.length - 1; i >= 0; i--) {
			if (teamData[i]['@attributes'].uID != playerInfo.teamID){
				opposingTeam = Lookup.getTeamDataByID(teamData[i]['@attributes'].uID)
			}
		};

		// alias the players stat array
		var stats = matchData.Stat;
		var thisGameStatObject = getPlayerStatsObject();
	
		//loop over the match data and add the values to the playerTotalStat.
		for (var i = stats.length - 1; i >= 0; i--) {
			
			var statWeCareAbout = stats[i]['@attributes'].Type;

			// loop over the playerTotalStat and see if any of the keys are there
			// that we are intrested in, if they are add the total to the player
			// objects total
			for (var stat in playerTotalStat) {
				
				if ( playerTotalStat.hasOwnProperty(stat) && (stat === statWeCareAbout) ) {
					
					var numberToAdd = parseInt(stats[i]['#text']);
					
					// aggregate the data...
					playerTotalStat[stat] = parseInt(playerTotalStat[stat]) + numberToAdd;

					// push onto the individual game array
					thisGameStatObject[stat] = numberToAdd;
			  	}
			}
		};

		thisGameStatObject.opposingTeam = opposingTeam;

		// only push a valid individual game stat
		if (opposingTeam.optaid.length){
			
			//push the new game stats on to the array of games stats
			playerInidvidualGateStatArray.push(thisGameStatObject);
		}

		// lets make a new object to searilize;
		var player = {};
		player.individualGameStat = playerInidvidualGateStatArray;
		player.info = playerInfo;
		player.totalStat = playerTotalStat;

		var finalPlayerJSON = JSON.stringify( player );

		fs.writeFileSync(playerDataFilePath, finalPlayerJSON);
	}

	// I return the 'definition' of what stats we care about.
	function getPlayerStatsObject(){
		var result = {
			'accurate_pass' : 0,
			'touches' : 0,
			'duel_lost' : 0,
			'duel_won' : 0,
			'fouls' : 0,
			'game_started' : 0,
			'goal_assist' : 0,
			'goals' : 0,
			'mins_played' : 0,
			'saves' : 0,
			'red_card' : 0,
			'shot_fastbreak' : 0,
			'total_scoring_att' : 0,
			'yellow_card' : 0
		}
		return result;
	}
};



/**
 * I aggregate data for players based on match files.
 *
 * @param {Object} data - I am the JSON data to make the schedule from
 * @return {void}
 */
function buildTeamData( data, result ) {

	var homeTeam = result.home;
	var awayTeam = result.away;

	homeTeam.historyData = getTeamHistory( homeTeam.IDTeam );
	awayTeam.historyData = getTeamHistory( awayTeam.IDTeam );
	
	// sets default winner to an empty string, if it remans empty we
	// know we have a draw.
	var winner = '';

	//log.dump(homeTeam);
	//log.dump(awayTeam);

	// who won the game? were keeping this broken out cause we want to also
	// figure out if there was a draw
	if ( homeTeam.score > awayTeam.score ){
		winner = 'home';
	}
	if ( homeTeam.score < awayTeam.score ){
		winner = 'away';
	}

	// if we have a winner calculate
	if ( winner.length ){

		if( winner === 'home' ){

			homeTeam.historyData.win = homeTeam.historyData.win + 1;
			homeTeam.historyData.points = homeTeam.historyData.points + 3;

			awayTeam.historyData.loss = awayTeam.historyData.loss + 1;

			//figure out the goal difference
			homeTeam.historyData.goalDifference = homeTeam.historyData.goalDifference + (homeTeam.score - awayTeam.score);
			awayTeam.historyData.goalDifference = awayTeam.historyData.goalDifference + (awayTeam.score - homeTeam.score);
		}
		if( winner === 'away' ){
			homeTeam.historyData.loss = homeTeam.historyData.loss + 1;
			
			awayTeam.historyData.win = awayTeam.historyData.win + 1;
			awayTeam.historyData.points = awayTeam.historyData.points + 3;

			//figure out the goal difference
			awayTeam.historyData.goalDifference = awayTeam.historyData.goalDifference + (awayTeam.score - homeTeam.score);
			homeTeam.historyData.goalDifference = homeTeam.historyData.goalDifference + (homeTeam.score - awayTeam.score);

		}
	} else {

		// NO winner so chalk up a draw for each team
		homeTeam.historyData.draw = homeTeam.historyData.draw + 1;
		awayTeam.historyData.draw = awayTeam.historyData.draw + 1;

		// everyone gets a point for the draw
		homeTeam.historyData.points = homeTeam.historyData.points + 1;
		awayTeam.historyData.points = awayTeam.historyData.points + 1;
	}

	// add some meta data, not using but we might need it in the future.
	homeTeam.historyData.id = homeTeam.IDTeam;
	homeTeam.historyData.abbreviation = homeTeam.abbreviation;
	homeTeam.historyData.name = homeTeam.name;
	
	awayTeam.historyData.id = awayTeam.IDTeam;
	awayTeam.historyData.abbreviation = awayTeam.abbreviation;
	awayTeam.historyData.name = awayTeam.name;

	var homeTeamJSONFileName = teamJSONDirectory + homeTeam.IDTeam + '.json';
	var awayTeamJSONFileName = teamJSONDirectory + awayTeam.IDTeam + '.json';

	var finalHomeTeamJSON = JSON.stringify( homeTeam.historyData );
	var finalAwayTeamJSON = JSON.stringify( awayTeam.historyData );

	fs.writeFileSync(homeTeamJSONFileName, finalHomeTeamJSON);
	fs.writeFileSync(awayTeamJSONFileName, finalAwayTeamJSON);

	/***************** helper functions *****************/

	// I aggregate a teams data with previously stored data
	function getTeamHistory( id ) {

		var teamFile = teamJSONDirectory + id + '.json';
		
		if ( fs.existsSync( teamFile ) ) {
 	   		var teamBinaryData = fs.readFileSync( teamFile );
 	   		var result = JSON.parse( teamBinaryData.toString() );
 	   	} else {
 	   		var result = getTeamStatsObject();
		}

		return result;
	}

	// I return a default zeroed out stats object.
	function getTeamStatsObject(){
		var stats = {
			'id' : '',
			'abbreviation' : '',
			'name' : '',
			'win' : 0,
			'loss' : 0,
			'draw' : 0,
			'goalDifference' : 0,
			'points' : 0
		}
		return stats;
	}
}


/**
 * I build the write aggregate data for teams. I am really a refactor of other
 * code and just here to create a file that is easer for the display code to
 * use. I sort the data 'correctly', buy group then points then goal difference.
 * If there was a data base in this application I would NOT be needed.
 *
 * @return {void}
 */
function buildAggregateTeamJSON(){

	var scheduleJSONForGroupLookUp = getSchedualJSON();
	var teamLookUpJSON = getLookUpData();

	var jsonDirectory = config.JSONDirectory;
	var teamJSONDirectory = jsonDirectory + '/team/';
	var filter = '.json';

	var squadPath = config.JSONDirectory + '/squad.json';
	var squadBinary = fs.readFileSync( squadPath );
	var squadJSON = JSON.parse(squadBinary.toString());

	var result = [];

	for (var i = squadJSON.length - 1; i >= 0; i--) {

		var teamID = squadJSON[i]['id'];

		var team = getTeamEntry();
		var teamLookUpData = getTeamLookUpData( teamID );
		var teamAggregateData = getTeamAggregateDataJSON( teamID );

		team.id = teamID;
		team.abbreviation = teamLookUpData.abbreviation;
		team.country = teamLookUpData.country;
		team.group = getTeamGroupLetter( teamID );
		team.coach = squadJSON[i]['manager'];
		team.win = teamAggregateData.win;
		team.loss = teamAggregateData.loss;
		team.draw =  teamAggregateData.draw;
  		team.goalDifference = teamAggregateData.goalDifference;
  		team.points = teamAggregateData.points;

  		result.push(team);	
	}

	result = sortAggData(result);

	var aggregateJSONData = JSON.stringify( result );
	var fileWritePath = config.JSONDirectory + '/squad-results-sorted.json';
	fs.writeFileSync(fileWritePath, aggregateJSONData);

	/********************** HELPER FUNCTIONS *************************/

	/**
	 * I return a teams group number.
	 *
	 * @param {string} id - I am the ID of the team.
	 * @return {string}
	 */
	function getTeamGroup(IDTeam){
		var schedule = scheduleJSONForGroupLookUp;
		var result = '';	
		
	 	for (var i = schedule.length - 1; i >= 0; i--) {
	 		
	 		if(schedule[i]['homeTeam']['ID'] === IDTeam){
	 			result = schedule[i]['group'];
				break;
	 		}
	 		if(schedule[i]['awayTeam']['ID'] === IDTeam){
	 			result = schedule[i]['group'];
				break;
	 		}
	 	};

		return result;
	}


	/**
	 * I return the schdeuld JSON file as a js object.
	 *
	 * @return {object}
	 */
	function getSchedualJSON(){
		var path = config.JSONDirectory + '/schedule.json';
		var binary = fs.readFileSync( path );
		var json = JSON.parse(binary.toString());
		return json;
	}


	/**
	 * I return the team lookup JSON file as a js object.
	 *
	 * @return {object}
	 */
	function getLookUpData(){
		var path = config.JSONDirectory + '/teamlookup.json';
		var binary = fs.readFileSync( path );
		var json = JSON.parse(binary.toString());
		return json;
	}

	/**
	 * I return an empty object that defines an entry for the agg data.
	 *
	 * @return {object}
	 */
	function getTeamEntry(){
		var teamEntry = {
			'id' : '',
			'abbreviation' : '',
			'country' : '',
			'group' : '',
			'coach' : '',
			'win' : 0,
			'loss' : 0,
			'draw' : 0,
			'goalDifference' : '',
			'points' : ''
		} 
		return teamEntry;
	}

	/**
	 * I return an a teams lookup data by its id
	 *
	 * @param {string} id - I am ID of the team to look up.
	 *
	 * @return {object}
	 */
	function getTeamLookUpData( id ){

		var lookupJSON = teamLookUpJSON;
		var result = '';

		for (var i = lookupJSON.length - 1; i >= 0; i--) {
			if(lookupJSON[i]['optaid'] === id){
				result = lookupJSON[i];
				break;
			}
		};

		return result;
	}

	/**
	 * I return the aggregate JSON file as a JS object. This file is generated
	 * by another process
	 *
	 * @param {string} id - I am ID of the team to get the JSON of.
	 *
	 * @return {object}
	 */
	function getTeamAggregateDataJSON( id ){
		var path = config.JSONDirectory + '/team/' + id + '.json';
		var binary = fs.readFileSync( path );
		var json = JSON.parse(binary.toString());
		return json;
	}

	function sortAggData ( data ) {
		
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
		return data.sort( sort_by( 'group', 'points', 'goalDifference' ) );
	}
}


/**
 * I return a teams Group by their ID. This was introduced as a bug fix and
 * is hacky. OPTA data was returning 'playoff' for a group where we were
 * checking... in the future this will be configured data.................
 * This should have been in the LoookUp.js file in the configured data...
 * TODO: move this to the Lookup.js team data structure.
 *
 * @param {sting} id - I am the ID of the team.  
 * @return {string}
 */
function getTeamGroupLetter( id ){

	var data = {
		't614' : 'A',
		't659' : 'A',
		't535' : 'A',
		't494' : 'A',
		't366' : 'B',
		't831' : 'B',
		't575' : 'B',
		't118' : 'B',
		't832' : 'C',
		't1221' : 'C',
		't1266' : 'C',
		't517' : 'C',
		't838' : 'D',
		't119' : 'D',
		't837' : 'D',
		't114' : 'D',
		't368' : 'E',
		't830' : 'E',
		't497' : 'E',
		't847' : 'E',
		't632' : 'F',
		't1216' : 'F',
		't1042' : 'F',
		't537' : 'F',
		't357' : 'G',
		't596' : 'G',
		't1219' : 'G',
		't359' : 'G',
		't360' : 'H',
		't1215' : 'H',
		't536' : 'H',
		't1041' : 'H'
	}

	for (var key in data) {
		if (key === id){
			var result = data[key];
			break;
		}
	}
	return result
}


/* *************************** Private Methods ***************************** */
/* ************************ Exported Public Methods ************************ */
exports.buildPlayerData = buildPlayerData;
exports.buildTeamData = buildTeamData;
exports.buildAggregateTeamJSON = buildAggregateTeamJSON;
exports.buildRefData = buildRefData;
exports.buildGoalieData = buildGoalieData;
