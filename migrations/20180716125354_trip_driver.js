
exports.up = function(knex, Promise) {
  return knex.schema
        .createTable('vehicles', function (t) {
          t.increments('id').primary();
          t.string('organization').notNullable();
          t.string('license_plate').notNullable();
          t.string('number').notNullable();
          t.string('model').notNullable();
          t.string('year').notNullable();
          t.unique('license_plate')

          t.timestamps();
        })
        .createTable('drivers', function (t) {
          t.increments('id').primary();
          t.string('license_number').notNullable();
          t.enu('status', ['free','busy']).defaultTo('free');
          t.integer('rate').defaultTo(0);
          t.integer('user_id').unsigned().notNullable();
          t.integer('vehicle_id').unsigned()
          t.unique('license_number');

          t.foreign('user_id').references('id').inTable('users');
          t.foreign('vehicle_id').references('id').inTable('vehicles')

          t.timestamps();
        })
        .createTable('trips', function (t) {
          t.increments('id').primary();
          t.enu('status', ['holding','active','finished']).defaultTo('active');
          t.text('address_origin');
          t.string('lat_origin');
          t.string('lng_origin');
          t.text('address_destination');
          t.string('lat_destination');
          t.string('lng_destination');
          t.integer('rate').defaultTo(0);
          t.text('comment');
          t.integer('user_id').unsigned().notNullable();
          t.integer('driver_id').unsigned().notNullable();
          t.integer('vehicle_id').unsigned().notNullable();

          t.foreign('user_id').references('id').inTable('users');
          t.foreign('driver_id').references('id').inTable('drivers');
          t.foreign('vehicle_id').references('id').inTable('vehicles');

          t.timestamps();
        });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('trips')
    .dropTableIfExists('drivers')
    .dropTableIfExists('vehicles');
};
