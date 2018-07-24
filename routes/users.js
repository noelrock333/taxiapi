const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const User = require('../models/user');

/* GET users listing. */
router.get('/', async(req, res, next) => {
  res.io.emit("socketToMe", "users");
  let users = await new User().fetchAll();
  res.status(200).json(users.toJSON());
});

router.post('/signup', async (req, res, next) => {
  let { email, password, full_name } = req.body;
  var password_hash = SHA256(`${password}`).toString();
  let user = await new User({ email, password_hash, full_name}).save();
  if (user)
    res.status(201).json(user.toJSON());
  else
    res.status(422).json({errors: {message: 'No se pudo crear el Usuario'}})
});

router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  let user = await new User({email}).fetch();
  if (user){
    const password_hash = SHA256(`${password}`).toString();
    user = user.toJSON();
    if (user.password_hash === password_hash){
      const token = authToken.encode({
        email: user.email,
        user_id: user.id
      });
      res.status(200).json({ jwt: token });
    }
    else {
      res.status(422).json({errors: {message: 'El usuario o la contraseña son incorrectos'}});
    }
  }
  else {
    res.status(422).json({errors: {message: 'El usuario o la contraseña son incorrectos'}});
  }
});

router.get('/:id/active_trip', async (req, res, next) => {
  let user_id = req.params.id;
  let user = await new User({id: user_id}).fetch();
  if (user) {
    let trip = await user.activeTrip();
    if (trip)
      res.status(200).json({active: true, trip: trip.toJSON()});
    else
      res.status(200).json({active: false});
  }
  else
    res.status(200).json({errors: {message: 'No se pudo encontrar un usuario'}});
});

router.get('/:id/missing_rates', async (req, res, next) => {
  let user_id = req.params.id;
  let user = await new User({id: user_id}).fetch();
  if (user) {
    let trips = await user.missingRates();
    res.status(200).json(trips.toJSON());
  }
  else
    res.status(200).json({errors: {message: 'No se pudo encontrar un usuario'}});
});

module.exports = router;
