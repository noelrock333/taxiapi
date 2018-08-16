
exports.seed = function(knex, Promise) {
  return knex('drivers').del()
    .then(function () {
      return knex('drivers').insert([
        {
          // id: 1
          license_number: '123456A',
          public_service_permission_image: 'uploads/driver_service_permission_images/default_driver_permission.png',
          phone_number: '3131356475',
          user_id: 11,
          vehicle_id: 1
        },
        {
          // id: 2
          license_number: '123456B',
          public_service_permission_image: 'uploads/driver_service_permission_images/default_driver_permission.png',
          phone_number: '3131356476',
          user_id: 12,
          vehicle_id: 2
        },
        {
          // id: 3
          license_number: '123456C',
          public_service_permission_image: 'uploads/driver_service_permission_images/default_driver_permission.png',
          phone_number: '3131356477',
          user_id: 13,
          vehicle_id: 3
        },
        {
          // id: 4
          license_number: '123456D',
          public_service_permission_image: 'uploads/driver_service_permission_images/default_driver_permission.png',
          phone_number: '3131356478',
          user_id: 14,
          vehicle_id: 5
        },
        {
          // id: 5
          license_number: '123456E',
          public_service_permission_image: 'uploads/driver_service_permission_images/default_driver_permission.png',
          phone_number: '3131356479',
          user_id: 15,
          vehicle_id: 6
        },
        {
          // id: 6
          license_number: '123456F',
          public_service_permission_image: 'uploads/driver_service_permission_images/default_driver_permission.png',
          phone_number: '3131356480',
          user_id: 16,
          vehicle_id: 9
        }
      ]);
    });
  };
