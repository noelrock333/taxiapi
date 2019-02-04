var firebase = require("firebase-admin");

firebase.initializeApp({
  credential: firebase.credential.applicationDefault(),
  databaseURL: process.env.REALTIMEDATABASE_URL
});

module.exports = firebase;
