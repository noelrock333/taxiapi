const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);
const User = require('./user');
const Driver = require('./driver');
const Vehicle = require('./vehicle');

var Trip = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'trips',
  user: function(){
    return this.belongsTo(User);
  },
  driver: function(){
    return this.belongsTo(Driver);
  },
  vehicle: function(){
    return this.belongsTo(Vehicle);
  }
});

module.exports = Trip;
