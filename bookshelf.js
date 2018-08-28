const knex = require('./knex');
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('visibility');
bookshelf.plugin('pagination');

module.exports = bookshelf;
