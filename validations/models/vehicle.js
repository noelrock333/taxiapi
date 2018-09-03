const validate = require('../../lib/validate');

const matchLabel = {
  organization_id: "Id de la organización",
  number: "Numero",
}

function validateVehicle(attributes) {
  let constraints = {
    organization_id: {
      presence: {allowEmpty: false}
    },
    number: {
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
