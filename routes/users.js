const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const User = require('../models/user');
const helpers = require('../lib/helpers');

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
    res.status(422).json({errors: [{message: 'No se pudo crear el Usuario'}]})
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  let user = await new User({email}).fetch();
  if (user){
    const password_hash = SHA256(`${password}`).toString();
    user = user.toJSON({visibility: false});
    if (user.password_hash === password_hash){
      const token = authToken.encode({
        id: user.id,
        email: user.email,
        role: 'customer'
      });
      res.status(200).json({ jwt: token });
    }
    else {
      res.status(422).json({errors: [{message: 'El email o la contraseña son incorrectos'}]});
    }
  }
  else {
    res.status(422).json({errors: [{message: 'El email o la contraseña son incorrectos'}]});
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
    res.status(404).json({errors: [{message: 'No se pudo encontrar un Usuario'}]});
});

router.get('/:id/missing_rates', helpers.requireAuthentication, async (req, res, next) => {
  let user_id = req.params.id;
  let user = await new User({id: user_id}).fetch();
  if (user) {
    let trips = await user.missingRates();
    res.status(200).json(trips.toJSON());
  }
  else
    res.status(404).json({errors: [{message: 'No se pudo encontrar un Usuario'}]});
});

module.exports = router;
