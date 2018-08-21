const express = require('express');
const router = express.Router();
const authToken = require('../lib/auth-token');
const helpers = require('../lib/helpers');
const User = require('../models/user');
const Driver = require('../models/driver');

// User routes

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
    try {
      user = await user.destroy();
      res.status(200).json({flash: ['Usuario borrado exitosamente']});
    }
    catch (error){
      switch (error.code){
        case '23503':
        res.status(400).json({errors: ['Este usuario esta referenciado en otra tabla']});
        break;
      }
    }
  }
  else {
    res.status(404).json({errors: ['Este usuario no existe']});
  }
});

// Driver routes

router.get('/drivers', async (req, res, next) => {
  const drivers = await new Driver().fetchAll();
  res.status(200).json(drivers.toJSON());
});

router.get('/driver/:id', async (req, res, next) => {
  const driver_id = req.params.id;
  const driver = await new Driver({id: driver_id}).fetch();
  if (driver) {
    res.status(200).json(driver.toJSON());
  }
  else {
    res.status(404).json({errors: ['Este usuario no existe']});
  }
});

router.put('/driver/:id', async (req, res, next) => {
  const driver_id = req.params.id;
  let driver = await new Driver({id: driver_id}).fetch();
  if(driver) {
    driver = await driver.save(req.body, {patch: true});
    res.status(200).json(driver.toJSON());
  }
  else {
    res.status(404).json({errors: ['Este usuario no existe']});
  }
});

router.delete('/driver/:id', async (req, res, next) => {
  const driver_id = req.params.id;
  let driver = await new Driver({id: driver_id}).fetch();
  if(driver) {
    try {
      driver = await driver.destroy();
      res.status(200).json({flash: ['Usuario borrado exitosamente']});
    }
    catch (error){
      switch (error.code){
        case '23503':
        res.status(400).json({errors: ['Este usuario esta referenciado en otra tabla']});
        break;
      }
    }
  }
  else {
    res.status(404).json({errors: ['Este usuario no existe']});
  }
});

module.exports = router;
