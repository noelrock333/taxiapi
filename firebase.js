var firebase = require('firebase-admin');
var firebaseConfig = require('./firebaseconfig.json');

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL:
    process.env.REALTIMEDATABASE_URL,
});

module.exports = firebase;
