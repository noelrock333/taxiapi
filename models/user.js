const bookshelf = require('../bookshelf');

const User = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'users',
  trips: function(){
    const Trip = require('./trip');
    return this.hasMany(Trip);
  },
  activeTrip: function(){
    const Trip = require('./trip');
    let status = ['holding', 'taken', 'active'];
    let trip = new Trip({user_id: this.id})
      .where('status', 'in', status)
      .fetch({withRelated: ['user', 'driver.user','vehicle']});
    return trip
  },
  missingRates: function(){
    const Trip = require('./trip');
    let trip = new Trip({user_id: this.id})
      .where({status: 'finished', rate: 0})
      .fetchAll();
    return trip
  }
});

module.exports = User;
