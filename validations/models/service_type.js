const validate = require('../../lib/validate');

function validateServiceType(attributes) {
  let constraints = {
    name: {
      presence: {allowEmpty: false},
      uniqueness: {
        table: 'service_types'
      }
    }
  };

  return validate.async(attributes, constraints);
}

module.exports = {
  validate: (req, res, next) => {
    return validateServiceType(req.body).then(() => next(), err => res.status(422).json({errors: err}))
  }
}
