const express = require('express');
const router = express.Router();
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const User = require('../models/user');

// Users routes

router.get('/users', async (req, res, next) => {
  const users = await new User().fetchAll();
  res.status(200).json(users.toJSON());
});

router.get('/user/:id', async (req, res, next) => {
  const user_id = req.params.id;
  const user = await new User({id: user_id}).fetch();
  if (user) {
    res.status(200).json(user.toJSON());
  }
  else {
    res.status(404).json({errors: ['Este usuario no existe']});
  }
});

router.put('/user/:id', async (req, res, next) => {
  const user_id = req.params.id;
  let user = await new User({id: user_id}).fetch();
  if(user) {
    user = await user.save(req.body, {patch: true});
    console.log
    res.status(200).json(user.toJSON());
  }
  else {
    res.status(404).json({errors: ['Este usuario no existe']});
  }
});

router.delete('/user/:id', async (req, res, next) => {
  const user_id = req.params.id;
  let user = await new User({id: user_id}).fetch();
  if(user) {
    user = await user.save(req.body, {patch: true});
    res.status(200).json(user.toJSON());
  }
  else {
    res.status(404).json({errors: ['Este usuario no existe']});
  }
});

module.exports = router;
