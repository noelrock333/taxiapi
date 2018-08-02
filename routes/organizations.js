const express = require('express');
const router = express.Router();
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const Organization = require('../models/organization');
const organizationValidation = require('../validations/models/organization');

router.get('/', async (req, res, next) => {
  let organizations = await new Organization().fetchAll();
  res.status(200).json(organizations.toJSON());
})

router.post('/', organizationValidation.validate, async (req, res, next) => {
  let name = req.body.name
  let organization = await new Organization({ name }).save();
  if (organization)
    res.status(201).json(organization.toJSON());
  else
    res.status(422).json({errors: {message: 'No se pudo crear la Organizción'}});
});

router.delete('/:id', async (req, res, next) => {
  let id = req.params.id
  let organization = await new Organization({id}).fetch();
  if (organization){
    organization = await organization.destroy();
    if (organization && typeof organization.get('id') === 'undefined')
      res.status(200).json({flash: {message: 'Organizción elimnada con exito'}});
    else
      res.status(422).json({errors: {message: 'No se pudo eliminar la Organizción'}});
  }
  else
    res.status(404).json({errors: {message: 'No se pudo encontrar la Organizción para eliminar'}})
})

module.exports = router;
