
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('blacklist', function (t) {
      t.increments('id').primary();
      t.integer('driver_id').unsigned().notNullable();
      t.unique('driver_id');

      t.foreign('driver_id').references('id').inTable('drivers');
      t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
		.dropTableIfExists('blacklist');
};
