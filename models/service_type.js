const bookshelf = require('../bookshelf');

const ServiceType = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'service_types'
});

module.exports = ServiceType;
