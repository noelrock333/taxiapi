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
    const Vehicle = require('./vehicle');
    return this.belongsTo(Vehicle)
  },
  trip: function(){
    const Trip = require('./trip');
    return this.hasMany(Trip)
  },
  activeTrip: function(){
    const Trip = require('./trip');
    let status = ['taken', 'active'];
    let trip = new Trip({driver_id: this.id})
      .where('status', 'in', status)
      .fetch({withRelated: ['user', 'driver.user','vehicle']});
    return trip
  },tripsInRange: async function(lat, lon){
    const geodist = require('geodist');
    const Trip = require('./trip');

    const geodistOptions = {exact: true, unit: 'km'};
    let trips = await new Trip().where('status', 'holding').fetchAll({withRelated: ['user']});
    trips = trips.toJSON();
    const origin_coords = {lat, lon};
    const availableTrips = trips.map((trip) => {
      let destiny_coords = {lat: trip.lat_origin, lon: trip.lng_origin};
      let distance = geodist(origin_coords, destiny_coords, geodistOptions)
      if (distance < 4) {
        return (
          {
            id: trip.id,
            address_origin: trip.address_origin,
            user: trip.user,
            distance
          }
        )
      }
    });
    return availableTrips.filter((item) => item != null);
  }
});

module.exports = Driver;
