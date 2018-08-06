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
  },
  findOrCreate: async function(number, organization_id, service_type_id){
    let vehicle = await this.where({number, organization_id, service_type_id}).fetch();
    if (!vehicle){
        vehicle = await this.save({number, organization_id, service_type_id});
    }
    return vehicle;
  }
});

module.exports = Vehicle;
