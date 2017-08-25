var express = require('express');
var router = express.Router();
var database = require('../db');

/* GET users listing. */
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

  console.log(JSON.stringify(req.query));
  console.log(JSON.stringify(req.body));
  var postToInsert = {
     title: req.body.title,
     body: req.body.body,
     date_created: Date.now(),
     published: false,
     date_published: "",
     author: "admin",
  }
  postsCollection.insertOne( postToInsert
    , function(err, result) {
      if(err){
        res.redirect("/error");
      }else{
        console.log("Inserted a document into the posts collection.");
        res.redirect("/");
      }
  });
});

module.exports = router;
