const express = require('express');
const router = express.Router();
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const Vehicle = require('../models/vehicle');
const Driver = require('../models/driver');
const vehicleValidation = require('../validations/models/vehicle');


router.get('/', async (req, res, next) => {
  const vehicles = await new Vehicle().fetchAll({withRelated: ['service_type', 'organization']});
  res.status(200).json(vehicles.toJSON());
});

router.post('/', vehicleValidation.validate, helpers.requireAuthentication, async (req, res, next) => {
  let driver_id = req.driver.id;
  let {number, organization_id,service_type_id = 1} = req.body;
  let driver = await new Driver({id: driver_id}).fetch();
  let vehicle = await new Vehicle().findOrCreate(number, organization_id, service_type_id);
  if (vehicle && driver){
    driver = driver.save({vehicle_id: vehicle.toJSON().id},{patch: true});
    if (driver.toJSON().vehicle_id == vehicle.toJSON.id){
      vehicle = await vehicle.fetch({withRelated: ['service_type', 'organization']});
      res.status(201).json(vehicle.toJSON());
    }
  }
  else
    res.status(422).json({errors: {message: 'No se pudo crear el Vehículo'}});
});

router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  let vehicle = await new Vehicle({id}).fetch({withRelated: ['service_type', 'organization']});
  if (vehicle)
    res.status(200).json(vehicle.toJSON());
  else
    res.status(404).json({ errors: { message: 'No se pudo encontrar el Vehículo' }});
});

router.put('/:id', vehicleValidation.validate, async (req, res, next) => {
  const id = req.params.id;
  let {number, ervice_type_id, organization_id} = req.body;
  let vehicle = await new Vehicle({id}).fetch();
  if (vehicle){
    vehicle = await vehicle
      .save({number, ervice_type_id, organization_id}, { patch: true });
    res.status(200).json(vehicle.toJSON());
  }
  else
    res.status(404).json({errors: {message: 'No se pudo encontrar el Vehículo para actualizar'}});
});

router.delete('/:id', async (req, res, next) => {
  let id = req.params.id;
  let vehicle = await new Vehicle({id}).fetch();
  if (vehicle){
    vehicle = await vehicle.destroy();
    if (vehicle && (typeof vehicle.get('id') === 'undefined'))
      res.status(200).json({flash: {message: 'Vehículo elimnado con éxito'}});
    else
      res.status(422).json({errors: {message: 'No se pudo eliminar el Vehículo'}});
  }
  else
    res.status(404).json({errors: {message: 'No se pudo encontrar el Vehículo'}});
});

module.exports = router;
