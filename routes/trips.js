const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');
const Trip = require('../models/trip');
const User = require('../models/user');
const Driver = require('../models/driver');
const validateTrip = require('../validations/models/trip');
const firebase = require('../firebase');
const uuidv1 = require('uuid/v1');
const eachLimit = require('async/eachLimit');

router.post(
  '/',
  helpers.requireAuthentication,
  validateTrip.validate,
  async (req, res, next) => {
    let { address_origin, lat_origin, lng_origin, references } = req.body;

    let user_id = req.user.id;
    let user = await new User({ id: user_id }).fetch();
    let user_trip = await user.activeTrip();

    if (user_trip)
      return res
        .status(422)
        .json({ errors: ['El usuario ya tiene un Viaje activo'] });

    let trip = await new Trip({
      address_origin,
      lat_origin,
      lng_origin,
      user_id,
      references: references || '',
      guid: uuidv1(),
    }).save();

    if (trip) {
      let trip_id = trip.get('id');
      trip = await new Trip({ id: trip_id }).fetch({
        withRelated: ['user', 'driver.user', 'vehicle'],
      });

      firebase
        .database()
        .ref('server/holding_trips/')
        .child(trip.toJSON().id)
        .set({
          ...trip.toJSON(),
          timestamp: new Date(trip.toJSON().created_at).getTime(),
        });

      firebase
        .database()
        .ref('server/tracking/')
        .child(trip.toJSON().guid)
        .set({
          positions: [{ lat: lat_origin, lng: lng_origin }],
          timestamp: new Date(trip.toJSON().created_at).getTime(),
        });
      
        res.status(201).json(trip.toJSON());
        // Send push notifications to all active drivers
        sendNotificationsDrivers();
    } else res.status(422).json({ errors: ['No se pudo crear el viaje'] });
  },
);

async function sendNotificationsDrivers() {
    new Driver()
      .where({ status: 'free', push_notifications: true })
      .fetchAll({ withRelated: ['user'] })
      .then(rows => {
        if (rows) {
          let drivers = rows.toJSON();
          if (Array.isArray(drivers)) {
            const driversFiltered = drivers.filter(item => item.user.device_id);
            eachLimit(driversFiltered, 20, function (driver, callback) {
              console.log('Sending push to driver', driver.id);
              res.sendPushNotification({
                  token: driver.user.device_id,
                  title: 'Nuevo servicio',
                  body: 'Se ha creado un nuevo servicio',
              }).then(() => {
                console.log('Message sent to driver', driver.id);
                callback();
              }).catch(err => {
                console.log('Failed to send message to', { driver_id: driver.id, token: driver.user.device_id });
                console.log(err);
                callback();
              });
            }, function(err) {
              if(err) {
                console.log('Failed to send message to', err);
              } else {
                console.log('All messages sent');
              }
            });
          }
        }
      }).catch(err => {
        console.log(err);
      });
}

router.get('/traking/:guid', async (req, res, next) => {
  const { guid } = req.params;
  try {
    let trip = await new Trip({ guid }).fetch({
      withRelated: ['user', 'driver.user', 'vehicle.organization'],
    });
    let tripJSON = trip.toJSON();
    if (tripJSON.status == 'active') {
      res.json(tripJSON);
    } else {
      res.status(422).json({ errors: ['Información de viaje no disponible'] });
    }
  } catch (e) {
    res
      .status(422)
      .json({ errors: ['No se pudo obtener información del viaje'] });
  }
});

router.get(
  '/update_position/:guid',
  helpers.requireAuthentication,
  async (req, res, next) => {
    const { guid } = req.params;
    const { lat, lng } = req.query;
    firebase
      .database()
      .ref(`server/tracking/${guid}`)
      .child('positions')
      .push({ lat, lng });
    res.json({ sucess: true });
  },
);

module.exports = router;
