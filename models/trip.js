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
  tripsInRange: async function(lat, lon){
    const geodist = require('geodist');
    const geodistOptions = {exact: true, unit: 'km'};
    let trips = await this.where('status', 'holding').fetchAll({withRelated: ['user']});
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

module.exports = Trip;
