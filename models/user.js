const bookshelf = require('../bookshelf');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');

const User = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'users',
  hidden: ['password_hash'],
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
  },
  storeDeviceId: async function(device_id){
    return await this.save({device_id},{patch: true});
  },
  findOrCreate: async function (args){
    const User = require('./user');
    const {email, password, full_name, provider} = args;
    let user = await new User({email: email}).fetch();
    if (user) return user;
    if (provider){
      var password_hash = SHA256(`${password}`).toString();
      user = await new User({ email, password_hash, full_name }).save();
    }
    return user
  },
  login: async function(password, device_id) {
    const password_hash = SHA256(`${password}`).toString();
    user_password = this.toJSON({visibility: false}).password_hash;
    if (user_password === password_hash){
      let user = this;
      if (device_id) user = await user.storeDeviceId(device_id);
      user = user.toJSON();
      const token = authToken.encode({
        id: user.id,
        email: user.email,
        role: 'customer'
      });
      return token
    }
    return null
  }
});

module.exports = User;
