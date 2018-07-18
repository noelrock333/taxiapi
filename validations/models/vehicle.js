const validate = require('../../lib/validate');

function validateVehicle(attributes) {
  let constraints = {
    organization: {
      presence: {allowEmpty: false}
    },
    license_plate: {
      presence: {allowEmpty: false},
      uniqueness: {
        table: 'vehicles'
      }
    },
    number: {
      presence: {allowEmpty: false}
    },
    model: {
      presence: {allowEmpty: false}
    },
    year: {
      presence: {allowEmpty: false}
    }
  };

  return validate.async(attributes, constraints);
}

module.exports = {
  validate: (req, res, next) => {
    return validateVehicle(req.body).then(() => next(), err => res.status(422).json({errors: err}))
  }
}
