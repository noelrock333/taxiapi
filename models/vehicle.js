const bookshelf = require('../bookshelf');
const ServiceType = require('./service_type');

var Vehicle = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'vehicles',
  service_type: function(){
    return this.belongsTo(ServiceType);
  }
});

module.exports = Vehicle;
