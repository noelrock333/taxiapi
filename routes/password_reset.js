const express = require('express');
const router = express.Router();
const authToken = require('../lib/auth-token');
const User = require('../models/user');
const helpers = require('../lib/helpers');
const SHA256 = require('crypto-js/sha256');
const sgMail = require('../sengrid');

router.get('/', helpers.requireResetPasswordToken, async (req, res, next) => {
  res.render('password_reset', { user: req.user, errors: req.errors, password_reset: false });
});

router.post('/', async (req, res, next) => {
  const email = req.body.email;
  const user = await new User({email}).fetch();
  const url = process.env.NODE_ENV == 'production' ? 'https://www.cytio.com.mx' : 'http://localhost:3000';

  if (user){
    const token = authToken.encode({
      id: user.id,
      expiration_date: Date.now() + 600000
    });

    const msg = {
      to: `${user.toJSON().email}`,
      from: 'no-reply@cytio.com.mx',
      subject: 'Recuperación de contraseña',
      html: `
        <strong>
          Para actualizar tu contraseña da click a este link
        </strong>
        Este link expirara en 10 minutos:
        <a href="${url}/api/password_reset?token=${token}">Click Aqui</a>`
    };

    sgMail.send(msg, () => {
      return res.status(200).json({});
    });
  }
  res.status(200).json({});
});

router.post('/change_password', helpers.requireResetPasswordToken, async (req, res, next) => {
  const password = req.body.password;
  const password_hash = SHA256(`${password}`).toString();
  if (req.user) {
    let user = await new User().where({email: req.user.email}).save({password_hash},{patch: true});
    user = await user.fetch();
    if (user.toJSON({visibility: false}).password_hash == password_hash){
      res.render('password_reset', {password_reset: true, success: true, user: null});
    }
    else {
      res.render('password_reset', {password_reset: true, success: false, user: null});
    }
  } else {
    res.render('password_reset', {password_reset: true, success: false, user: null});
  }
});

module.exports = router;
