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
var config = {
	generatedByVersion: '0.12.12',
	jsonDirectory : process.cwd() + '/data/json/soccer/worldcup2014',
	fayeClientURL : 'http://127.0.0.1:8000/faye'
};

console.log(config.jsonDirectory);

module.exports = config;