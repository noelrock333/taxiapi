const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);

var Trip = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'trips'
});

module.exports = Trip;
