
exports.seed = function(knex, Promise) {
  return knex('service_types').del()
    .then(function () {
      return knex('service_types').insert([
        {name: 'taxi standard'}, // id: 1
        {name: 'taxi ejecutivo'}, // id: 2
        {name: 'taxi camioneta'} // id: 3
      ]);
    });
};
