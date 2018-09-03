const validate = require('../../lib/validate');

const matchLabel = {
  address_origin: "Dirección de origen",
  lat_origin: "Latitude origen",
  lng_origin: "Longitud origen"
}

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

  return validate.async(attributes, constraints, {
    prettify: function prettify(string) {
      string = matchLabel[string];
      return validate.prettify(string);
    }
  });
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
