
exports.seed = function(knex, Promise) {
  return knex('organizations').del()
    .then(function () {
      return knex('organizations').insert([
        {name: 'Libertad'}, // id: 1
        {name: 'Aldama'}, // id: 2
        {name: 'Trapiche1'}, // id: 3
        {name: 'Trapiche2'},// id: 4
        {name: 'Buena Vista'}, // id: 5
        {name: 'Nuñes'}, // id: 6
        {name: 'La Villa'} // id: 7
      ]);
    });
};
