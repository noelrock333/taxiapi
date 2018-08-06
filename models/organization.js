const bookshelf = require('../bookshelf');

const Organization = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'organizations'
});

module.exports = Organization;
