const Driver = require('../../models/driver')
const {phone, image} = require('faker')
const uuid = require('uuid/v1')

function buildDriver(params = {}) {
  return new Driver({
    public_service_permission_image: image.imageUrl(),
    license_number: uuid(),
    phone_number: phone.phoneNumber(),
    ...params
  })
}

module.exports = {
  buildDriver
}