/* ****************************************************************************
 * File: 		matches.js
 * Purpose: 	I am the matches controller.
 *
 * Author: 		John Allen
 * Company: 	Fig Leaf Software
 *************************************************************************** */

/* *************************** Required Classes **************************** */
var MatchService = require('../../lib/MatchService');


/* ************************** Controller Methods *************************** */
var Matches = function () {
this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];


/*
 * index - I am the default action for this controller
 */
this.index = function ( req, resp, params ) {
	var self = this;

	self.respond({params: params});
};



/*
 * buildmatchfile - I create the match files so their times are NOW
 */
this.buildmatchfile = function ( req, resp, params ) {
	var self = this;

	MatchService.buildMatchFiles();

	self.flash.success('Files were built!');
	self.redirect({controller: 'matches', action: 'index'});
};



/*
 * setuprun - I show the form that initializes match simulation
 */
this.setuprun = function ( req, resp, params ) {
	var self = this;

	var matchList = MatchService.getAvaiableMatch();

	self.respond({params: params, matchList: matchList});
};



/*
 * runmatch - I kick off the match simulation, I am what setuprun submits to
 */
this.runmatch = function ( req, resp, params ) {
	var self = this;

	MatchService.runMatch( params.IDMatch, parseInt(params.commentPushTime) );

	self.respond({params: params});
};

// end controller methods
};
exports.Matches = Matches;