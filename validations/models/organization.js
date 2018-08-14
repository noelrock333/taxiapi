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
    return validateOrganization(req.body).then(() => {
      return next()
    }, err => {
      const errors = {
        errors: Object.keys(err).reduce((previousValue, key) => {
          return [...previousValue, ...err[key]]
        }, [])
      }

      return res.status(422).json(errors);
    })
  }
}
