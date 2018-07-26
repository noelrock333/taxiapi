const express = require('express');
const router = express.Router();
const knex = require('../knex');
const helpers = require('../lib/helpers');
const Trip = require('../models/trip');
const Driver = require('../models/driver');
const User = require('../models/user');
const validateTrip = require('../validations/models/trip');

router.get('/', async (req, res, next) => {
  const trips = await new Trip().fetchAll({withRelated: ['user', 'driver.user','vehicle']});
  res.status(200).json(trips.toJSON());
});

router.post('/',validateTrip.validate, async (req, res, next) => {
  let {
    address_origin,
    lat_origin,
    lng_origin,
    user_id
  } = req.body;

  let user = await new User({id: user_id}).fetch();
  let user_trip = await user.activeTrip();

  if (user_trip)
    return res.status(422).json({errors: {message: 'El usuario ya tiene un Viaje activo'}});

  let trip = await new Trip({
    address_origin,
    lat_origin,
    lng_origin,
    user_id
  }).save();

  if (trip){
    let trip_id = trip.get('id');
    trip = await new Trip({id: trip_id}).fetch({withRelated: ['user', 'driver.user','vehicle']});
    res.status(201).json(trip.toJSON());
  }
  else
    res.status(422).json({errors: {message: 'No se pudo crear el viaje'}});
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  let trip = await new Trip({id}).fetch({withRelated: ['user', 'driver.user','vehicle']});
  if (trip) {
    res.status(200).json(trip.toJSON());
  }
  else {
    res.status(404).json({errors: {message: 'No se pudo encontrar ningun viaje'}});
  }
});

router.put('/:id/accept_trip', async (req, res, next) => {
  let trip_id = req.params.id;
  let { driver_id } = req.body;
  let trip = await new Trip({id: trip_id}).fetch();
  let driver = await new Driver({id: driver_id}).fetch();
  if (trip && driver && (driver.toJSON().vehicle_id) && (trip.toJSON().status == 'holding')) {
    const vehicle_id = driver.toJSON().vehicle_id;
    trip = await trip.save({ status: 'taken', driver_id, vehicle_id}, {patch: true});
    if (trip.toJSON().vehicle_id == vehicle_id){
      driver = await driver.save({status: 'busy'}, {patch: true});
      trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});
      res.status(200).json(trip.toJSON());
    }
    else
      res.status(422).json({errors: {message: 'No se pudo actualizar el Viaje'}});
  }
  else
    res.status(422).json({errors: {message: 'No se pudo encontrar el Viaje o el Conductor no tiene Vehículo asignado'}});
});

router.put('/:id/start_trip', async (req, res, next) => {
  let id = req.params.id;
  let trip = await new Trip({id}).fetch();
  if (trip && trip.toJSON().status == 'taken') {
    trip = await trip.save({status: 'active'}, {patch: true});
    if (trip.toJSON().status == 'active'){
      trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});
      res.status(200).json(trip.toJSON());
    }
    else
      res.status(422).json({errors: {message: 'No se pudo actualizar el Viaje'}});
  }
  else
    res.status(404).json({errors: {message: 'No se pudo encontrar el Viaje'}});
});

router.put('/:id/finish_trip', async (req, res, next) => {
  let trip_id = req.params.id;
  let trip = await new Trip({id: trip_id}).fetch();
  if (trip && trip.toJSON().status === 'active') {
    trip = await trip.save({status: 'finished'}, {patch: true});
    if (trip.toJSON().status == 'finished'){
      let driver = await new Driver({id: trip.toJSON().driver_id}).fetch();
      driver = await driver.save({status: 'free'}, {patch: true});
      trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});
      res.status(200).json(trip.toJSON());
    }
    else
      res.status(422).json({errors: {message: 'No se pudo actualizar el status del Viaje'}})
  }
  else
    res.status(422).json({errors: {message: 'No se pudo encontrar el Viaje o el Conductor no tiene Vehículo asignado'}});
});

router.put('/:id/set_rate', async (req, res, next) => {
  let {comment = "", rate} = req.body;
  let id = req.params.id;
  let trip = await new Trip({id}).fetch();
  if (trip){
    trip = await trip.save({comment, rate}, {patch: true});
    if (trip.toJSON().rate == rate){
      trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});
      res.status(200).json(trip.toJSON());
    }
    else
      res.status(422).json({errors: {message: 'No se pudo actualizar el rate del Viaje'}})
  }
  else
    res.status(404).json({errors: {message: 'No se pudo encontrar el Viaje'}});
});

router.put('/:id/cancel_trip', async (req, res, next) => {
  let id = req.params.id;
  let trip = await new Trip({id}).fetch();
  if (trip){
    trip = await trip.save({status: 'canceled'},{patch: true});
    if (trip.toJSON().status == 'canceled'){
      trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});
      res.status(200).json(trip.toJSON());
    }
    else
      res.status(422).json({errors: {message: 'No se pudo actualizar el status del Viaje'}});
  }
  else
    res.status(404).json({errors: {message: 'No se pudo encontrar el Viaje'}});
});

module.exports = router;
