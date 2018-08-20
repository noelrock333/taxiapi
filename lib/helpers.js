const authToken = require('./auth-token');
const User = require('../models/user');
const Driver = require('../models/driver');

module.exports = {
  requireAuthentication: async function requireAuthentication(req, res, next) {
    try {
      let header = req.header('Authorization');
      let token = header.split(' ')[1];
      var payload = authToken.decode(token);

      let user = await new User({id: payload.id}).fetch();
      if (!user) return res.status(401).json({errors: [{message: 'Invalid Authorization token.'}]});
      if (user.error) return next(user.error);
      req.user = user.toJSON();
      if (payload.driver_id) {
        const driver = await new Driver({id: payload.driver_id}).fetch();
        if (driver) req.driver = driver.toJSON();
      }
      req.user.token = token;
      next();
    } catch (e) {
      console.error('Invalid authorization header. ', e.message);
      res.status(401).json({ errors: [{message: 'Invalid authorization header'}]});
    }
  },
  requireResetPasswordToken: async function requireResetPasswordToken(req, res, next) {
    try {
      let token = req.query.token || req.body.token
      if (token) {
        req.errors = [];
        var payload = authToken.decode(token);
        let user = await new User({id: payload.id}).fetch();
        if (user && Date.now() <= payload.expiration_date){
          req.user = user.toJSON();
          req.user.token = token;
        }
        else
          req.user = null;
      } else {
        req.errors = ['Token is necesary'];
      }
      next();
    } catch (e) {
      console.error('Invalid Token. ', e.message);
      req.errors = [...req.errors, 'Invalid Token'];
      next();
    }
  }
};
