const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);

var Vehicle = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'vehicles'
});

module.exports = Vehicle;
