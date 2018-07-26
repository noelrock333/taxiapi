const express = require('express');
const router = express.Router();
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const ServiceType = require('../models/service_type');
const serviceTypeValidation = require('../validations/models/service_type');

router.get('/', async (req, res, next) => {
  let services = await new ServiceType().fetchAll();
  res.status(200).json(services.toJSON());
})

router.post('/', serviceTypeValidation.validate, async (req, res, next) => {
  let name = req.body.name.toLowerCase();
  let service = await new ServiceType({ name }).save();
  if (service)
    res.status(201).json(service.toJSON());
  else
    res.status(422).json({errors: {message: 'No se pudo crear el Servicio'}});
});

router.delete('/:id', async (req, res, next) => {
  let id = req.params.id
  let service = await new ServiceType({id}).fetch();
  if (service){
    service = await service.destroy();
    if (service && typeof service.get('id') === 'undefined')
      res.status(200).json({flash: {message: 'Servicio elimnado con exito'}});
    else
      res.status(422).json({errors: {message: 'No se pudo eliminar el servicio'}});
  }
  else
    res.status(404).json({errors: {message: 'No se pudo encontrar el servicio para eliminar'}})
})

module.exports = router;
