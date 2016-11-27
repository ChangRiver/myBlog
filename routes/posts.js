/**
 * Created by opop on 2016/11/27.
 */
var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET 所有用户或者特定用户的文章页
router.get('/', function(req, res, next) {
  res.render('posts');
});

// POST 发表文章
router.post('/', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

//发表文章页
router.get('/create', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

//单独一篇的文章页
router.get('/:postId', function(req, res, next) {
  res.send(req.flash());
});

//更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

//更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

//删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

//创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

//删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

module.exports = router;

