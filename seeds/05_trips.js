
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('trips').del()
    .then(function () {
      // Inserts seed entries
      return knex('trips').insert([
        {
          // id: 1
          address_origin: 'Direccion 1 #3000 col. Buena Vista',
          lat_origin: '19.264988',
          lng_origin: '-103.718204',
          user_id: 1,
          created_at: '2018-07-27T17:59:17.082Z'
        },
        {
          // id: 2
          address_origin: 'Direccion 2 #3000 col. Buena Vista',
          lat_origin: '19.255678',
          lng_origin: '-103.719818',
          user_id: 2,
          created_at: '2018-07-27T17:59:17.082Z'
        },
        {
          // id: 3
          address_origin: 'Direccion 3 #3000 col. Buena Vista',
          lat_origin: '19.252040',
          lng_origin: '-103.722480',
          user_id: 3,
          created_at: '2018-07-27T17:59:17.082Z'
        },
        {
          // id: 4
          address_origin: 'Direccion 4 #3000 col. Buena Vista',
          lat_origin: '19.249902',
          lng_origin: '-103.732423',
          user_id: 4,
          created_at: '2018-07-27T17:59:17.082Z'
        },
        {
          // id: 5
          address_origin: 'Ignacio sandoval #3000 col. Buena Vista',
          lat_origin: '19.262549',
          lng_origin: '-103.704608',
          user_id: 5,
          created_at: '2018-07-27T17:59:17.082Z'
        },
        {
          // id: 6
          address_origin: 'Zentralia #3000 col. Buena Vista',
          lat_origin: '19.265729',
          lng_origin: '-103.697904',
          user_id: 6,
          created_at: '2018-07-27T17:59:17.082Z'
        },
      ]);
    });
};
