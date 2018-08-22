const express = require('express');
const router = express.Router();
const Organization = require('../models/organization');

router.get('/', async (req, res, next) => {
  const organizations = await new Organization().fetchAll();
  res.status(200).json(organizations.toJSON());
});

module.exports = router;
