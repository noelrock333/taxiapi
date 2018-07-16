var knexFile = require('./knexfile.js');
var environment = process.env.NODE_ENV || 'development';
var knex = require('knex')(knexFile[environment]);

module.exports = knex;