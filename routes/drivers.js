const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const User = require('../models/user');
const Driver = require('../models/driver');

router.post('/signup', function(req, res, next) {
  var password_hash = SHA256(req.body.password).toString();


  new User({
    full_name: req.body.full_name,
    email: req.body.email,
    password_hash: password_hash
  })
  .save()
  .then(user => {
    let user_id = user.get('id');
    if (user_id) {
      new Driver({

      })
    }
    else {
      res.json()
    }
  })
});

module.exports = router;
