
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', table => {
    table.string('full_name', 100).alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', table => {
    table.string('full_name', 25).alter();
  });
};
