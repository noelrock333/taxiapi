const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const Vehicle = require('../models/vehicle');


router.post('/', async (req, res, next) => {
  let {organization, license_plate, number, model, year} = req.body;
  const vehicle = await new Vehicle({
    organization, license_plate, number, model, year
  }).save();
  let vehicle_id = vehicle.get('id');
  if (vehicle_id)
    res.status(201).json(vehicle.toJSON());
  else
    res.status(422).json({errors: {message: 'No se pudo crear el vehiculo'}});
});

router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  let vehicle = await new Vehicle({id}).fetch();
  res.status(200).json(vehicle ? vehicle.toJSON() : { errors: { message: 'No se pudo encontrar el vehiculo' }});
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  let {organization, license_plate, number, model, year} = req.body;
  let vehicle = await new Vehicle({id}).fetch();
  if (vehicle){
    vehicle = await vehicle
      .save({organization, license_plate, number, model, year}, { patch: true });
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
    let vehicle_id = vehicle.get('id');
    if (typeof vehicle_id === 'undefined')
      res.status(200).json({flash: {message: 'Vehiculo elimnado con exito'}});
    else
      res.status(422).json({errors: {message: 'No se pudo eliminar el vehiculo'}});
  }
  else
    res.status(422).json({errors: {message: 'No se pudo encontrar el vehiculo'}});
});

module.exports = router;
