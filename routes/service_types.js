const express = require('express');
const router = express.Router();
const ServiceType = require('../models/service_type');

router.get('/', async (req, res, next) => {
  const services = await new ServiceType().fetchAll();
  res.status(200).json(services.toJSON());
});

module.exports = router;
