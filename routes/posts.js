/**
 * Created by opop on 2016/11/27.
 */
var express = require('express');
var router = express.Router();
var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');
var checkLogin = require('../middlewares/check').checkLogin;

// GET 所有用户或者特定用户的文章页
router.get('/', function(req, res, next) {
  var author = req.query.author;

  PostModel.getPosts(author)
      .then(function(posts) {
        res.render('posts', {
          posts: posts
        });
      })
      .catch(next);
});

// POST /posts 发表文章
router.post('/', checkLogin, function(req, res, next) {
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;

  try {
    if(!title.length) {
      throw new Error('请填写标题');
    }
    if(!content.length) {
      throw new Error('请填写内容');
    }
  } catch(e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  var post = {
    author: author,
    title: title,
    content: content
  };

  PostModel.create(post)
      .then(function(result) {
        post = result.ops[0];
        req.flash('success', '发表成功');
        res.redirect(`/posts/${post._id}`);
      })
      .catch(next);
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
  var user = req.session.user;
  res.render('create', {
      user: user
  });
});

//单独一篇的文章页
router.get('/:postId', function(req, res, next) {
  var postId = req.params.postId;

  Promise.all([
      PostModel.getPostById(postId),
      CommentModel.getComments(postId),
      PostModel.incPv(postId)
  ]).then(function(result) {
    var post = result[0];
      var comments = result[1];
    if(!post) {
      throw new Error('该文章不存在');
    }

    res.render('post', {
      post: post,
      comments: comments
    });
  })
      .catch(next);
});

//更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostModel.getRawPostById(postId)
      .then(function(post) {
        if(!post) {
          throw new Error('该文章不存在');
        }
        if (author.toString() !== post.author._id.toString()) {
          throw new Error('权限不足');
        }
        res.render('edit', {
          post: post
        });
      }).catch(next);
});

//更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;

  PostModel.updatePostById(postId, author, { title: title, content: content })
      .then(function () {
        req.flash('success', '编辑文章成功');
        res.redirect(`/posts/${postId}`);
      }).catch(next);
});

//删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostModel.delPostById(postId, author)
      .then(function() {
        req.flash('success', '删除文章成功');
        res.redirect('/posts');
      })
      .catch(next);
});

//创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
  var author = req.session.user._id;
  var postId = req.params.postId;
  var content = req.fields.content;

  var comment = {
      author: author,
      postId: postId,
      content: content
  };

  CommentModel.create(comment)
      .then(function() {
          req.flash('success', '留言成功');
          res.redirect('back');
      })
      .catch(next);
});

//删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
  var commentId = req.params.commentId;
  var author = req.session.user._id;

  CommentModel.delCommentById(commentId, author)
      .then(function() {
          req.flash('success', '删除留言成功');
          res.redirect('back');
      })
      .catch(next);
});

module.exports = router;

