/* ****************************************************************************
 * File: 		ViewUtilities.js
 *
 * Purpose: 	I contain methods that the views need.
 *
 * Author: 		John Allen ( jallen@figleaf.com )
 *
 * Company: 	Fig Leaf Software
 *************************************************************************** */

/* *************************** Required Classes **************************** */
var moment = require('moment');
var SoccerService = require('../../lib/service/SoccerService');


/* *************************** Constructor Code **************************** */
var teamLookUpJSON = SoccerService.getTeamLookUpJSON();
var aggregatedSquadJSON = SoccerService.getAggregagtedSquadJSON();




/* *************************** Public Methods ****************************** */


/**
 * I return a teams lookup and aggregate data.
 *
 * @param {String} id - I am the ID of the team to lookup.
 * @return {Object} team - the team object.
 */
function getTeamByID ( id ) {

	var result = {};

	for (var i = 0; i < teamLookUpJSON.length; i++) {
		if ( teamLookUpJSON[i].IDTeam === id){
			var teamMetaData = teamLookUpJSON[i];
		}
	};

	result.teamMetaData = teamMetaData;

	for (var x = 0; x < aggregatedSquadJSON.length; x++) {
		

		if ( aggregatedSquadJSON[x].id === id){
			var aggregateData = aggregatedSquadJSON[x];
		}

	};	

	result.aggregateData = aggregateData;

	return result;
}
exports.getTeamByID = getTeamByID;







/**
 * I displsy a players abbreviated postition. I am here casue the original
 * json for players didn't have this as a value and it's probally better that
 * it didn't. Don't want view requirements leaking up into the model.
 *
 * @param {string} position - I am the position of the player.
 * @param {object} rb - I am the resource bundle object to get data from.
 * @return {string}
 */
function getPlayerPositionAbbreviated( position, rb ){

	var result = '';

	if (position === 'Forward'){
		result = rb.get('forwardAbbr');
	}
	if (position === 'Midfielder'){
		result = rb.get('midfielderAbbr');
	}
	if (position === 'Defender'){
		result = rb.get('defenderAbbr');
	}
	if (position === 'Goalkeeper'){
		result = rb.get('goalkeeperAbbr');
	}

	return result;
}
exports.getPlayerPositionAbbreviated = getPlayerPositionAbbreviated;



/**
 * I return a the year difference now and a date.
 *
 * @param {string} dateString - I am the date to find the difference by.
 * @return {void}
 */
function getYearDifference( dateString ){

	var startTime = moment(dateString);
	var nowTime = moment(new Date());
	var diff = moment(nowTime).diff(moment(startTime));
	var result = moment.duration(diff)._data.years;

	return result;
}
exports.getYearDifference = getYearDifference;



/**
 * I return date formated to display as someones BDAY!.
 *
 * @param {string} dateString - I am the date to find the difference by.
 * @return {void}
 */
function formatBirtdate( dateString ){

	return moment(dateString).format('MMM D, YYYY');
}
exports.formatBirtdate = formatBirtdate;



/**
 * I return a UUID.
 *
 * @param {string} language - I am language. I default to 'english'.
 * @return {void}
 */
function getUUID(  ){
	var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
}
exports.getUUID = getUUID;

/* *************************** Private Methods ***************************** */