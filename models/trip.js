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
  },
  cancelTrip: async function(){
    const now = Date.now();
    const tripTime = new Date(this.toJSON().updated_at).getTime();
    const comparisonTime = ((now - tripTime) / 1000) / 60;
    if (this.toJSON().status == 'holding' || (this.toJSON().status == 'active' && comparisonTime <= 1.5)){
      return await this.save({status: 'canceled'},{patch: true});
    }
    return this
  },
  holdingTrips: function(){
    return this.where({status: 'holding'}).fetchAll();
  },
  takenTrips: function(){
    return this.where({status: 'active'}).fetchAll();
  }
});

module.exports = Trip;
