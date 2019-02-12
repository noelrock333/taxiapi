var firebase = require('firebase-admin');
var firebaseConfig = require('./firebaseconfig.json');

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL:
    process.env.REALTIMEDATABASE_URL || 'https://cytio-10a47.firebaseio.com',
});

module.exports = firebase;
