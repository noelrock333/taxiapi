
exports.seed = function(knex, Promise) {
  return knex('vehicles').del()
    .then(function () {
      return knex('vehicles').insert([
        {
          //id: 1
          number: '1',
          service_type_id: 1,
          organization_id: 1
        },
        {
          //id: 2
          number: '2',
          service_type_id: 1,
          organization_id: 6
        },
        {
          //id: 3
          number: '45',
          service_type_id: 1,
          organization_id: 1
        },
        {
          //id: 4
          number: '12',
          service_type_id: 2,
          organization_id: 1
        },
        {
          //id: 5
          number: '13',
          service_type_id: 2,
          organization_id: 1
        },
        {
          //id: 6
          number: '14',
          service_type_id: 2,
          organization_id: 1
        },
        {
          //id: 7
          number: '19',
          service_type_id: 3,
          organization_id: 1
        },
        {
          //id: 8
          number: '13',
          service_type_id: 3,
          organization_id: 1
        },
        {
          //id: 9
          number: '14',
          service_type_id: 3,
          organization_id: 1
        }
      ]);
    });
};
