const express = require('express');
const router = express.Router();
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const firebase = require('../firebase');
const Trip = require('../models/trip');

router.post('/sync', async (req, res, next) => {
  const holding_trips = await new Trip().holdingTrips();

  firebase
    .database()
    .ref('server/holding_trips/')
    .remove();

  for(const trip of holding_trips.toJSON()) {
    firebase
      .database()
      .ref('server/holding_trips/')
      .child(trip.id)
      .set({...trip, timestamp: new Date(trip.created_at).getTime()});
  }

  const taken_trips = await new Trip().takenTrips();

  firebase
    .database()
    .ref('server/taken_trips/')
    .remove();

    for(const trip of taken_trips.toJSON()) {
      firebase
        .database()
        .ref('server/taken_trips/')
        .child(trip.id)
        .set(trip);
    }

  firebase
    .database()
    .ref('server/finished_trips/')
    .remove();

  res.status(200).json({message: 'Firebase Real Time DB Updated'});
});

module.exports = router;
