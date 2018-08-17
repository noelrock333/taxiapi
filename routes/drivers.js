const express = require('express');
const router = express.Router();
const knex = require('../knex');
const SHA256 = require('crypto-js/sha256');
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const User = require('../models/user');
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');
const Trip = require('../models/trip');
const driverValidation = require('../validations/models/driver');
const firebase = require('../firebase');
const { upload } = require('../multer');

router.get('/', async (req, res, next) => {
  const drivers = await new Driver().fetchAll({withRelated: ['vehicle', 'user']});
  res.status(200).json(drivers.toJSON());
});

router.get('/profile', helpers.requireAuthentication, async (req, res, next) => {
  let driver_id = req.driver.id;
  let driver = await new Driver({id: driver_id}).fetch({withRelated: ['vehicle', 'user']});
  if (driver) {
    res.status(200).json(driver.toJSON());
  }
  else
    res.status(404).json({errors: ['No se pudo encontrar al Conductor']});
});

router.get('/active_trip', helpers.requireAuthentication, async (req, res, next) => {
  let driver_id = req.driver.id;
  let driver = await new Driver({id: driver_id}).fetch();
  if (driver) {
    let trip = await driver.activeTrip();
    if (trip)
      res.status(200).json({active: true, trip: trip.toJSON()});
    else
      res.status(200).json({active: false});
  }
  else
    res.status(404).json({errors: ['No se pudo encontrar al Conductor']});
});

router.put('/assign_vehicle', helpers.requireAuthentication, async (req, res, next) => {
  let driver_id = req.driver.id;
  let { vehicle_id } = req.body;
  let vehicle = await new Vehicle({id: vehicle_id}).fetch();
  let driver = await new Driver({id: driver_id}).fetch();
  if (vehicle && driver) {
    driver = await driver.save({vehicle_id}, {patch: true});
    if (driver.toJSON().vehicle_id == vehicle_id){
      driver = await driver.fetch({withRelated: ['vehicle', 'user']});
      res.status(200).json(driver.toJSON());
    }
    else
      res.status(422).json({errors: [ 'No se pudo actualizar el Conductor']});
  }
  else
    res.status(422).json({errors: [ 'No se pudo encontrar el Conductor o el Vehículo ya esta asigando']});
});

router.put('/quit_vehicle', helpers.requireAuthentication, async (req, res, next) => {
  let driver_id = req.driver.id;
  let driver = await new Driver({id: driver_id}).fetch();
  if (driver) {
    driver = await driver.save({vehicle_id: null}, {patch: true});
    if (driver.toJSON().vehicle_id == null){
      driver = await driver.fetch({withRelated: ['vehicle', 'user']});
      res.status(200).json(driver.toJSON());
    }
    else
      res.status(422).json({errors: [ 'No se pudo actualizar el Conductor']});
  }
  else
    res.status(404).json({errors: [ 'No se pudo encontrar el Conductor']});
});

router.put('/accept_trip', helpers.requireAuthentication, async (req, res, next) => {
  let trip_id = req.body.trip_id;
  let driver_id = req.driver.id;
  let trip = await new Trip({id: trip_id}).fetch();
  let driver = await new Driver({id: driver_id}).fetch();
  if (trip && driver && (driver.toJSON().vehicle_id) && (trip.toJSON().status == 'holding')) {
    const vehicle_id = driver.toJSON().vehicle_id;
    trip = await trip.save({ status: 'active', driver_id, vehicle_id}, {patch: true});
    if (trip.toJSON().vehicle_id == vehicle_id){
      driver = await driver.save({status: 'busy'}, {patch: true});
      trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});

      firebase
          .database()
          .ref('server/holding_trips/')
          .child(trip.toJSON().id)
          .remove();

      firebase
        .database()
        .ref('server/taken_trips/')
        .child(trip.toJSON().id)
        .set(trip.toJSON());

      res.status(200).json(trip.toJSON());
    }
    else
      res.status(422).json({errors: [ 'No se pudo actualizar el Viaje']});
  }
  else
    res.status(422).json({errors: [ 'No se pudo encontrar el Viaje o el Conductor no tiene Vehículo asignado']});
});

// router.put('/start_trip', helpers.requireAuthentication,async (req, res, next) => {
//   let driver_id = req.driver.id;
//   let driver = await new Driver({id: driver_id}).fetch();
//   if (driver) {
//     let trip = await driver.activeTrip();
//     if (trip && trip.toJSON().status == 'taken') {
//       trip = await trip.save({status: 'active'}, {patch: true});
//       if (trip.toJSON().status == 'active'){
//         trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});
//         res.status(200).json(trip.toJSON());
//       }
//       else
//         res.status(422).json({errors: [ 'No se pudo actualizar el Viaje']});
//     }
//     else {
//       res.status(422).json({errors: [ 'El Conductor no puede iniciar el viaje si no lo ha tomado']});
//     }
//   }
//   else
//     res.status(404).json({errors: [ 'No se pudo encontrar el Conductor']});
// });

