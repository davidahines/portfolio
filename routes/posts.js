var express = require('express');
var router = express.Router();
var database = require('../db');
var ObjectId = require('mongodb').ObjectId;
var showdown  = require('showdown'),
converter = new showdown.Converter();
var utils = require('../utils');



module.exports = function(passport){
  isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated) {
      next();
    } else {
      res.redirect('/login_page');
    }
  }
  router.get('/', isAuthenticated, function(req, res, next) {
    console.log("authenticated");
    var postsCollection = database.get().collection('posts');
    postsCollection.find().toArray(function(err, postDocs) {
      res.render('posts', {
        posts: postDocs
      });
    });
  });

  router.get('/:id', function(req, res, next) {
    var postsCollection = database.get().collection('posts');
    postsCollection.findOne({_id: ObjectId(req.params.id)}, function(err, postDoc) {
      if(!err){
        postDoc.converted_html = converter.makeHtml(postDoc.body);
        res.render('posts_view', {
          post: postDoc
        });
      }else{
        res.redirect("/error");
      }
    });
  });

  router.get('/edit/:id', function(req, res, next) {
    var postsCollection = database.get().collection('posts');
    postsCollection.findOne({_id: ObjectId(req.params.id)}, function(err, postDoc) {
      if(!err){
        res.render('posts_edit', {
          post: postDoc
        });
      }else{
        res.redirect("/error");
      }
    });
  });

  router.put('/:id', function(req, res, next) {
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

  router.post('/new', function(req, res, next) {
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

  router.delete('/:id', function(req, res, next) {
    var postsCollection = database.get().collection('posts');
    postsCollection.remove({"_id":  ObjectId(req.params.id)}, function(err, result) {
      if(!err){
        res.redirect("/posts");
      }else{
        res.redirect("/error");
      }
    });
  });
  return router
}
