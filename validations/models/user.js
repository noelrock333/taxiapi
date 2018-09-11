const validate = require('../../lib/validate');

const matchLabel = {
  full_name: "Nombre",
  email: "Correo",
  password: "Contraseña",
  phone_number: "Numero telefonico"
}

function validateUser(attributes) {
  console.log(attributes)
  let constraints = {
    full_name: {
      presence: {allowEmpty: false},
      length: {maximum: 100}
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
    phone_number: {
      presence: {allowEmpty: false},
      length: { minimum: 10}
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
    return validateUser(req.body).then(() => {
      return next()
    }, err => {
      console.log(err);
      const errors = {
        errors: Object.keys(err).reduce((previousValue, key) => {
          return [...previousValue, ...err[key]]
        }, [])
      }

      return res.status(422).json(errors);
    })
  }
}
