const validate = require('../../lib/validate');

const matchLabel = {
  name: "Nombre"
}

function validateServiceType(attributes) {
  let constraints = {
    name: {
      presence: {allowEmpty: false},
      uniqueness: {
        table: 'service_types'
      }
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
    return validateServiceType(req.body).then(() => {
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
