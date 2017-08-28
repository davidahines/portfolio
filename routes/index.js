var express = require('express');
var router = express.Router();
var database = require('../db');
var showdown = require('showdown');
var converter = new showdown.Converter();

/* GET home page. */
router.get('/', function(req, res, next) {
  var postsCollection = database.get().collection('posts');
  postsCollection.find({published: true}, {sort: {date_created: 1}}).toArray(function(err, postDocs) {
    postsCollection.find({published: true}, {sort: {date_created: 1}}).limit(1).toArray(function(err, postDoc) {
      res.render('index', {
        title: 'David A Hines',
        posts: postDocs,
        post: postDoc[0],
        converted_html: converter.makeHtml(postDoc[0].body)
      });
    });
  });
});

module.exports = router;
