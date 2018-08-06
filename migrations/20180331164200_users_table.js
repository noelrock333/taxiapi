
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('users', function (t) {
            t.increments('id').primary();
            t.string('email', 40);
            t.string('password_hash', 254);
            t.string('full_name', 25);
            t.string('device_id');
            t.unique('email');

            t.timestamps();
        });
};

exports.down = function (knex, Promise) {
	return knex.schema
		.dropTableIfExists('users');
};
