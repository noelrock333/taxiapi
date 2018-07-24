const express = require('express');
const router = express.Router();
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const Vehicle = require('../models/vehicle');
const vehicleValidation = require('../validations/models/vehicle');


router.get('/', async (req, res, next) => {
  const vehicles = await new Vehicle().fetchAll({withRelated: 'service_type'});
  res.status(200).json(vehicles.toJSON());
});

router.post('/', vehicleValidation.validate, async (req, res, next) => {
  let {organization, license_plate, number, model, year, service_type_id} = req.body;
  let vehicle = await new Vehicle({
    organization, license_plate, number, model, year, service_type_id
  }).save();
  if (vehicle){
    vehicle = await vehicle.fetch({withRelated: 'service_type'});
    res.status(201).json(vehicle.toJSON());
  }
  else
    res.status(422).json({errors: {message: 'No se pudo crear el vehiculo'}});
});

router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  let vehicle = await new Vehicle({id}).fetch({withRelated: 'service_type'});
  res.status(200).json(vehicle ? vehicle.toJSON() : { errors: { message: 'No se pudo encontrar el vehiculo' }});
});

router.put('/:id', vehicleValidation.validate, async (req, res, next) => {
  const id = req.params.id;
  let {organization, license_plate, number, model, year, service_type_id} = req.body;
  let vehicle = await new Vehicle({id}).fetch();
  if (vehicle){
    vehicle = await vehicle
      .save({organization, license_plate, number, model, year, service_type_id}, { patch: true });
    res.status(201).json(vehicle.toJSON());
  }
  else
    res.status(200).json({errors: {message: 'No se pudo encontrar el vehiculo para actualizar'}});
});

router.delete('/:id', async (req, res, next) => {
  let id = req.params.id;
  let vehicle = await new Vehicle({id}).fetch();
  if (vehicle){
    vehicle = await vehicle.destroy();
    if (vehicle && (typeof vehicle.get('id') === 'undefined'))
      res.status(200).json({flash: {message: 'Vehiculo elimnado con exito'}});
    else
      res.status(422).json({errors: {message: 'No se pudo eliminar el vehiculo'}});
  }
  else
    res.status(422).json({errors: {message: 'No se pudo encontrar el vehiculo'}});
});

module.exports = router;
