const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);

var Vehicle = bookshelf.Model.extend({
  tableName: 'vehicles'
});

module.exports = Vehicle;
