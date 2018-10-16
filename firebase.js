const firebase = require('firebase-admin')
const { existsSync } = require('fs')
const path = require('path')

const firebaseConfig = {
  databaseURL: process.env.REALTIMEDATABASE_URL
}

if (process.env.NODE_ENV == 'production' || existsSync(path.join(__dirname, './firebaseconfig.json'))) {
  const firebaseConfig = require('./firebaseconfig.json')
  firebaseConfig.credential = firebase.credential.cert(firebaseConfig)
}

firebase.initializeApp(firebaseConfig)

module.exports = firebase
