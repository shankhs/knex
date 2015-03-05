'use strict';

// Mongo Transaction
// ------
module.exports = function(client) {

var inherits = require('inherits');
var Transaction = require('../../transaction');

function Transaction_Mongo() {
  this.client = client;
  Transaction.apply(this, arguments);
}
inherits(Transaction_Mongo, Transaction);

client.Transaction = Transaction_Mongo;

};
