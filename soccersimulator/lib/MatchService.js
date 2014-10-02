/** 
 * @fileOverview 	I am provide the file building and simulation functionality for
 *					simulating soccer games using OPTA data.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			MatchService.js
 */

/* *************************** Required Classes **************************** */
var fs = require('fs');
var path = require('path');
var util = require('util');

var Connection = require('ssh2');
var moment = require('Moment');
var lazy = require("lazy");
var kue = require('kue');

var projectUtility = require('./ProjectUtility');


/* *************************** Constructor Code **************************** */
// get the frameworks config.
var config = geddy.config;

// the array of jobs Kue keeps track of
var jobs = kue.createQueue();

// light up the UI for kue
kue.app.listen(3000);



/* *************************** Public Methods ****************************** */

/**
 * I build build the XML files for game simulation.
 *
 * @return {boolean}
 */
function buildMatchFiles () {

	var sourceDirList = getMatchSourceDirectoryList();

	// loop over and build the simulation files
	for ( var i = 0; i < sourceDirList.length; i++ ) {
		
		buildCommentaryFiles( sourceDirList[i] );

		stringSwapGameStatFile( sourceDirList[i] );
	};

	return true;
}
exports.buildMatchFiles = buildMatchFiles;



/**
 * I return an array of object describing the avaiable matches that can be 
 * simulated.
 *
 * @return {array}
 */
function getAvaiableMatch () {

	var result = [];
	var sourceDirList = getMatchSourceDirectoryList();
	var pathToFiles = config.simulationFilePath;

	for (var i = sourceDirList.length - 1; i >= 0; i--) {
		
		// create the name and id
		var name = sourceDirList[i].replace(/_/g, ' ');
		name = name.replace(pathToFiles, '');
		name = toTitleCase( name );
		var id = sourceDirList[i].replace( pathToFiles, '' );

		var realGameDirectory = {
			'name' : name,
			'id' : id
		}
		result.push(realGameDirectory);
	};

	return result;

	/***************** helper functions *****************/
	
	/**
	 * I title upper case the first letter in each word
	 *
	 * @param {string} str - I am the string to title case
	 * @return {string}
	 */
	function toTitleCase(str){
	    return str.replace(/\w\S*/g, function(txt){
	    	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    });
	}
}
exports.getAvaiableMatch = getAvaiableMatch;



/**
 * I run a simulation of a game as if OPTA was send the data via FTP.
 *
 * @param {array} id - I am array of game ids (their directory names) to simulate.
 * @return {void}
 */
function runMatch ( id, pushTime ) {

	var idArray = [];

	// cast or alias stuff to an array...
	if ( !util.isArray( id ) ){
		idArray.push( id );
	} else {
		idArray = id;
	}

	// loop over the array and begin the simulation
	for (var i = idArray.length - 1; i >= 0; i--) {
		simulateGameStatistic( idArray[i], pushTime );
		simulateGameCommentary( idArray[i], pushTime );
	};
}
exports.runMatch = runMatch;



/* *************************** Private Methods ***************************** */

/**
 * I run a push the gamestat files for a game sumulation.
 *
 * @param {string} path - I am the path to the match files.
 * @return {void}
 */
function simulateGameStatistic( path, pushTime ){

	// set file names and paths
	var gameStatFileName = getGameStatFileName(config.simulationFilePath + path);
	var commentaryFileName = getCommentFileName( config.simulationFilePath + path );
	var commentaryFilePath = config.simulationFilePath + path + '/source/' + commentaryFileName;
	var gameStatDirectory = config.simulationFilePath + path + '/gamestat/updated/';
	
	// get the commetary xml as JSON and figure out how many comment
	// entries are in it, we use this to calculate the time delay for
	// pushing game files.
	var commentaryJSON = projectUtility.getJSONFromXMLFile( commentaryFilePath );
	var commentCount = commentaryJSON.Commentary.message.length;

	// this is the TOTAL time it will take to push the commentary files
	var totalPushTime = commentCount * pushTime;

	// list the game stat files
	var list = fs.readdirSync( gameStatDirectory );
	list.reverse();
	var totalGameStatFileCount = list.length;
	
	var statFilePushTime = Math.round( totalPushTime / totalGameStatFileCount );

	var count = 1;

	pushFile(gameStatDirectory + '001-gamestat.xml', gameStatFileName);


	for ( var i = list.length - 1; i >= 0; i-- ) {

		if (( list[i].split('.').pop() === 'xml' ) && ( list[i].indexOf("-gamestat") > -1 )) {
			
			var filePath = gameStatDirectory + list[i];

			var job = jobs.create('gameStatFilePush', {
				path: filePath,
				name : gameStatFileName,
				count : count,
				pushTime : statFilePushTime
			})
			  .save(function(err, job){
			  	 if( !err ) {};
			  	 if( err ) dump( err );
			  });

			count++;
		}
	}
}



