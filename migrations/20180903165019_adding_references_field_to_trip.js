
exports.up = function(knex, Promise) {
  return knex.schema.table('trips', table => {
    table.string('references');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('trips', table => {
    table.dropColumn('references');
  });
};
