/* ****************************************************************************
 * File: 		soccer.js
 *
 * Purpose: 	I am the soccer view controller.
 *
 * Author: 		John Allen ( jallen@figleaf.com )
 *
 * Company: 	Fig Leaf Software
 *************************************************************************** */

/* *************************** Required Classes **************************** */
var SoccerService = require('../../lib/service/SoccerService');
var moment = require('moment');

/* ************************** Controller Methods *************************** */
var Soccer = function () {
this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

/*
 * index - I am the default action for this controller. Check the view to
 *         see what I can display based on query string variables. I should 
 *		   always return game and commentary JSON.
 */
this.index = function ( req, resp, params ) {
	var self = this;

	var json = SoccerService.getGame( params.IDGame );

	self.respond({ params: params, gameData: json });
};



/*
 * player - I get a players JSON and display it.
 */
this.player = function ( req, resp, params ) {
	var self = this;

	var json = SoccerService.getPlayer( params.IDPlayer );

	self.respond({ params: params, player: json });
};



/*
 * schedule - I get the schedule JSON and display it.
 */
this.schedule = function ( req, resp, params ) {
	var self = this;

	var json = SoccerService.getSchedule();

	self.respond({ params: params, schedule: json, moment : moment });
};



/*
 * squad - I get a squads JSON and display it.
 */
this.squad = function ( req, resp, params ) {
	var self = this;

	var json = SoccerService.getSquad( params.IDTeam );

	self.respond({ params: params, squad: json });
};



// end controller methods
};
exports.Soccer = Soccer;
/* *************************** Private Methods ***************************** */