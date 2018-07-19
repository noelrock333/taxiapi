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
    },
    user_id: {
      presence: {allowEmpty: false}
    }
  };

  return validate.async(attributes, constraints);
}

module.exports = {
  validate: (req, res, next) => {
    return validateTrip(req.body).then(() => next(), err => res.status(422).json({errors: err}))
  }
}