/**
 * I run a push the commentary files for a game sumulation.
 *
 * @param {string} path - I am the path to the match files.
 * @return {void}
 */
function simulateGameCommentary( path, pushTime ){

	var commentaryDirectory = config.simulationFilePath + path + '/commentary/';
	var list = fs.readdirSync( commentaryDirectory );
	var commentaryFileName = getCommentFileName( config.simulationFilePath + path );

	list = list.reverse();

	var count = 1;

	for ( var i = list.length - 1; i >= 0; i-- ) {

		if (( list[i].split('.').pop() === 'xml' ) && ( list[i].indexOf("-commentary") > -1 )) {
			
			var filePath = commentaryDirectory + list[i];

			var job = jobs.create('commentaryFilePush', {
				path: filePath,
				name : commentaryFileName,
				count : count,
				pushTime : pushTime
			})
			  .save(function(err, job){
			  	 if( !err ) {};
			  	 if( err ) dump( err );
			  });

			count++;
		}
	}
}


/**
 * I process the commentaryFilePush job cue.
 *
 * @param {String} 'commentaryFilePush' - I am the string to look at the job que for to
 								   		  process things.
 * @param {Function} callback - I am teh call back funciton.
 * @return {void}
 */
jobs.process('commentaryFilePush', function( job, done ){
	
	var commentaryDelay = (job.data.count * job.data.pushTime) * 1000;
	
	setTimeout(function () {
	   pushFile( job.data.path, job.data.name );
	}, commentaryDelay);

	done();
});


/**
 * I process the gameStatFilePush job cue.
 *
 * @param {String} 'gameStatFilePush' - I am the string to look at the job que for to
 								   		process things.
 * @param {Function} callback - I am teh call back funciton.
 * @return {void}
 */
jobs.process('gameStatFilePush', function( job, done ){

	var gameStatDelay = (job.data.count * job.data.pushTime) * 1000;

	setTimeout(function () {
		pushFile( job.data.path, job.data.name );
	}, gameStatDelay);

	done();
});



/**
 * I replace strings a matches game stats (F9) faux xml files.
 *
 * @param {string} filePath - I the full path to the local match directory.
 * @return {void}
 */
function stringSwapGameStatFile( path ){

	var statPath = path + '/gamestat/';
	var list = fs.readdirSync(statPath);
	var replacementObject = getReplacementJSON( path );
	var finalWriteDirectory = statPath + 'updated/';
	
	projectUtility.emptyDirectory( finalWriteDirectory );
	
	for ( var i = list.length - 1; i >= 0; i-- ) {
		
		// is this a faux game stat file??
		if ( list[i].split('.').pop() === 'xml' && ( list[i].indexOf("-gamestat") > -1 ) ){
			
			// read the xml file and put into a string so we can replace stuff..
			var gameXMLPath = statPath + list[i];
			var gameBinary = fs.readFileSync( gameXMLPath );
	   		var gameXML = gameBinary.toString();

	   		// do the string replacement form the replacementObject
		   	for (var key in replacementObject) {
		   		
		   		// only going to work with the commentary object
		   		if (key === 'gamestat'){
		   			
		   			// alias the array of replacement objects
		   			var replacementArray = replacementObject[key];

		   			for (var x = 0; x < replacementArray.length; x++) {
		   				
		   				// is this a time repalcement?
		   				if ( replacementArray[x]['format'] != undefined ){

		   					var oldString = replacementArray[x]['old'];
							var newString = moment( Date.now() ).format( replacementArray[x]['format'] );

							gameXML = gameXML.replace( oldString, newString );

		   				} else { // just a straight up string replacement
		   					
		   					gameXML = gameXML.replace( replacementArray[x]['old'], replacementArray[x]['new'] )
		   				}
		   			}
		   		}
			}

			// write the updated XML back to the disk in the updated dir, don't 
			// want to over write the origional XML cause its a pain to create.
			fs.writeFileSync( finalWriteDirectory + list[i], gameXML );
		}
	};
}



/**
 * I do the actual building of a matches faux commentary XML files
 *
 * @param {string} filePath - I the full path to the local match directory.
 * @return {void}
 */
