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
  var password_hash = SHA256(password).toString();
  let user = await new User({ email, password_hash, full_name}).save();
  if (user)
    res.status(201).json(user.toJSON());
  else
    res.status(422).json()
});

router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.post('/login', function(req, res, next) {
  knex('users')
    .where('email', '=', req.body.email)
    .first()
    .then(function(data) {
      if (data) {
        var password_hash = SHA256(req.body.password).toString();
        if (password_hash == data.password_hash) {
          var token = authToken.encode({
            email: data.email,
            user_id: data.id
          });
          res.json({ jwt: token });
        } else {
          res.send('Password incorrecto');
        }
      } else {
        return res.status(401);
      }
    });
})

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
