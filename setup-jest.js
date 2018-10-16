const knexCleaner = require('knex-cleaner')
const bookshelf = require('./bookshelf')
beforeAll(async () => {
  await knexCleaner.clean(bookshelf.knex, {
    mode: "truncate",
    ignoreTables: ['knex_migrations']
  })
})