function buildCommentaryFiles( path ){

	// all the message elements will go in this array
	var messages = [];
	var commentFileName = getCommentFileName( path );
	var commentaryFilePath = path + '/source/' + commentFileName;
	
	/* TODO: fix this! and kill the below code!!!
	// read the replacement infor off the disk
	var stringReplacementPath = path + '/replacestring/replaceString.json';
	var replacementBinaryData = fs.readFileSync( stringReplacementPath );
	var replacementObject = JSON.parse( replacementBinaryData.toString() );
	dump(replacementObject);
	var replacementObject = {};
	*/

	replacementObject = getReplacementJSON( path );
	
	// lets empty the commentry directory
	projectUtility.emptyDirectory( path + '/commentary/' );

	if ( fs.existsSync( commentaryFilePath ) ){
		
		new lazy( fs.createReadStream( commentaryFilePath ) )
			.lines
			.forEach(function( line ){

				var entry = line.toString();

				if ( entry.indexOf("<message") > -1 ){
					
					var entryToPush = entry.trim();
					
					messages.push(entryToPush);
				}
			})
			.sum(function(){
				writeCommetnaryFile( path, commentaryFilePath, messages, -1, replacementObject );
			});
	}


	/***************** helper functions *****************/

	/**
	 * I recursively write out the commentary xml files
	 *
	 * @param {string} path - I am the path to the games directory
	 * @param {string} commentaryFilePath - I am the path to the original Opta 
	 *										commentary file
	 * @param {array} messages - I am the array of XML comment elements
	 * @param {filePrefix} text - I am the in to prefix written files with
	 * 
	 * @return {void}
	 */
	function writeCommetnaryFile( path, commentaryFilePath, messages, filePrefix, replacementObject ){

		// always read the full xml file
		var commentaryBinary = fs.readFileSync( commentaryFilePath );
	   	var commentaryXML = commentaryBinary.toString();

	   	// loop over and delete any comments that match
	   	for ( var i = messages.length - 1; i >= 0; i-- ) {
	   		commentaryXML = commentaryXML.replace('  ' + messages[i] + '\n', '');
	   	};

	   	// do the string replacement form the replacementObject
	   	for (var key in replacementObject) {
	   		
	   		// only going to work with the commentary object
	   		if (key === 'commentary'){
	   			
	   			// alias the array of replacement objects
	   			var replacementArray = replacementObject[key];

	   			for (var i = 0; i < replacementArray.length; i++) {
	   				
	   				// is this a time repalcement?
	   				if ( replacementArray[i]['format'] != undefined ){

	   					var oldString = replacementArray[i]['old'];
						var newString = moment( Date.now() ).format( replacementArray[i]['format'] );

						commentaryXML = commentaryXML.replace( oldString, newString );

	   				} else { // just a straight up string replacement
	   					
	   					commentaryXML = commentaryXML.replace( replacementArray[i]['old'], replacementArray[i]['new'] )
	   				}
	   			}
	   		}
		}

	   	// increase the prefix name and write the file if its NOT the first 
	   	// entry which has NO comment entry
	   	var prefix = filePrefix + 1;
	   	var numberToPrefixFileWith = zeroPad( prefix, 4 );
	   	var savePath = path + '/commentary/' + numberToPrefixFileWith +'-commentary.xml';

	   	if( prefix > 0 ){
	   		fs.writeFileSync( savePath, commentaryXML );
	   	}
	   	
	   	// kill the top element and recursively call this function
	   	messages.pop();
	   	
	   	if ( messages.length > 0 ){
	   		writeCommetnaryFile( path, commentaryFilePath, messages, prefix, replacementObject );
	   	}
	}


	/**
	 * I padd a number with 0's
	 *
	 * @param {int} num - I am the number to pad
	 * @param {int} places - I am the amout of padding to apply
	 * 
	 * @return {string}
	 */
	function zeroPad( num, places ) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join("0") + num;
	}
}


/**
 * I return the name of the games comment xml file
 *
 * @param {string} path - I am the path to the games directory
 * @return {string}
 */
function getCommentFileName(path){

	var list = fs.readdirSync( path + '/source/' );
	var result = '';

	for (var i = list.length - 1; i >= 0; i--) {
		if (list[i].indexOf("commentary-") > -1 ){
			result = list[i];
		}
	};

	return result;
}



/**
 * I return the name of the games F9 xml file
 *
 * @param {string} path - I am the path to the games directory
 * @return {string}
 */
function getGameStatFileName(path){

	var list = fs.readdirSync( path + '/source/' );
	var result = '';

	for (var i = list.length - 1; i >= 0; i--) {
		if (list[i].indexOf("srml-") > -1 ){
			result = list[i];
		}
	};

	return result;
}



