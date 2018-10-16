const MockExpressRequest = require('mock-express-request')
const MockExpressResponse = require('mock-express-response')
const SHA256 = require('crypto-js/sha256')
const { encode, decode } = require('./auth-token')
const { internet, name, phone } = require('faker')
const { requireAuthentication } = require('./helpers')
const User = require('../models/user')

function mockedMiddleware (req, res) {
  return middleware => {
    return new Promise((resolve, reject) => {
      jest.spyOn(res, 'json').mockImplementation(o => resolve({ req, res }))
      middleware(req, res, e => (e == null ? resolve({ req, res }) : reject(e)))
    })
  }
}

describe('helpers', () => {
  let user
  beforeEach(async () => {
    user = await new User({
      email: internet.email(),
      password_hash: SHA256(internet.password()).toString(),
      full_name: name.findName(),
      phone_number: phone.phoneNumber()
    }).save()
  })
  describe('requireAuthentication', () => {
    test('valid token without driver', async () => {
      const token = encode({ id: user.id, exp: 1539704047359 })
      const authorization = `Bearer ${token}`
      const req = new MockExpressRequest({
        headers: {
          authorization
        }
      })
      const res = new MockExpressResponse()

      await mockedMiddleware(req, res)(requireAuthentication)

      expect(req.user).toEqual(expect.objectContaining(user.toJSON()))
      expect(req.user.token).toEqual(token)
    })
  })
})
