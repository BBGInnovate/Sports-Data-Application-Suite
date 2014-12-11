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
var util = require('util');

/* ************************** Controller Methods *************************** */
var Soccer = function () {
this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];


/*
 * index - I am the default action for this controller. Check the view to
 *         see what I can display based on query string variables. I should 
 *		   always return game and commentary JSON.
 */
this.game = function ( req, resp, params ) {
	var self = this;

	var json = SoccerService.getGame( params.IDGame );

	self.respond({ params: params, gameData: json });
};




/*
 * index - I am the default action for this controller. Check the view to
 *         see what I can display based on query string variables. I should 
 *		   always return game and commentary JSON.
 */
this.currentgame = function ( req, resp, params ) {
	var self = this;

	var json = SoccerService.getCurrentGames();
	
	self.respondTo({
		json: function () {
			self.respond(json, {format: 'json'});
	    }
	});

	//self.respond({ params: params, gameData: json, format : json });
};


/*
 * index - I am the default action for this controller. Check the view to
 *         see what I can display based on query string variables. I should 
 *		   always return game and commentary JSON.
 */
this.index = function ( req, resp, params ) {
	var self = this;

	var json = SoccerService.getCurrentGames();

	if(util.isArray(json) && !json.length){
		self.redirect('/soccer/schedule');
	}

	self.respond({ params: params, currentGameArray: json });
};



/*
 * player - I get a players JSON and display it.
 */
this.player = function ( req, resp, params ) {
	var self = this;

	var json = {};
	var displayPlayer = true;

	// try to read the file. If it fails the view will handle the display.
	try {
		var json = SoccerService.getPlayer( params.IDPlayer );
	} catch ( e ) {
		displayPlayer = false;
	}

	self.respond({ params: params, player: json, displayPlayer : displayPlayer });
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

/*
 * squads - I get a squads JSON and display it.
 */
this.squads = function ( req, resp, params ) {
	var self = this;

	var json = SoccerService.getSquadArray();

	self.respond({ params: params, squadArray: json });
};


/*
 * widget - I am the default action for this controller. Check the view to
 *         see what I can display based on query string variables. I should
 *		   always return game and commentary JSON.
 */
this.widget = function ( req, resp, params ) {
	var self = this;

	var json = SoccerService.getGame( params.IDGame );

	self.respond({ params: params, gameData: json });
};


// end controller methods
};
exports.Soccer = Soccer;
/* *************************** Private Methods ***************************** */