var config = {
  appName: 'Soccer Sumulation'
, detailedErrors: false
, hostname: null
, port: 4000
, model: {
    defaultAdapter: 'mongo'
  }
, db: {
    mongo: {
      username: null
    , dbname: 'production'
    , prefix: null
    , password: null
    , host: 'localhost'
    , port: 27017
    }
  }

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
};

module.exports = config;