'use strict';
console.log('Getting knex');

var knex = require('./knex')({
  client: 'mongo',
  connection: {
    host: '127.0.0.1',
    user: 'shankhs',
    database: 'passport'
  }
});
/*
var knex = require('./knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'shankhs',
    password: '2ghAWDbc',
    database: 'knex_test'
  }
});
*/
//debugger;
console.log('got knex');
/*
knex.raw('select * from accounts where email is not NULL').then(
  function(rows) {
    for (var i = 0; i < rows.length; i++) {
      console.log(rows[i]);
      debugger;
    }
    console.log(rows.length);
    return;
  }

).catch(function(error) {
  console.error(error);
});
*/
/*knex.schema.createTable('users', function(table) {
  console.log('creating tables');
  table.increments('id');
  table.string('user_name');
}).then (function(msg){
  console.log('Completed creation');
  console.log(msg);
  return {inserted: true};
}).finally(function(){
  knex.destroy();
});*/
knex.schema.createTable('users', function(table) {
  console.log('creating tables');
  table.increments('id');
  table.string('user_name');
}).then (function(msg){
  console.log('Completed creation');
  console.log(msg);
  return {inserted: true};
}).finally(function(){
  knex.destroy();
});
