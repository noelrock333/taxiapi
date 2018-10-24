const Bookshelf = require('../bookshelf')

const DriversView = Bookshelf.Model.extend({
  tableName: 'driversview',
  user: function(){
    const User = require('./user');
    return this.belongsTo(User)
  },
  vehicle: function(){
    const Vehicle = require('./vehicle');
    return this.belongsTo(Vehicle)
  }
})

module.exports = DriversView