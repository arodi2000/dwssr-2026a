// var express = require('express');
// var router = express.Router();
import express from 'express';
const router = express.Router();

/* GET home page. */
//eslint-disable-next-line no-unused-vars
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'PROYECTO ASOMBROSO POR SERGIO ARODI 🌟',
    author: 'SERGIO RAMIEZ'

  });
});

export default router;
