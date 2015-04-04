var geddy = require('geddy');
var fs = require('fs');
var path = require('path');

killSessionFile();

geddy.start();

/**
 * I delete the _session_store.json file every hour. There is a bug in Geddy
 * that is causing the _sesion_store.json file to be corrupted. So lets just
 * delete it ever hour.
 */
function killSessionFile(){

	var rootPath = path.normalize(__dirname);

	try{
		fs.unlinkSync( rootPath + '/_session_store.json' );
	} catch(e){
		// fail silently.. the file wasn't there cause we restarted with out
		// making an http request to the application
	}

	setTimeout(function() {

		killSessionFile();

	}, 3600000);
}