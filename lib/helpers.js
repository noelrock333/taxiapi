const authToken = require('./auth-token');
const knex = require('../knex');

module.exports = {
  requireAuthentication: function requireAuthentication(req, res, next) {
    try {
      let header = req.header('Authorization');
      let token = header.split(' ')[1];
      var payload = authToken.decode(token);

      knex('users')
        .where({ id: payload.user_id })
        .first()
        .then(function(user) {
            if (!user) return next(new Error('Invalid Authorization token.'));
            if (user.error) return next(user.error);
            req.user = user;
            req.user.token = token;
            // req.user.is_admin = user.role === 'admin' || user.role === 'staff';
            // req.user.is_staff = user.role === 'staff';
            next();
        });
    } catch (e) {
      console.error('Invalid authorization header. ', e.message);
      next({ status: 401 });
    }
  }
};