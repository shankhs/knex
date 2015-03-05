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
    // No pooling as of now
    // TODO: add pooling later
  }
}

inherits(Client_Mongo, Client);

// The "dialect", for reference elsewhere.
Client_Mongo.prototype.dialect = 'mongo';

// Lazy-load the mongo dependency, since we might just be
// using the client to generate query strings.
Client_Mongo.prototype.initDriver = function() {
  mongo = mongo || require('mongoose');
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
  debugger;
  require('../../mysql/pool')(this);
};

// Initialize the query "runner"
Client_Mongo.prototype.initRunner = function() {
  require('./runner')(this);
};

// Lazy-load the schema dependencies; we may not need to use them.
Client_Mongo.prototype.initSchema = function() {
  require('../mysql/schema')(this);
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

// Get a raw connection, called by the `pool` whenever a new
// connection needs to be added to the pool.
Client_Mongo.prototype.acquireRawConnection = function() {
  var client = this;
  console.log(this.connectionSettings);
  var connection = mongo.createConnection(this.connectionSettings);
  this.databaseName = connection.config.database;
  return new Promise(function(resolver, rejecter) {
    connection.connect(function(err) {
      if (err) return rejecter(err);
      connection.on('error', connectionErrorHandler.bind(null, client, connection));
      connection.on('end', connectionErrorHandler.bind(null, client, connection));
      resolver(connection);
    });
  });
};

// Used to explicitly close a connection, called internally by the pool
// when a connection times out or the pool is shutdown.
Client_Mongo.prototype.destroyRawConnection = function(connection) {
  connection.end();
};

module.exports = Client_Mongo;
