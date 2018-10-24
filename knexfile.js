// Update with your config settings.
module.exports = {
    development: {
      client: 'postgresql',
      debug: false,
      connection: process.env.DATABASE_URL || 'postgres://postgres@127.0.0.1:5432/taxidb',
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    },
  
    sandbox: {
      client: 'postgresql',
      connection: process.env.DATABASE_URL,
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    },

    test: {
      client: 'postgresql',
      connection: process.env.DATABASE_URL,
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    },
  
    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        pool: {
        min: 10,
        max: 60
        },
        migrations: {
        tableName: 'knex_migrations'
        },
        ssl: true
    }
};
  