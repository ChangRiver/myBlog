/**
 * Created by suboat on 16-11-28.
 */
var Post = require('../lib/mongo').Post;
var marked = require('marked');
var CommentModel = require('./comments');

// 将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
    afterFind: function(posts) {
        return posts.map(function(post) {
            post.content = marked(post.content);
            return post;
        })
    },
    afterFindOne: function(post) {
        if(post) {
            post.content = marked(post.content);
        }
        return post;
    }
});

// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
    afterFind: function(posts) {
        return Promise.all(posts.map(function (post) {
            return CommentModel.getCommentsCount(post._id)
                .then(function(commentsCount) {
                   post.commentsCount = commentsCount;
                    return post;
                });
        }));
    },
    afterFindOne: function(post) {
        if(post) {
            return CommentModel.getCommentsCount(post._id).then(function (count) {
               post.commentsCount = count;
                return post;
            });
        }

        return post;
    }
})

module.exports = {
    create: function create(post) {
        return Post.create(post).exec();
    },
    // 通过文章 id 获取一篇文章
    getPostById: function getPostById(postId) {
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },
    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: function getPosts(author) {
        var query = {};
        if(author) {
            query.author = author;
        }
        return Post
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },
    // 通过文章 id 给 pv 加 1
    incPv: function incPv(postId) {
        return Post
            .update({ _id: postId }, { $inc: { pv: 1 } })
            .exec();
    },
    getRawPostById: function getRawPostById(postId) {
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            .exec();
    },
    updatePostById: function updatePostById(postId, author, data) {
        return Post.update({ author: author, _id: postId }, { $set: data }).exec();
    },
    delPostById: function delPostById(postId, author) {
        return Post.remove({ author: author, _id: postId }).exec();
    }
};

