'use strict';

module.exports = function(client) {

  var Pool = require('../../pool');
  var inherits = require('inherits');
  var _ = require('lodash');

  // Inherit from the `Pool` constructor's prototype.
  function Pool_Mongo() {
    this.client = client;
    Pool.apply(this, arguments);
  }
  inherits(Pool_Mongo, Pool);

  Pool_Mongo.prototype.defaults = function() {
    var pool = this;
    return _.extend(Pool.prototype.defaults.call(this), {
      max: 1,
      min: 1,
      create: function(callback) {
        debugger;
        pool.client.acquireRawConnection();
      }
    });
  };

  // Assign the newly extended `Pool` constructor to the client object.
  client.Pool = Pool_Mongo;

};
