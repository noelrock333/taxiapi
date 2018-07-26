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

router.get('/:id/active_trip', async (req, res, next) => {
  let driver_id = req.params.id;
  let driver = await new Driver({id: driver_id}).fetch();
  if (driver) {
    let trip = await driver.activeTrip();
    if (trip)
      res.status(200).json({active: true, trip: trip.toJSON()});
    else
      res.status(200).json({active: false});
  }
  else
    res.status(404).json({errors: {message: 'No se pudo encontrar al Conductor'}});
});

router.put('/:id/asign_vehicle', async (req, res, next) => {
  let driver_id = req.params.id;
  let { vehicle_id } = req.body;
  let vehicle = await new Vehicle({id: vehicle_id}).fetch();
  let driver = await new Driver({id: driver_id}).fetch();
  if (vehicle && driver && vehicle.toJSON().status == 'not_asigned') {
    if (driver.toJSON().vehicle_id){
      let old_vehicle = await new Vehicle({id: driver.toJSON().vehicle_id}).fetch();
      old_vehicle = await old_vehicle.save({status: 'not_asigned'}, {patch: true});
    }
    driver = await driver.save({vehicle_id}, {patch: true});
    vehicle = await vehicle.save({status: 'asigned'}, {patch: true});
    if (driver.toJSON().vehicle_id == vehicle_id){
      driver = await driver.fetch({withRelated: ['vehicle', 'user']});
      res.status(200).json(driver.toJSON());
    }
    else
      res.status(422).json({errors: {message: 'No se pudo actualizar el Conductor'}});
  }
  else
    res.status(422).json({errors: {message: 'No se pudo encontrar el Conductor o el Vehículo ya esta asigando'}});
});

router.put('/:id/quit_vehicle', async (req, res, next) => {
  let driver_id = req.params.id;
  let driver = await new Driver({id: driver_id}).fetch();
  if (driver) {
    if (driver.toJSON().vehicle_id){
      let old_vehicle = await new Vehicle({id: driver.toJSON().vehicle_id}).fetch();
      old_vehicle = await old_vehicle.save({status: 'not_asigned'}, {patch: true});
    }
    driver = await driver.save({vehicle_id: null}, {patch: true});
    if (driver.toJSON().vehicle_id == null){
      driver = await driver.fetch({withRelated: ['vehicle', 'user']});
      res.status(200).json(driver.toJSON());
    }
    else
      res.status(422).json({errors: {message: 'No se pudo actualizar el Conductor'}});
  }
  else
    res.status(404).json({errors: {message: 'No se pudo encontrar el Conductor'}});
});

router.post('/signup', driverValidation.validate, async (req, res, next) => {
  const {full_name, email, password, license_number, status = 'free' } = req.body;
  let password_hash = SHA256(password).toString();

  let user = await new User({ full_name, email, password_hash }).save();
  if (user) {
    let user_id = user.get('id');
    let driver = await new Driver({ license_number, status, user_id }).save();
    if (driver){
      driver = await driver.fetch({withRelated: ['vehicle', 'user']});
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
