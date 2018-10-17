const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');
const Trip = require('../models/trip');
const User = require('../models/user');
const Driver = require('../models/driver');
const validateTrip = require('../validations/models/trip');
const firebase = require('../firebase');
const axios = require('axios');

router.post('/', helpers.requireAuthentication, validateTrip.validate, async (req, res, next) => {
  let {
    address_origin,
    lat_origin,
    lng_origin,
    references
  } = req.body;

  let user_id = req.user.id;
  let user = await new User({id: user_id}).fetch();
  let user_trip = await user.activeTrip();

  if (user_trip)
    return res.status(422).json({errors: ['El usuario ya tiene un Viaje activo']});

  let trip = await new Trip({
    address_origin,
    lat_origin,
    lng_origin,
    user_id,
    references: references || ''
  }).save();

  if (trip){
    let trip_id = trip.get('id');
    trip = await new Trip({id: trip_id}).fetch({withRelated: ['user', 'driver.user','vehicle']});

    firebase
      .database()
      .ref('server/holding_trips/')
      .child(trip.toJSON().id)
      .set({...trip.toJSON(), timestamp: new Date(trip.toJSON().created_at).getTime()})
    
    // Send push notifications to all active drivers
    new Driver()
      .where({ status: 'free', push_notifications: true })
      .fetchAll({ withRelated: ['user'] })
      .then(rows => {
        if (rows) {
          let drivers = rows.toJSON();
          if (Array.isArray(drivers)) {
            drivers
              .filter(item => item.user.device_id)
              .forEach(driver => {
                console.log('Push to driver', driver.id);
                res.sendPushNotification({
                  token: driver.user.device_id,
                  title: 'Nuevo servicio',
                  body: 'Puede haber un servicio cercano'
                });
              });
          }
        }
      })

    res.status(201).json(trip.toJSON());
  }
  else
    res.status(422).json({errors: ['No se pudo crear el viaje']});
});

router.get('/geocode', helpers.requireAuthentication, (req, res, next) => {
  const { lat, lng } = req.query;
  if (lat && lng) {
    axios
      .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.MAPS_GEOCODE_KEY}`)
      .then(response => {
        if (response.data && response.data.results) {
          let address = response.data.results.filter(item => {
            return item.types.includes('street_address');
          }).map(item => {
            return { address: item.formatted_address, type: item.geometry.location_type };
          });
          res.status(200).json(address);
        } else {
          res.status(422).json({ message: 'Dirección no encontrada' })
        }
      })
      .catch(err => {
        res.status(422).json(err);
      })
  } else {
    res.status(422).json({ message: 'Se requiere latitud y longitud' });
  }
})

module.exports = router;
