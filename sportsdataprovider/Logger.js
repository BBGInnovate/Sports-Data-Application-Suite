/**
 * @fileOverview 	I am the applications Logger. I can log to two different files
 *					application.log and error.log. As a convience I can also log to
 * 					the console.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			Logger.js
 */

/* *************************** Required Classes **************************** */
var util = require('util');
var fs = require('fs');
var winston = require('winston');

var applogger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: './logs/application.log' })
	]
});

var errorLogger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: './logs/error.log' })
	]
});

// var Log = require('log');
// var appLogger = new Log('debug', fs.createWriteStream('./logs/application.log'));
// var errorLogger = new Log('debug', fs.createWriteStream('./logs/error.log'));


/* *************************** Constructor Code **************************** */

/* *************************** Public Methods ****************************** */

/**
 * I write log entries to the application.log file
 * @param {String} message - I am a message about what happened
 * @param {Object} data - I am a JS object of additional infomation to log
 */
function application( message, data ){
	applogger.info( message, JSON.stringify( data ), data );
}

/**
 * I write log entries to the console
 * @param {String} message - I am a message about what happened
 */
function log( message ){
	console.log( message );
}

/**
 * I write log entries to the error.log file
 * @param {String} message - I am a message about what happened
 * @param {Object} data - I am a JS object of additional infomation to log
 */
function error( message, data ){
	errorLogger.error( message, JSON.stringify( data ), data );
}


/**
 * I dump a object to the console
 * @param {Object} data - I am the object to dump
 * @param {Object} data - I am the depth to dump. I will default to 'all'
 */
function dump( data, depth ){

	data = data || {'nothing':'passed'};
	depth = depth || null;

	console.log(util.inspect(data, {colors: true, depth: depth }));
}


/* ************************ Exported Public Methods ************************ */
exports.application = application;
exports.error = error;
exports.log = log;
exports.dump = dump;