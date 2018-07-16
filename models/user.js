const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users'
});

module.exports = User;
