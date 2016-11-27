/**
 * Created by opop on 2016/11/27.
 */
var express = require('express');
var router = express.Router();

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin登录页
router.get('/', checkNotLogin, function(req, res, next) {
  res.send(req.flash());
});

//POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
  res.send(req.flash());
});

module.exports = router;
