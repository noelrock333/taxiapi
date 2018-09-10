const bookshelf = require('../bookshelf');

const BlackList = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'blacklist'
});

module.exports = BlackList;
