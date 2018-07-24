const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.io.emit("socketToMe", "users");
  res.render('users');
});

router.get('/signin', function(req, res, next) {
  res.render('users/signin');
});

router.post('/signin', function(req, res, next) {
  var password_hash = SHA256(req.body.password).toString();
  knex('users')
    .insert({
      full_name: req.body.full_name,
      email: req.body.email,
      password_hash: password_hash
    }).then(function(data) {
      res.send('El usuario ha sido creado');
    });
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
