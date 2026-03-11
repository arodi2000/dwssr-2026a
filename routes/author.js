var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('author', {
        title: 'RAPS',
        Name: 'SERGIO ARODI',
        lastname: 'RAMIREZ PADILLA',
        matricula: '221130036',
        email: 'ramirezinfinity23@gmail.com',
        imagen: '/img/sergioramirez.jpeg'
    });
});

module.exports = router;