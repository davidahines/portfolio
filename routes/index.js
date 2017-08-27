var express = require('express');
var router = express.Router();
var database = require('../db');
var showdown = require('showdown');

/* GET home page. */
router.get('/', function(req, res, next) {
  var postsCollection = database.get().collection('posts');
  postsCollection.find({published: true}).toArray(function(err, postDocs) {
    res.render('index', {
      title: 'David A Hines',
      posts: postDocs
    });
  });
});

module.exports = router;
