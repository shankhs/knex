'use strict';

// Mongo Schema Builder & Compiler
// -------
module.exports = function(client) {

var inherits = require('inherits');
var Schema = require('../../../schema');

// Schema Builder
// -------

function SchemaBuilder_Mongo() {
  this.client = client;
  console.log('arguments in builder: ');
  console.log(arguments);
  Schema.Builder.apply(this, arguments);
}
inherits(SchemaBuilder_Mongo, Schema.Builder);

// Schema Compiler
// -------

function SchemaCompiler_Mongo() {
  this.client = client;
  this.Formatter = client.Formatter;
  console.log('arguments in compiler: ');
  console.log(arguments);
  Schema.Compiler.apply(this, arguments);
}
inherits(SchemaCompiler_Mongo, Schema.Compiler);

// Rename a table on the schema.
SchemaCompiler_Mongo.prototype.renameTable = function(tableName, to) {
  this.pushQuery('rename table ' + this.formatter.wrap(tableName) + ' to ' + this.formatter.wrap(to));
};

// Check whether a table exists on the query.
SchemaCompiler_Mongo.prototype.hasTable = function(tableName) {
  this.pushQuery({
    sql: 'show tables like ' + this.formatter.parameter(tableName),
    output: function(resp) {
      return resp.length > 0;
    }
  });
};

// Check whether a column exists on the schema.
SchemaCompiler_Mongo.prototype.hasColumn = function(tableName, column) {
  this.pushQuery({
    sql: 'show columns from ' + this.formatter.wrap(tableName) +
      ' like ' + this.formatter.parameter(column),
    output: function(resp) {
      return resp.length > 0;
    }
  });
};

client.SchemaBuilder = SchemaBuilder_Mongo;
client.SchemaCompiler = SchemaCompiler_Mongo;
};
