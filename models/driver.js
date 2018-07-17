const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);

const User = require('./user');

var Driver = bookshelf.Model.extend({
  tableName: 'drivers',
  user: function(){
    return this.belongsTo(User)
  }
});

module.exports = Driver;
