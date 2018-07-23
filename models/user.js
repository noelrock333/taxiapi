const bookshelf = require('../bookshelf');

var User = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'users'
});

module.exports = User;
