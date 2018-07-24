const bookshelf = require('../bookshelf');

const Trip = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'trips',
  user: function(){
    const User = require('./user');
    return this.belongsTo(User)
  },
  driver: function(){
    const Driver = require('./driver');
    return this.belongsTo(Driver)
  },
  vehicle: function(){
    const Vehicle = require('./vehicle');
    return this.belongsTo(Vehicle)
  }
});

module.exports = Trip;
