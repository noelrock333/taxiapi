const { encode, decode } = require('./auth-token')

describe('auth-token', () => {
  let prevSecret
  beforeAll(() => {
    prevSecret = process.env.JWT_SECRET
    process.env.JWT_SECRET = 'auth-token-test'
  })
  afterAll(() => {
    process.env.JWT_SECRET = prevSecret
  })

  describe('encode', () => {
    it('should encode a payload', () => {
      expect(encode({ foo: 'bar', exp: 1539704047359 })).toEqual(
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJleHAiOjE1Mzk3MDQwNDczNTl9.VzYXpjOLK2w_svSzQJfBlGbRh7cMFvmWjI_QTeG1a2s'
      )
    })
  })

  describe('decode', () => {
    it('should decode a payload', () => {
      expect(
        decode('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJleHAiOjE1Mzk3MDQwNDczNTl9.VzYXpjOLK2w_svSzQJfBlGbRh7cMFvmWjI_QTeG1a2s')
      ).toEqual({ foo: 'bar', exp: 1539704047359 })
    })
  })
})
