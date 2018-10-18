const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');
const SHA256 = require('crypto-js/sha256');
const { encode } = require('./auth-token');
const { internet, name, phone } = require('faker');
const { requireAuthentication, requireResetPasswordToken, requireAdminAuthentication } = require('./helpers');
const User = require('../models/user');
const Driver = require('../models/driver');

function mockedMiddleware(req, res) {
  return middleware => {
    return new Promise((resolve, reject) => {
      const originalJsonFn = res.json;
      jest.spyOn(res, 'json').mockImplementation(o => {
        originalJsonFn.call(res, o);
        resolve({ req, res });
      });
      middleware(req, res, e => (e == null ? resolve({ req, res }) : reject(e)));
    });
  };
}

describe('helpers', () => {
  let user;
  let driver;
  beforeAll(async () => {
    user = await new User({
      email: internet.exampleEmail(),
      password_hash: SHA256(internet.password()).toString(),
      full_name: name.findName(),
      phone_number: phone.phoneNumber()
    }).save();

    driver = await new Driver({
      license_number: 'license',
      public_service_permission_image: 'public_service_permission_image',
      user_id: user.id,
      phone_number: phone.phoneNumber()
    }).save();
  });

  describe('requireAdminAuthentication', () => {
    test('without token', async () => {
      const req = new MockExpressRequest();
      const res = new MockExpressResponse();
      await mockedMiddleware(req, res)(requireAdminAuthentication);
      expect(res._getJSON()).toEqual({ errors: [{ message: 'Invalid authorization header' }] });
    });
    test('with invalid token', async () => {
      const authorization = `Bearer potato`;
      const req = new MockExpressRequest({
        headers: {
          authorization
        }
      });
      const res = new MockExpressResponse();
      await mockedMiddleware(req, res)(requireAdminAuthentication);
      expect(res._getJSON()).toEqual({ errors: [{ message: 'Invalid Authorization token.' }] });
    });
    test('with non-admin valid token', async () => {
      const token = encode({ id: user.id, exp: 1539704047359 });
      const authorization = `Bearer ${token}`;
      const req = new MockExpressRequest({
        headers: {
          authorization
        }
      });
      const res = new MockExpressResponse();

      await mockedMiddleware(req, res)(requireAdminAuthentication);
      expect(res._getJSON()).toEqual({ errors: [{ message: 'Invalid Authorization token.' }] });
    });
    test('with admin token', async () => {
      const authorization = `Bearer whysoserious`;
      const req = new MockExpressRequest({
        headers: {
          authorization
        }
      });
      const res = new MockExpressResponse();

      await mockedMiddleware(req, res)(requireAdminAuthentication);
      expect(req.token).toEqual('whysoserious');
    });
  });
  describe('requireResetPasswordToken', () => {
    test('without token', async () => {
      const req = new MockExpressRequest({
        query: {},
        body: null
      });
      const res = new MockExpressResponse();
      await mockedMiddleware(req, res)(requireResetPasswordToken);
      expect(req.errors).toEqual(['Invalid Token']);
    });
    test('with invalid token', async () => {
      const authorization = `Bearer potato`;
      const req = new MockExpressRequest({
        headers: {
          authorization
        },
        query: {},
        body: null
      });
      const res = new MockExpressResponse();
      await mockedMiddleware(req, res)(requireResetPasswordToken);
      expect(req.errors).toEqual(['Invalid Token']);
    });
    test('with expired token', async () => {
      const token = encode({ id: user.id, exp: 1539704047359 });
      const req = new MockExpressRequest({
        query: {
          token
        }
      });
      const res = new MockExpressResponse();
      await mockedMiddleware(req, res)(requireResetPasswordToken);
      expect(req.user).toBeNull();
    });
    test('with valid token', async () => {
      const token = encode({ id: user.id, exp: Date.now() + 10000, expiration_date: Date.now() + 10000 });
      const req = new MockExpressRequest({
        query: {
          token
        }
      });
      const res = new MockExpressResponse();
      await mockedMiddleware(req, res)(requireResetPasswordToken);
      expect(req.user).toEqual(expect.objectContaining(user.toJSON()));
      expect(req.user.token).toEqual(token);
    });
  });
  describe('requireAuthentication', () => {
    test('without token', async () => {
      const req = new MockExpressRequest();
      const res = new MockExpressResponse();
      await mockedMiddleware(req, res)(requireAuthentication);
      expect(res._getJSON()).toEqual({ errors: [{ message: 'Invalid authorization header' }] });
    });
    test('with invalid token', async () => {
      const token = encode({ id: -1, exp: 1539704047359 });
      const authorization = `Bearer ${token}`;
      const req = new MockExpressRequest({
        headers: {
          authorization
        }
      });
      const res = new MockExpressResponse();
      await mockedMiddleware(req, res)(requireAuthentication);
      expect(res._getJSON()).toEqual({ errors: [{ message: 'Invalid Authorization token.' }] });
    });
    test('valid token without driver', async () => {
      const token = encode({ id: user.id, exp: 1539704047359 });
      const authorization = `Bearer ${token}`;
      const req = new MockExpressRequest({
        headers: {
          authorization
        }
      });
      const res = new MockExpressResponse();

      await mockedMiddleware(req, res)(requireAuthentication);

      expect(req.user).toEqual(expect.objectContaining(user.toJSON()));
      expect(req.user.token).toEqual(token);
    });
    test('valid token with driver', async () => {
      const token = encode({ id: user.id, driver_id: driver.id, exp: 1539704047359 });
      const authorization = `Bearer ${token}`;
      const req = new MockExpressRequest({
        headers: {
          authorization
        }
      });
      const res = new MockExpressResponse();

      await mockedMiddleware(req, res)(requireAuthentication);

      expect(req.user).toEqual(expect.objectContaining(user.toJSON()));
      expect(req.driver).toEqual(expect.objectContaining(driver.toJSON()));
      expect(req.driver.blacklist).toEqual(false);
      expect(req.user.token).toEqual(token);
    });
  });
});
