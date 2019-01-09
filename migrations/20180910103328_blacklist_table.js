
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('blacklist', function (t) {
      t.increments('id').primary();
      t.integer('driver_id').unsigned().notNullable();
      t.unique('driver_id');
      t.string('reason');

      t.foreign('driver_id').onDelete('CASCADE').references('id').inTable('drivers');
      t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
		.dropTableIfExists('blacklist');
};
