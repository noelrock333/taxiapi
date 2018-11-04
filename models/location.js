const bookshelf = require('../bookshelf');

const Location = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'locations',
  geography: {
    coordinate: ['postgis_lat', 'postgis_long']
  },
  user: function(){
    const User = require('./user');
    return this.belongsTo(User)
  },
  driver: function(){
    const Driver = require('./driver');
    return this.belongsTo(Driver)
  }
});

module.exports = Location;
