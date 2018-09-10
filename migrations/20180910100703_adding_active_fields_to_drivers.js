
exports.up = function(knex, Promise) {
  return knex.schema.table('drivers', table => {
    table.boolean('active').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('drivers', table => {
    table.dropColumn('active');
  });
};
