const bookshelf = require('../bookshelf');

const User = require('./user');
const Vehicle = require('./vehicle');

var Driver = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'drivers',
  user: function(){
    return this.belongsTo(User)
  },
  vehicle: function(){
    return this.belongsTo(Vehicle)
  }
});

module.exports = Driver;
