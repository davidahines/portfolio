var express = require('express');
var router = express.Router();
var database = require('../db');
var ObjectId = require('mongodb').ObjectId;
var showdown  = require('showdown'),
converter = new showdown.Converter();



module.exports = function(passport){

  isAuthenticated = function(req, res, next) {
    console.log("checking if request is authenticated")
    if (req.user) {
      next();
    } else {
      res.redirect('/login_page');
    }
  }

  router.get('/', isAuthenticated, function(req, res, next) {
    console.log('checking authentication');
    var postsCollection = database.get().collection('posts');
    postsCollection.find().toArray(function(err, postDocs) {
      res.render('posts', {
        posts: postDocs,
        authenticated: req.user ? true : false
      });
    });
  });

  router.get('/:id', function(req, res, next) {
    var postsCollection = database.get().collection('posts');
    postsCollection.find({published: true}, {sort: {date_created: 1}}).toArray(function(err, postDocs) {
      postsCollection.find({_id: ObjectId(req.params.id), published: true}, {sort: {date_created: 1}}).limit(1).toArray(function(err, postDoc) {
        res.render('posts_view', {
          title: 'David A Hines',
          posts: postDocs,
          post: postDoc[0],
          converted_html: converter.makeHtml(postDoc[0].body),
          message: req.flash('message'),
          authenticated: req.user ? true : false
        });
      });
    });
  });

  router.get('/edit/:id', isAuthenticated, function(req, res, next) {
    var postsCollection = database.get().collection('posts');
    postsCollection.findOne({_id: ObjectId(req.params.id)}, function(err, postDoc) {
      if(!err){
        res.render('posts_edit', {
          post: postDoc,
          authenticated: req.user ? true : false
        });
      }else{
        res.redirect("/error");
      }
    });
  });

  router.put('/:id', isAuthenticated, function(req, res, next) {
    var postsCollection = database.get().collection('posts');
    var publishedBool = req.body.published == "value" ? true : false;

    var body = req.body.body.replace("`", "\`");

    var valsToSet = {
      title: req.body.title,
      body: req.body.body,
      published: publishedBool
    }
    var postUpdate = {
      $set: valsToSet
    }

    if(publishedBool){
      valsToSet.date_published = Date.now();
    }
    console.log("postUpdate: "+JSON.stringify(postUpdate));
    console.log("PublishedBool: "+publishedBool);
    postsCollection.findOneAndUpdate({_id: ObjectId(req.params.id)}, postUpdate, function(err, postDoc) {
      if(!err){
        res.redirect("/posts");
      }else{
        res.redirect("/error");
      }
    });
  });

  router.post('/new', isAuthenticated, function(req, res, next) {
    var postsCollection = database.get().collection('posts');
    var post = {
      title: req.body.title,
      body: req.body.body,
      date_created: Date.now(),
      published: false,
      date_published: "",
      author: "admin",
    }
    postsCollection.insertOne(post, function(err, result) {
      if(err){
        res.redirect("/error");
      }else{
        res.redirect("/posts");
      }
    });
  });

  router.delete('/:id', isAuthenticated, function(req, res, next) {
    var postsCollection = database.get().collection('posts');
    postsCollection.remove({"_id":  ObjectId(req.params.id)}, function(err, result) {
      if(err){
        res.redirect("/error");
      }else{
        res.redirect("/posts");
      }
    });
  });
  return router
}
