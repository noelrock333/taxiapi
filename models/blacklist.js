const bookshelf = require('../bookshelf');

const BlackList = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'blacklist',
  driver: function(){
    const Driver = require('./driver');
    return this.belongsTo(Driver)
  }
});

module.exports = BlackList;
