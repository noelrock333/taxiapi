const SHA256 = require('crypto-js/sha256');

exports.seed = function(knex, Promise) {
  return knex('users').del()
  .then(function () {
      const password_hash = SHA256('123456').toString();
      return knex('users').insert([
        {id: 1, email: 'user1@user.com', full_name: 'User 1', password_hash},
        {id: 2, email: 'user2@user.com', full_name: 'User 2', password_hash},
        {id: 3, email: 'user3@user.com', full_name: 'User 3', password_hash},
        {id: 4, email: 'user4@user.com', full_name: 'User 4', password_hash},
        {id: 5, email: 'user5@user.com', full_name: 'User 5', password_hash},
        {id: 6, email: 'user6@user.com', full_name: 'User 6', password_hash},
        {id: 7, email: 'user7@user.com', full_name: 'User 7', password_hash},
        {id: 8, email: 'user8@user.com', full_name: 'User 8', password_hash},
        {id: 9, email: 'user9@user.com', full_name: 'User 9', password_hash},
        {id: 10, email: 'user10@user.com', full_name: 'User 10', password_hash},
        {id: 11, email: 'driver1@driver.com', full_name: 'Driver1', password_hash},
        {id: 12, email: 'driver2@driver.com', full_name: 'Driver2', password_hash},
        {id: 13, email: 'driver3@driver.com', full_name: 'Driver3', password_hash},
        {id: 14, email: 'driver4@driver.com', full_name: 'Driver4', password_hash},
        {id: 15, email: 'driver5@driver.com', full_name: 'Driver5', password_hash},
        {id: 16, email: 'driver6@driver.com', full_name: 'Driver6', password_hash}
      ]);
    });
};
