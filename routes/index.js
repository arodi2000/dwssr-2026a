var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'PROYECTO ASOMBROSO POR SERGIO ARODI 🌟',
    author: 'SERGIO RAMIEZ'

  });
});

module.exports = router;
