/* ****************************************************************************
 * File: 		environment.js
 *
 * Purpose: 	I provide GLOBAL configuration data for all modes: developent
 *				and production.
 *
 * Author: 		John Allen ( jallen@figleaf.com )
 *
 * Company: 	Fig Leaf Software
 *************************************************************************** */
var engagementConfig = require('../../sportsdataprovider/EngagementConfig');

var config = {
	generatedByVersion: '0.12.12',
	jsonDirectory : process.cwd() + '/data/json',
	fayeClientURL : engagementConfig.fayClientURL
};

module.exports = config;