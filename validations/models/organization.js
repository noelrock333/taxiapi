const validate = require('../../lib/validate');

function validateOrganization(attributes) {
  let constraints = {
    name: {
      presence: {allowEmpty: false},
      uniqueness: {
        table: 'organizations'
      }
    }
  };

  return validate.async(attributes, constraints);
}

module.exports = {
  validate: (req, res, next) => {
    return validateOrganization(req.body).then(() => next(), err => res.status(422).json({errors: err}))
  }
}
