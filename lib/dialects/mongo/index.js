'use strict';

// Mongo client
// ------------

var inherits = require('inherits');
var _ = require('lodash');
var Client = require('../../client');
var Promise = require('../../promise');

var mongo;

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
function Client_Mongo(config) {
  Client.apply(this, arguments);
  if (config.debug) this.isDebugging = true;
  if (config.connection) {
    this.initDriver();
    this.initRunner();
    this.connectionSettings = _.clone(config.connection);
    this.initPool();
    this.pool = new this.Pool(config.pool);
  }
}

inherits(Client_Mongo, Client);

// The "dialect", for reference elsewhere.
Client_Mongo.prototype.dialect = 'mongo';

// Lazy-load the mongo dependency, since we might just be
// using the client to generate query strings.
Client_Mongo.prototype.initDriver = function() {
  mongo = mongo || require('mongodb').MongoClient;
};

// Attach a `Formatter` constructor to the client object.
Client_Mongo.prototype.initFormatter = function() {
  require('./formatter')(this);
};

// Attaches the `Raw` constructor to the client object.
Client_Mongo.prototype.initRaw = function() {
  require('./raw')(this);
};

// Attaches the `FunctionHelper` constructor to the client object.
Client_Mongo.prototype.initFunctionHelper = function() {
  require('./functionhelper')(this);
};

// Attaches the `Transaction` constructor to the client object.
Client_Mongo.prototype.initTransaction = function() {
  require('./transaction')(this);
};

// Attaches `QueryBuilder` and `QueryCompiler` constructors
// to the client object.
Client_Mongo.prototype.initQuery = function() {
  require('./query')(this);
};

// Initializes a new pool instance for the current client.
Client_Mongo.prototype.initPool = function() {
  require('./pool')(this);
};

// Initialize the query "runner"
Client_Mongo.prototype.initRunner = function() {
  require('./runner')(this);
};

// Lazy-load the schema dependencies; we may not need to use them.
Client_Mongo.prototype.initSchema = function() {
  require('./schema')(this);
};

// Lazy-load the migration dependency
Client_Mongo.prototype.initMigrator = function() {
  require('./migrator')(this);
};

// Lazy-load the seeding dependency
Client_Mongo.prototype.initSeeder = function() {
  require('./seeder')(this);
};

// Mongo Specific error handler
function connectionErrorHandler(client, connection, err) {
  if (connection && err && err.fatal) {
    if (connection.__knex__disposed) return;
    connection.__knex__disposed = true;
    client.pool.genericPool.destroy(connection);
  }
}

// Create the URI of the mongo database to be used
// while acquiring connections
function createUri (config){
  debugger;
  var uri = 'mongodb://';
  if (!_.isEmpty(config.user)) {
    uri += config.user;
  } else {
    //throw new Error('createUri(config): User not in config');
  }
  if (!_.isEmpty(config.password)) {
    uri += ':' + config.password;
  } else {
    uri += '@';
  }
  if (!_.isEmpty(config.host)) {
    uri = uri + config.host;
  } else {
  //  throw new Error('createUri(config): host not in config');
  }
  var port = 27017;
  if (!_.isEmpty(config.port)) {
    port = config.port;
  }
  uri += ':' + port;
  if (!_.isEmpty(config.database)) {
    uri = uri + '/' + config.database;
  } else {
//    throw new Error('createUri(config): database name is missing in config');
  }
  console.log('uri to connect mongo: '+uri); 
  return uri;
};

// Get a raw connection, called by the `pool` whenever a new
// connection needs to be added to the pool.
Client_Mongo.prototype.acquireRawConnection = function() {
  var client = this;
  console.log(this.connectionSettings);
  debugger;
  mongo.connect(createUri(this.connectionSettings), function(err, db){
    if(err!=null){
      console.log(err);
    }
  });
  this.databaseName = this.connectionSettings.database;
  return mongo;
};

// Used to explicitly close a connection, called internally by the pool
// when a connection times out or the pool is shutdown.
Client_Mongo.prototype.destroyRawConnection = function(connection) {
  connection.end();
};

module.exports = Client_Mongo;
