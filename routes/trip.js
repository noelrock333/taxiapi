const express = require('express');
const router = express.Router();
const knex = require('../knex');
const helpers = require('../lib/helpers');
const Trip = require('../models/trip');
const validateTrip = require('../validations/models/trip');

router.get('/', async (req, res, next) => {
  const trips = await new Trip().fetchAll();
  res.status(200).json(trips.toJSON());
});

router.post('/',validateTrip.validate, async (req, res, next) => {
  let {
    address_origin,
    lat_origin,
    lng_origin,
    user_id
  } = req.body;

  let trip = await new Trip({
    address_origin,
    lat_origin,
    lng_origin,
    user_id
  }).save();

  let trip_id = trip.get('id');
  if (trip_id)
    res.status(200).json(trip.toJSON());
  else
    res.status(422).json({errors: {message: 'No se pudo crear el viaje'}});
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  let trip = await new Trip({id}).fetch();
  let trip_id = trip.get('id');
  res.status(200).json(trip_id ? trip.toJSON() : {errors: {message: 'No se pudo encontrar ningun viaje'}});
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  let trip = await new Trip({id}).fetch();
  let trip_id = trip.get('id');
  if (trip_id){
    trip = await trip.destroy();
    let successMessage = {flash: {message: 'Viaje eliminado con exito'}};
    let errorMessage = {errors: {message: 'No se pudo eliminar el viaje'}};
    res.status(200).json(typeof service_id === 'undefined' ? successMessage : errorMessage);
  }
  else
    res.status(200).json({errors: {message: 'No se pudo encontrar ningun viaje'}})
});

module.exports = router;
