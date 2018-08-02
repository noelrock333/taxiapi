
exports.seed = function(knex, Promise) {
  return knex('vehicles').del()
    .then(function () {
      return knex('vehicles').insert([
        {
          //id: 1
          organization: 'Libertad',
          license_plate: '123456A',
          number: '1',
          model: 'Sentra sedan',
          year: '2000',
          service_type_id: 1
        },
        {
          //id: 2
          organization: 'Nuñes',
          license_plate: '123456B',
          number: '2',
          model: 'Sentra sedan',
          year: '2000',
          service_type_id: 1
        },
        {
          //id: 3
          organization: 'Libertad',
          license_plate: '123456C',
          number: '45',
          model: 'Sentra sedan',
          year: '2000',
          service_type_id: 1
        },
        {
          //id: 4
          organization: 'Libertad',
          license_plate: '123456D',
          number: '12',
          model: 'Chevy',
          year: '1995',
          service_type_id: 2
        },
        {
          //id: 5
          organization: 'Libertad',
          license_plate: '123456E',
          number: '13',
          model: 'Chevy',
          year: '1995',
          service_type_id: 2
        },
        {
          //id: 6
          organization: 'Libertad',
          license_plate: '123456F',
          number: '14',
          model: 'Chevy',
          year: '1995',
          service_type_id: 2
        },
        {
          //id: 7
          organization: 'Libertad',
          license_plate: '123456G',
          number: '19',
          model: 'Lobo',
          year: '2005',
          service_type_id: 3
        },
        {
          //id: 8
          organization: 'Libertad',
          license_plate: '123456H',
          number: '13',
          model: 'Lobo',
          year: '2005',
          service_type_id: 3
        },
        {
          //id: 9
          organization: 'Libertad',
          license_plate: '123456I',
          number: '14',
          model: 'Lobo',
          year: '2005',
          service_type_id: 3
        }
      ]);
    });
};
