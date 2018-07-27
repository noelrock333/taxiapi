const knex = require('./knex');
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('visibility');

module.exports = bookshelf;
