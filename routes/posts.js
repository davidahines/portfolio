var express = require('express');
var router = express.Router();
var database = require('../db');


router.get('/', function(req, res, next) {
  var postsCollection = database.get().collection('posts');
  postsCollection.find().toArray(function(err, postDocs) {
    res.render('posts', {
      title: 'David A Hines',
      posts: postDocs
    });
  });
});

router.post('/new', function(req, res, next) {
  var postsCollection = database.get().collection('posts');
  var postToInsert = {
     title: req.body.title,
     body: req.body.body,
     date_created: Date.now(),
     published: false,
     date_published: "",
     author: "admin",
  }
  postsCollection.insertOne(postToInsert, function(err, result) {
      if(err){
        res.redirect("/error");
      }else{
        res.redirect("/");
      }
  });
});

module.exports = router;
