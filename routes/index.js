var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/taxista', function(req, res, next) {
  res.render('taxista');
});

router.get('/terminos_y_condiciones', function(req, res, next) {
  res.render('terminos_y_condiciones');
});

router.get('/ubicame/:guid', function(req, res, next) {
  res.render('taxista');
});

module.exports = router;
