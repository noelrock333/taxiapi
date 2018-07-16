const jwt = require('jwt-simple');
const moment = require('./moment');

module.exports = {
  encode: function encode(payload) {
    payload.exp == payload.exp || moment().add('days', 1).valueOf();
    return jwt.encode(payload, process.env.JWT_SECRET);
  },

  decode: function decode(token) {
    return jwt.decode(token, process.env.JWT_SECRET);
  }
};