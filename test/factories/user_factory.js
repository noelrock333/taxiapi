const User = require('../../models/user')
const SHA256 = require('crypto-js/sha256');
const {internet, name, phone} = require('faker')
const uuid = require('uuid/v1')

function buildUser(params = {}) {
  return new User({
    email: internet.exampleEmail(),
    password_hash: SHA256(`password`).toString(),
    full_name: name.findName(),
    device_id: uuid(),
    phone_number: phone.phoneNumber(),
    ...params
  })
}

module.exports = {
  buildUser
}