
exports.seed = function(knex, Promise) {
  return knex('service_types').del()
    .then(function () {
      return knex('service_types').insert([
        {id: 1, name: 'taxi standard'},
        {id: 2, name: 'taxi ejecutivo'},
        {id: 3, name: 'taxi camioneta'}
      ]);
    });
};