/**
 * I push a file to a configured destination.
 *
 * @param {string} filePath - I the full path to the local file to upload to
 *							  the server.
 * @return {void}
 */
function pushFile( filePath, destinationFileName ){

	// should we use FTP as a transport?
	if ( config.ftpPushDetail.ftpEnabled ){
		
		uploadFileViaFTP(filePath, destinationFileName);

	} else { 
		
		// or are we copying the file to a directory?
		copyFileToDirectory( filePath, destinationFileName );
	}
}



/**
 * I copy a file from one place to another and rename it.
 *
 * @param {string} filePath - I the full path to the local file to upload to
 *							  the server.
 * @param {string} destinationFileName - I am the name of the file should be
 *       					save as.
 * @return {void}
 */
 function copyFileToDirectory( filePath, destinationFileName ){

 	console.log(filePath);

 	var destination = config.ftpPushDetail.nonFTPPushPath + '/' + destinationFileName
 	var binaryData = fs.readFileSync( filePath );

 	fs.writeFileSync( destination, binaryData.toString() );
 }



/**
 * I upload a file to the FTP server. I require the full path for the upload
 * file but use configuration data for the destination path.
 *
 * @param {string} filePath - I the full path to the local file to upload to
 *							  the server.
 * @param {string} destinationFileName - I am the name of the file should be
 *       					save as.
 * @return {void}
 */
function uploadFileViaFTP( filePath, destinationFileName ){
	console.log('FTP PUSH: ' + filePath);
	
	var ftpDetail = config.ftpPushDetail;
	var conn = new Connection();
	
	conn.on( 'connect', function () {
		//console.log( "- connected" );
	});
	 
	conn.on( 'ready', function () {
        
		//console.log( "- ready" );

        conn.sftp( function ( err, sftp ) {
            
        	// lets not BORK the entire application if there is a single error
        	// but for SURE log it...
            if ( err ) {
                console.log( "Error, problem starting SFTP: %s", err );
            }

            //console.log( "- SFTP started" );

            // upload file
            var readStream = fs.createReadStream( filePath );
            var writeStream = sftp.createWriteStream( ftpDetail.directory + destinationFileName );

            // what to do when transfer finishes
            writeStream.on('close', function () {
				//console.log( "- file transferred" );
				sftp.end();
			});

            // initiate transfer of file
            readStream.pipe( writeStream );
		});
	});
	 
	// on error handle the error grasefully, we don't want to kill everything
	// if there is an issue with a single push
	conn.on( 'error', function (err) {
		console.log( "SFTP - connection error: %s", err );
	});
	
	conn.on( 'end', function () {
		sftp.end();
	});

	// connection details
	conn.connect({
        'host': ftpDetail.server,
		'port': 22,
		'username': ftpDetail.userName,
		'password': ftpDetail.password
	});
}



/**
 * I return an array of paths that are the directories of matches the application
 * knows about.
 *
 * @return {array}
 */
function getMatchSourceDirectoryList(){
	var result = [];
	var gameFilePath = config.simulationFilePath;
	var sourceDirList = fs.readdirSync(gameFilePath);

	for (var i = sourceDirList.length - 1; i >= 0; i--) {
		if ( fs.lstatSync(gameFilePath + sourceDirList[i]).isDirectory() ){
			
			var directory = gameFilePath + sourceDirList[i];

			result.push( directory );
		};
	};

	return result;
}



function getReplacementJSON( path ){

	replacementObject = {};

	// pass the correct json...
	if ( path.indexOf("USA") > -1 ){
		replacementObject = {
		  "commentary": [
		    {
		      "old": "2014-06-16 23:00:00",
		      "new": "",
		      "format": "YYYY-MM-DD HH:mm:ss"
		    }
		  ],
		  "gamestat": [
		    {
		      "old": "=\"Result",
		      "new": "=\"Latest"
		    },
		    {
		      "old": "20140616T230000+0100",
		      "new": "",
		      "format": "YYYYMMDDTHHmmssZZ",
		    }
		  ]
		}
	} else {
		replacementObject = {
		  "commentary": [
		    {
		      "old": "2014-07-05 21:00:00",
		      "new": "",
		      "format": "YYYY-MM-DD HH:mm:ss"
		    }
		  ],
		  "gamestat": [
		    {
		      "old": "=\"Result",
		      "new": "=\"Latest"
		    },
		    {
		      "old": "20140706T142527+0100",
		      "new": "",
		      "format": "YYYYMMDDTHHmmssZZ",
		      
		    }
		  ]
		}
	}

	return replacementObject;
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