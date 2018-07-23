const bookshelf = require('../bookshelf');

var ServiceType = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'service_types'
});

module.exports = ServiceType;
