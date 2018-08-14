const validate = require('../../lib/validate');

function validateVehicle(attributes) {
  let constraints = {
    organization_id: {
      presence: {allowEmpty: false}
    },
    number: {
      presence: {allowEmpty: false}
    }
  };

  return validate.async(attributes, constraints);
}

module.exports = {
  validate: (req, res, next) => {
    return validateVehicle(req.body).then(() => {
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
