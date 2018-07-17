const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const User = require('../models/user');
const Driver = require('../models/driver');
const driverValidation = require('../validations/models/driver');

router.post('/signup', driverValidation.validate, function(req, res, next) {
  let {full_name, email, password, license_number} = req.body;
  let password_hash = SHA256(password).toString();

  new User({
    full_name,
    email,
    password_hash
  })
  .save()
  .then(user => {
    let user_id = user.get('id');
    if (user_id)
      return new Driver({ license_number, user_id }).save();
    else
      res.status(422).json({error: 'No se pudo crear el driver'});
  })
  .then(driver => {
    let driver_id = driver.get('id');
    if (driver_id) {
      driver.fetch({withRelated: 'user'}).then((data)=> {
        res.status(201).json(data.toJSON());
      });
    }
    else {
      new User({id: user_id})
        .destroy()
        .then(user => {
          res.status(422).json({error: 'No se pudo crear el driver'});
        })
    }
  });
});

module.exports = router;
