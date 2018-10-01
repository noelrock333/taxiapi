
exports.up = function(knex, Promise) {
  return knex.schema.table('drivers', table => {
    table.boolean('active').defaultTo(false);
    table.boolean('push_notifications').defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('drivers', table => {
    table.dropColumn('active');
    table.dropColumn('push_notifications');
  });
};
