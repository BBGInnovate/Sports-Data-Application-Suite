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
, debug: true,
, hostname: null
, port: 443
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
 , ssl: {
    key: '/etc/apache2/SSL/soccer-epl-home.voanews.com.key'
  , cert: '/etc/apache2/SSL/soccer-epl-home.voanews.com.crt'
}

/* // Using Postgres as the default, with only a Postgres DB
, model: {
    defaultAdapter: 'postgres'
  }
, db: {
    postgres: {
      user: process.env.USER
    , database: process.env.USER
    , password: null
    , host: null
    , port: 5432
    }
  }
*/

/* // Using MySQL as the default, with only a MySQL DB
, model: {
    defaultAdapter: 'mysql'
  }
, db: {
    mysql: {
      host: 'localhost'
    , user: process.env.USER
    , database: process.env.USER
    , password: null
    }
  }
*/

/* // Using Postgres as the default, with both Postgres and Riak
, model: {
    defaultAdapter: 'postgres'
  }
, db: {
    postgres: {
      user: process.env.USER
    , database: process.env.USER
    , password: null
    , host: null
    , port: 5432
    }
  , riak: {
      protocol: 'http'
    , host: 'localhost'
    , port: 8098
  }
  }
*/
};

module.exports = config;