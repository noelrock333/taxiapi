const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const User = require('../models/user');
const Trip = require('../models/trip');
const helpers = require('../lib/helpers');
const firebase = require('../firebase');

/* GET users listing. */
router.get('/', async(req, res, next) => {
  let users = await new User().fetchAll();
  res.status(200).json(users.toJSON());
});

router.get('/profile', helpers.requireAuthentication, async (req, res, next) => {
  let user_id = req.user.id;
  let user = await new User({id: user_id}).fetch();
  if (user) {
    res.status(200).json(user.toJSON());
  }
  else
    res.status(404).json({errors: ['No se pudo encontrar al Usuario']});
});


router.post('/signup', async (req, res, next) => {
  let { email, password, full_name } = req.body;
  var password_hash = SHA256(`${password}`).toString();
  let user = await new User({ email, password_hash, full_name}).save();
  if (user){
    user = user.toJSON();
    const token = authToken.encode({
      id: user.id,
      email: user.email,
      role: 'customer'
    });
    res.status(201).json({ jwt: token });
  }
  else
    res.status(422).json({errors: ['No se pudo crear el Usuario']});
});

router.post('/login', async (req, res, next) => {
  const { email, password, device_id = null } = req.body;
  let user = await new User({email}).fetch();
  if (user){
    const password_hash = SHA256(`${password}`).toString();
    user_password = user.toJSON({visibility: false}).password_hash;
    if (user_password === password_hash){
      if (device_id) user = await user.storeDeviceId(device_id);
      user = user.toJSON();
      const token = authToken.encode({
        id: user.id,
        email: user.email,
        role: 'customer'
      });
      res.status(200).json({ jwt: token });
    }
    else {
      res.status(422).json({errors: ['El email o la contraseña son incorrectos']});
    }
  }
  else {
    res.status(422).json({errors: ['El email o la contraseña son incorrectos']});
  }
});

router.get('/active_trip', helpers.requireAuthentication, async (req, res, next) => {
  let user_id = req.user.id;
  let user = await new User({id: user_id}).fetch();
  if (user) {
    let trip = await user.activeTrip();
    if (trip)
      res.status(200).json({active: true, trip: trip.toJSON()});
    else
      res.status(200).json({active: false});
  }
  else
    res.status(404).json({errors: ['No se pudo encontrar un Usuario']});
});

router.get('/missing_rates', helpers.requireAuthentication, async (req, res, next) => {
  let user_id = req.user.id;
  let user = await new User({id: user_id}).fetch();
  if (user) {
    let trips = await user.missingRates();
    res.status(200).json(trips.toJSON());
  }
  else
    res.status(404).json({errors: ['No se pudo encontrar un Usuario']});
});

router.put('/set_rate', helpers.requireAuthentication, async (req, res, next) => {
  let user_id = req.user.id;
  let {comment = '', rate, trip_id} = req.body;
  let trip = await new Trip({id: trip_id}).fetch();
  if (trip && trip.toJSON().user_id == user_id && trip.toJSON().status == 'finished'){
    trip = await trip.save({comment, rate}, {patch: true});
    if (trip.toJSON().rate == rate){
      trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});
      res.status(200).json(trip.toJSON());
    }
    else
      res.status(422).json({errors:['No se pudo actualizar el rate del Viaje']});
  }
  else
    res.status(404).json({errors:['No se pudo encontrar el Viaje']});
});

router.put('/cancel_trip', helpers.requireAuthentication, async (req, res, next) => {
  let user_id = req.user.id;
  let user = await new User({id: user_id}).fetch();
  if (user){
    let trip = await user.activeTrip();
    if (trip) {
      trip = await trip.cancelTrip();
      if (trip.toJSON().status == 'canceled'){
        trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});

        firebase
          .database()
          .ref('server/holding_trips/')
          .child(trip.toJSON().id)
          .remove();

        firebase
          .database()
          .ref('server/taken_trips/')
          .child(trip.toJSON().id)
          .remove();

        res.status(200).json(trip.toJSON());
      }
      else
        res.status(422).json({errors: ['No se pudo actualizar el status del Viaje']});
    }
    else
      res.status(404).json({errors: ['El usuario no tiene ningun trip activo']});
  }
  else
    res.status(404).json({errors: ['No se pudo encontrar el Usuario']});
});

module.exports = router;
