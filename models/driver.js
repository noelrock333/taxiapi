const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);

var Driver = bookshelf.Model.extend({
  tableName: 'drivers'
});

module.exports = Driver;
