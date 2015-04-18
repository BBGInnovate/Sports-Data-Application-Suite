/**
 * @fileOverview  	I am a description of the code.
 * @author 			John Allen <johnfallen@gmail.com>
 * @version 		1.0.0
 * @module 			CronService.js
 */

/* *************************** Required Classes **************************** */
var CronJob = require('cron').CronJob;
var childProcess = require('child_process');
var log = require('./Logger');

/* *************************** Constructor Code **************************** */


/* *************************** Public Methods ****************************** */

/**
 * I take a function and pattern then set it as a cron job.
 * @param {String} pattern - I am the cron job pattern.
 * @param {String} theFunction - I am the function to run.
 */
function setJob(pattern, theFunction){

	new CronJob(pattern, function(){
		theFunction();
	}, null, true, "America/New_York");
}
exports.setJob = setJob;

/* *************************** Private Methods ***************************** */

/**
 * I set the corn job that process the aggregate data every night at 11:30.
 */
function setDailyAggregateBuild(){

	//log.aggregate('')

	var job = new CronJob({
		cronTime: '00 30 11 * * 0-6',
		onTick: function() {

			// run a script and invoke a callback when complete, e.g.
			runScript('./aggregate-app.js', function (err) {

				if (err) {
					throw err
				};

				console.log('finished running aggregate-app.js');
			});

		},
		start: false,
		timeZone: "America/New_York"
	});

	job.start();
}
exports.setDailyAggregateBuild = setDailyAggregateBuild;

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