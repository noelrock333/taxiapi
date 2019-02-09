
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('trips', table => {
    table.string('guid', 40);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('trips', table => {
    table.dropColumn('guid');
  });
};