router.put('/finish_trip', helpers.requireAuthentication, async (req, res, next) => {
  let driver_id = req.driver.id;
  let driver = await new Driver({id: driver_id}).fetch();
  if (driver) {
    let trip = await driver.activeTrip();
    if (trip && trip.toJSON().status === 'active') {
      trip = await trip.save({status: 'finished'}, {patch: true});
      if (trip.toJSON().status == 'finished'){
        let driver = await new Driver({id: trip.toJSON().driver_id}).fetch();
        driver = await driver.save({status: 'free'}, {patch: true});
        trip = await trip.fetch({withRelated: ['user', 'driver.user','vehicle']});

        firebase
          .database()
          .ref('server/taken_trips/')
          .child(trip.toJSON().id)
          .remove();

        firebase
          .database()
          .ref('server/finished_trips/')
          .child(trip.toJSON().id)
          .set(trip.toJSON());

        res.io.in(`user-${trip.toJSON().user.id}`).emit('finishedTrip', trip.toJSON());
        res.status(200).json(trip.toJSON());
      }
      else
        res.status(422).json({errors: [ 'No se pudo actualizar el estado del Viaje' ]});
    }else {
      res.status(422).json({errors: [ 'El Conductor no puede finalizar el viaje si no lo ha iniciado' ]});
    }
  }
  else
    res.status(422).json({errors: [ 'No se pudo encontrar el Viaje o el Conductor no tiene Vehículo asignado']});
});

router.put('/cancel_trip', helpers.requireAuthentication, async (req, res, next) => {
  let driver = req.driver;
  if (driver) {
    let trip = await new Driver({id: driver.id}).activeTrip();
    if (trip) {
      trip = await trip.save({status: 'holding', driver_id: null, vehicle_id: null}, { patch: true });
      if (trip.toJSON().status == 'holding'){
        driver = await new Driver({id: driver.id}).save({status: 'free'}, {patch: true});
        trip = await trip.fetch({withRelated: ['user']});

        firebase
          .database()
          .ref('server/taken_trips/')
          .child(trip.toJSON().id)
          .remove();

        firebase
          .database()
          .ref('server/holding_trips/')
          .child(trip.toJSON().id)
          .set({...trip.toJSON(), timestamp: new Date(trip.toJSON().created_at)});

        res.status(200).json(trip.toJSON());
      }
      else
        res.status(422).json({errors: [ 'No se puso cancelar el Viaje']});
    }
    else
      res.status(422).json({errors: [ 'El conductor no tiene un Viaje activo']});
  }
  else
    res.status(422).json({errors: [ 'Necesitas estar loggeado como conductor']});
});

router.post('/signup', driverValidation.validate,  async (req, res, next) => {
  const {
    full_name,
    email,
    password,
    license_number,
    status = 'free',
    public_service_permission_image,
    phone_number
  } = req.body;
  let password_hash = SHA256(password).toString();

  let user = await new User({ full_name, email, password_hash }).save();
  if (user) {
    let user_id = user.get('id');
    let driver = await new Driver({
      license_number,
      status,
      user_id,
      public_service_permission_image,
      phone_number
    }).save();
    if (driver){
      driver = await driver.fetch({withRelated: ['vehicle', 'user']});
      driver = driver.toJSON();
      const token = authToken.encode({
        id: driver.user.id,
        driver_id: driver.id,
        role: 'driver'
      });
      res.status(201).json({ jwt: token });
    }
    else{
      user = await new User({id: user_id}).destroy();
      res.status(422).json({errors: [ 'No se pudo crear el conductor']});
    }
  }
  else
    res.status(422).json({errors: [ 'No se pudo crear el conductor']});
});

router.post('/login', async (req, res, next) => {
  const { email, password, device_id = null } = req.body;
  let user = await new User({email}).fetch();
  if (user){
    const password_hash = SHA256(`${password}`).toString();
    user_password = user.toJSON({visibility: false}).password_hash;
    if (user_password === password_hash){
      if (device_id) user = await user.storeDeviceId(device_id);
      let driver = await new Driver({user_id: user.id}).fetch({withRelated: ['user']});
      if (driver) {
        driver = driver.toJSON();
        const token = authToken.encode({
          id: user.id,
          driver_id: driver.id,
          role: 'driver'
        });
        res.status(200).json({ jwt: token });
      }
      else{
        res.status(422).json({errors: [ 'El usuario no es Conductor']});
      }
    }
    else {
      res.status(422).json({errors: [ 'El email o la contraseña son incorrectos']});
    }
  }
  else {
    res.status(422).json({errors: [ 'El email o la contraseña son incorrectos']});
  }
});

router.post('/trips_in_range', helpers.requireAuthentication, async (req, res, next) => {
  let {lat, lng} = req.body;
  let trips = await new Driver().tripsInRange(lat,lng);
  res.status(200).json(trips);
});

router.post('/upload_profile_image', upload.single('profile_image'), helpers.requireAuthentication, async (req, res, next) => {
  res.status(200).json({image: req.file.path });
});

router.post('/upload_permission_image', upload.single('public_service_permission_image'), async (req, res, next) => {
  res.status(200).json({image: req.file.path });
});

router.put('/change_image_profile', helpers.requireAuthentication, async (req, res, next) => {
  const profile_image = req.body.profile_image;
  const driver_id = req.driver.id;
  if (profile_image) {
    let driver = await new Driver({id: driver_id}).save({profile_image}, {patch: true});
    if (driver.toJSON().profile_image == profile_image) {
      driver = await driver.fetch({withRelated: ['vehicle.organization']});
      res.status(200).json(driver.toJSON());
    }
    else{
      res.status(422).json({errors: ['No se pudo actualizar la imagen de perfil']})
    }
  }
  else {
    res.status(422).json({errors: ['La imagen es requerida']});
  }
});

module.exports = router;
