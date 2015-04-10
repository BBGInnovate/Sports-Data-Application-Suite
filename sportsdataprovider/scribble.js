/* ****************************************************************************
 * File: 		
 * Purpose: 	
 * Author: 		John Allen
 * Company: 	Fig Leaf Software
 *************************************************************************** */
/* *************************** Required Classes **************************** */
var Config = require('./Config');
var log = require('./Logger.js');
var ErrorHandler = require('./ErrorHandler');
var fs = require('fs');
var CronJob = require('cron').CronJob;
var childProcess = require('child_process');


/* *************************** Constructor Code **************************** */
var config = Config.getConfig();




console.log('HAPPPPEYYYY');


var CronJob = require('cron').CronJob;
var job = new CronJob({
	cronTime: '*/1 * * * *',
	onTick: function() {
		// run a script and invoke a callback when complete, e.g.
		runScript('./scribble2.js', function (err) {

			if (err) {
				throw err
			};

			console.log('finished running scribble2.js');
		});
	},
	start: false,
	timeZone: "America/New_York"
});
job.start();



/**
 * I run a child process script.
 * @param {String} scriptPath - I am the path to the precess to run.
 * @param {String} callback - I am the callback function.
 */
function runScript(scriptPath, callback) {

	// keep track of whether callback has been invoked to prevent multiple invocations
	var invoked = false;

	var process = childProcess.fork(scriptPath);

	// listen for errors as they may prevent the exit event from firing
	process.on('error', function (err) {
		if (invoked) return;
		invoked = true;
		callback(err);
	});

	// execute the callback once the process has finished running
	process.on('exit', function (code) {
		if (invoked) return;
		invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});
}