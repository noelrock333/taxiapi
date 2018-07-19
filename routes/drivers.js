const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const User = require('../models/user');
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');
const driverValidation = require('../validations/models/driver');

router.get('/', async (req, res, next) => {
  const drivers = await new Driver().fetchAll({withRelated: ['vehicle', 'user']});
  res.status(200).json(drivers.toJSON());
});

router.put('/asign_vehicle', async (req, res, next) => {
  let { vehicle_id, driver_id } = req.body;
  let vehicle = await new Vehicle({id: vehicle_id}).fetch();
  let driver = await new Driver({id: driver_id}).fetch();
  [vehicle_id, driver_id] = [vehicle.get('id'), driver.get('id')];
  if (vehicle_id && driver_id) {
    driver = await driver.save({vehicle_id}, {patch: true});
    if (driver.toJSON().vehicle_id == vehicle_id){
      driver = await driver.fetch({withRelated: ['vehicle', 'user']});
      res.status(200).json(driver.toJSON());
    }
    else
      res.status(200).json({errors: {message: 'No se pudo actualizar el Conductor'}});
  }
  else
    res.status(200).json({errors: {message: 'No se pudo encontrar el condutor o el vehiculo'}});
});

router.post('/signup', driverValidation.validate, async (req, res, next) => {
  const {full_name, email, password, license_number, status = 'free' } = req.body;
  let password_hash = SHA256(password).toString();

  let user = await new User({ full_name, email, password_hash }).save();
  let user_id = user.get('id');
  if (user_id) {
    let driver = await new Driver({ license_number, status, user_id }).save();
    driver_id = driver.get('id');
    if (driver_id){
      driver = await driver.fetch({withRelated: 'user'});
      res.status(201).json(driver.toJSON());
    }
    else{
      user = await new User({id: user_id}).destroy();
      res.status(422).json({errors: {message: 'No se pudo crear el conductor'}});
    }
  }
  else
    res.status(422).json({errors: {message: 'No se pudo crear el conductor'}});
});

module.exports = router;
