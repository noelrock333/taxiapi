var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/taxista', function(req, res, next) {
  res.render('taxista');
});

module.exports = router;
