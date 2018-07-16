const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');

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

module.exports = router;
