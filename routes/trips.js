const express = require('express');
const router = express.Router();
const knex = require('../knex');
const helpers = require('../lib/helpers');
const Trip = require('../models/trip');
const User = require('../models/user');
const validateTrip = require('../validations/models/trip');
const firebase = require('../firebase');

router.get('/', async (req, res, next) => {
  const trips = await new Trip().fetchAll({withRelated: ['user', 'driver.user','vehicle']});
  res.status(200).json(trips.toJSON());
});

router.post('/', helpers.requireAuthentication, validateTrip.validate, async (req, res, next) => {
  let {
    address_origin,
    lat_origin,
    lng_origin
  } = req.body;

  let user_id = req.user.id;
  let user = await new User({id: user_id}).fetch();
  let user_trip = await user.activeTrip();

  if (user_trip)
    return res.status(422).json({errors: ['El usuario ya tiene un Viaje activo']});

  let trip = await new Trip({
    address_origin,
    lat_origin,
    lng_origin,
    user_id
  }).save();

  if (trip){
    let trip_id = trip.get('id');
    trip = await new Trip({id: trip_id}).fetch({withRelated: ['user', 'driver.user','vehicle']});

    firebase
      .database()
      .ref('server/holding_trips/')
      .child(trip.toJSON().id)
      .set({...trip.toJSON(), timestamp: new Date(trip.toJSON().created_at).getTime()})

    res.status(201).json(trip.toJSON());
  }
  else
    res.status(422).json({errors: ['No se pudo crear el viaje']});
});

module.exports = router;
