
exports.seed = function(knex, Promise) {
  return knex('drivers').del()
    .then(function () {
      return knex('drivers').insert([
        {id: 1, license_number: '123456A', user_id: 11, vehicle_id: 1},
        {id: 2, license_number: '123456B', user_id: 12, vehicle_id: 2},
        {id: 3, license_number: '123456C', user_id: 13, vehicle_id: 3},
        {id: 4, license_number: '123456D', user_id: 14, vehicle_id: 5},
        {id: 5, license_number: '123456E', user_id: 15, vehicle_id: 6},
        {id: 6, license_number: '123456F', user_id: 16, vehicle_id: 9}
      ]);
    });
  };
