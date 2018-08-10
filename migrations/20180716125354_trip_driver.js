
exports.up = function(knex, Promise) {
  return knex.schema
        .createTable('service_types', function(t) {
          t.increments('id').primary();
          t.string('name').notNullable();

          t.timestamps();
        })
        .createTable('organizations', function(t) {
          t.increments('id').primary();
          t.string('name').notNullable();

          t.timestamps();
        })
        .createTable('vehicles', function (t) {
          t.increments('id').primary();
          t.string('license_plate');
          t.string('number').notNullable();
          t.string('model');
          t.string('year');
          t.integer('service_type_id').unsigned().notNullable();
          t.integer('organization_id').unsigned().notNullable();

          t.foreign('service_type_id').references('id').inTable('service_types');
          t.foreign('organization_id').references('id').inTable('organizations');
          t.unique('license_plate');
          t.timestamps();
        })
        .createTable('drivers', function (t) {
          t.increments('id').primary();
          t.string('license_number').notNullable();
          t.string('public_service_permission_image')
          t.enu('status', ['free','busy']).defaultTo('free');
          t.integer('rate').defaultTo(0);
          t.integer('user_id').unsigned().notNullable();
          t.integer('vehicle_id').unsigned();

          t.unique('license_number');

          t.foreign('user_id').references('id').inTable('users');
          t.foreign('vehicle_id').references('id').inTable('vehicles')

          t.timestamps();
        })
        .createTable('trips', function (t) {
          t.increments('id').primary();
          t.enu('status', ['holding','taken','active','finished', 'canceled']).defaultTo('holding');
          t.text('address_origin').notNullable();;
          t.string('lat_origin').notNullable();;
          t.string('lng_origin').notNullable();;
          t.text('address_destination');
          t.string('lat_destination');
          t.string('lng_destination');
          t.integer('rate').defaultTo(0);
          t.text('comment');
          t.integer('user_id').unsigned().notNullable();
          t.integer('driver_id').unsigned();
          t.integer('vehicle_id').unsigned();

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
  .dropTableIfExists('vehicles')
  .dropTableIfExists('organizations')
  .dropTableIfExists('service_types');
};
