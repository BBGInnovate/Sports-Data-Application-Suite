/* ****************************************************************************
 * File: 		production.js
 *
 * Purpose: 	I provide production configuration data.
 *
 * Author: 		John Allen ( jallen@figleaf.com )
 *
 * Company: 	Fig Leaf Software
 *************************************************************************** */
var config = {
  appName: 'Sports Data Viewing Application'
, detailedErrors: true
, debug: true
//, hostname: 'soccer-epl-home.voanews.com'
, port: 4000
, model: {
    defaultAdapter: 'filesystem'
} 
, sessions: {
	store: 'filesystem',
	filename: '_session_store.json',
	key: 'sid',
	expiry: 14 * 24 * 60 * 60
  }
 , jsonDirectory : process.cwd() + '/data/json/'
 /*
 , ssl: {
    key: '/etc/apache2/SSL/soccer-epl.voanews.com.key'
    , cert: '/etc/apache2/SSL/soccer-epl-home.voanews.com.crt'
  }
  */
};

module.exports = config;
