const validate = require('../../lib/validate');

function validateDriver(attributes) {
  let constraints = {
    full_name: {
      presence: {allowEmpty: false}
    },
    email: {
      presence: {allowEmpty: false},
      uniqueness: {
        table: 'users'
      },
      email: true
    },
    password: {
      length: {minimum: 6}
    },
    license_number: {
      presence: {allowEmpty: false},
      uniqueness: {
        table: 'drivers'
      }
    },
    status: {
      inclusion: [
        "free",
        "busy"
      ]
    }
  };

  return validate.async(attributes, constraints);
}

module.exports = {
  validate: (req, res, next) => {
    return validateDriver(req.body).then(() => next(), err => res.status(422).json({errors: err}))
  }
}
