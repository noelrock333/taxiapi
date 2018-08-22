const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');
const Vehicle = require('../models/vehicle');
const Driver = require('../models/driver');
const vehicleValidation = require('../validations/models/vehicle');

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
    res.status(422).json({errors:['No se pudo crear el Vehículo']});
});

module.exports = router;
