const authToken = require('./auth-token');
const User = require('../models/user');
const Driver = require('../models/driver');
const safeEquals = require('safe-compare');

const genericErrorMessage = message => ({ errors: [{ message }] });
const extractToken = req => req.header('Authorization').split(' ')[1];
const verifyAndDecodeTokenPayload = (req, token) => (req.payload = authToken.decode(token));

async function withErrorHandler(res, fn) {
  try {
    await fn();
  } catch (e) {
    console.error('Invalid authorization header. ');
    console.error(e);
    res.status(401).json(genericErrorMessage('Invalid authorization header'));
  }
}

async function withUser(req, res, next, fn) {
  const user = await new User({ id: req.payload.id }).fetch();

  if (user == null) {
    return res.status(401).json(genericErrorMessage('Invalid Authorization token.'));
  }

  if (user.error != null) {
    return next(user.error);
  }

  req.user = user.toJSON();
  req.user.token = extractToken(req);

  await fn();
}

async function assignDriverIfRequired(req) {
  if (req.payload.driver_id != null) {
    const driver = await new Driver({ id: req.payload.driver_id }).fetch();
    if (driver != null) {
      req.driver = driver.toJSON();
      req.driver.blacklist = await driver.blacklist();
    }
  }
}

async function requireAuthentication(req, res, next) {
  await withErrorHandler(res, async () => {
    verifyAndDecodeTokenPayload(req, extractToken(req));
    await withUser(req, res, next, async () => {
      await assignDriverIfRequired(req);
      next();
    });
  });
}

async function requireAdminAuthentication(req, res, next) {
  await withErrorHandler(res, () => {
    const token = extractToken(req);
    if (safeEquals(process.env.ADMIN_TOKEN, token)) {
      req.token = token;
      return next();
    } else {
      return res.status(401).json(genericErrorMessage('Invalid Authorization token.'));
    }
  });
}

async function requireResetPasswordToken(req, res, next) {
  try {
    let token = req.query.token || req.body.token;
    if (token != null) {
      req.errors = [];
      verifyAndDecodeTokenPayload(req, token);
      const user = await new User({ id: req.payload.id }).fetch();
      const tokenIsNotExpired = Date.now() <= req.payload.expiration_date;
      if (user && tokenIsNotExpired) {
        req.user = user.toJSON();
        req.user.token = token;
      } else req.user = null;
    } else {
      req.errors = ['Token is necesary'];
    }
    next();
  } catch (e) {
    console.error('Invalid Token.');
    console.error(e);
    req.errors = [...(req.errors || []), 'Invalid Token'];
    next();
  }
}

module.exports = {
  requireAuthentication,
  requireResetPasswordToken,
  requireAdminAuthentication
};
