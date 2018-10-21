
exports.up = function (knex, Promise) {
    return knex.raw('CREATE VIEW driversView AS SELECT drivers.*,  users.full_name, users.email FROM drivers '+
    'LEFT JOIN users '+
    'ON drivers.user_id = users.id')   
};

exports.down = function (knex, Promise) {
	return knex.raw('DROP VIEW driversView');
};
