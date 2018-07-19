const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);

var ServiceType = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'service_types'
});

module.exports = ServiceType;
