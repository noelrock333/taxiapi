exports.up = async function(knex, Promise) {
  await knex.raw("CREATE EXTENSION IF NOT EXISTS postgis");
  await knex.schema.createTable("locations", function(t) {
    t.increments("id").primary();
    t.float("longitude");
    t.float("latitude");
    t.specificType("coordinate", "GEOGRAPHY");
    t.integer("user_id").unsigned().notNullable();
    t.foreign("user_id")
      .references("id")
      .inTable("users");
    t.timestamp("reported_at").defaultTo(knex.fn.now());
    t.timestamps();

    t.index("reported_at");
    t.index("coordinate", "coordinate_ix", "GIST");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("blacklist");
};
