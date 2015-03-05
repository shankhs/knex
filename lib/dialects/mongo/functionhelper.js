'use strict';

module.exports = function(client) {

var FunctionHelper = require('../../functionhelper');

var FunctionHelper_Mongo = Object.create(FunctionHelper);
FunctionHelper_Mongo.client = client;

// Assign the newly extended `FunctionHelper` constructor to the client object.
client.FunctionHelper = FunctionHelper_Mongo;

};
