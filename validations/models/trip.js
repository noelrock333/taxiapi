const validate = require('../../lib/validate');

function validateTrip(attributes) {
  let constraints = {
    address_origin: {
      presence: {allowEmpty: false}
    },
    lat_origin: {
      presence: {allowEmpty: false},
    },
    lng_origin: {
      presence: {allowEmpty: false}
    }
  };

  return validate.async(attributes, constraints);
}

module.exports = {
  validate: (req, res, next) => {
    return validateTrip(req.body).then(() => {
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
