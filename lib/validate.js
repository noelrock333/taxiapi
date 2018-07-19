const validate = require('validate.js');
const knex = require('../knex');

validate.extend(validate.validators.datetime, {
  parse: function (value, options) {
    return +moment.utc(value);
  },

  format: function (value, options) {
    var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  }
});

validate.validators.uniqueness = function uniqueness(value, options, key) {
  return new validate.Promise(function (resolve) {
    knex(options.table).where(key, value).then((data) => {
      return (data.length > 0) ? resolve('ya está tomado') : resolve();
    });
  });
};

validate.validators.presence.options = {
  message: 'no puede estar en blanco'
};
validate.validators.inclusion.options = {
  message: '^%{value} no se enucentra en la lista'
};
validate.validators.exclusion.options = {
  message: '^%{value} está restringido'
};
validate.validators.email.options = {
  message: 'no es un email valido'
};
validate.validators.equality.options = {
  message: 'no es igual a %{attribute}'
};
validate.validators.length.options = {
  tooShort: 'demasiado corto (longitud minima %{count} caracteres)',
  wrongLength: 'longitud incorrecta (debe contener %{count} caracteres)',
  tooLong: 'demasiado largo (longitud máxima %{count} caracteres)'
};
validate.validators.numericality.options = {
  notValid: 'no es un numero',
  notInteger: 'debe ser entero',
  notGreaterThanOrEqualTo: 'debe ser mayor o igual a %{count}',
  notGreaterThan: 'debe ser mayor a %{count}',
  notEqualTo: 'debe ser igual a %{count}',
  notLessThan: 'debe ser menor a %{count}',
  notLessThanOrEqualTo: 'debe ser menor o igual a %{count}'
};
validate.validators.datetime.options = {
  notValid: 'debe ser una fecha valida',
  tooEarly: 'no puede ser antes de %{date}',
  tooLate: 'no puede ser despues de %{date}'
};
validate.options = { fullMessages: false };

module.exports = validate;
