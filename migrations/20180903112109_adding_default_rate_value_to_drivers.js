
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('drivers', table => {
    table.integer('rate').defaultTo(5).alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('drivers', table => {
    table.integer('rate').defaultTo(0).alter();
  });
};
