var moment = require('moment-timezone');
var locale = require('moment/locale/es');

moment.updateLocale('es', locale);
module.exports = moment;