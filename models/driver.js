const bookshelf = require('../bookshelf');
const Vehicle = require('./vehicle');

const Driver = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'drivers',
  user: function(){
    const User = require('./user');
    return this.belongsTo(User)
  },
  vehicle: function(){
    const User = require('./user');
    return this.belongsTo(Vehicle)
  },
  activeTrip: function(){
    const Trip = require('./trip');
    let status = ['taken', 'active'];
    let trip = new Trip({driver_id: this.id})
      .where('status', 'in', status)
      .fetch({withRelated: ['user', 'driver.user','vehicle']});
    return trip
  }
});

module.exports = Driver;
