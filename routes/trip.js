const express = require('express');
const router = express.Router();
const knex = require('../knex');
const helpers = require('../lib/helpers');

router.use(helpers.requireAuthentication);

router.get('/', function(req, res, next) {
  res.send('Usuario autorizado');
});

module.exports = router;