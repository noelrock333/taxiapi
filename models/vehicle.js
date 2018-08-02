const bookshelf = require('../bookshelf');
const ServiceType = require('./service_type');
const Organization = require('./organization');

const Vehicle = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'vehicles',
  service_type: function(){
    return this.belongsTo(ServiceType);
  },
  organization: function(){
    return this.belongsTo(Organization);
  }
});

module.exports = Vehicle;
