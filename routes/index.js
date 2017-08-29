var express = require('express');
var router = express.Router();
var database = require('../db');
var showdown = require('showdown');
var converter = new showdown.Converter();

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}


module.exports = function(passport){
  /* GET home page. */
  router.get('/', function(req, res, next) {
    var postsCollection = database.get().collection('posts');
    postsCollection.find({published: true}, {sort: {date_created: 1}}).toArray(function(err, postDocs) {
      postsCollection.find({published: true}, {sort: {date_created: 1}}).limit(1).toArray(function(err, postDoc) {
        res.render('index', {
          title: 'David A Hines',
          posts: postDocs,
          post: postDoc[0],
          converted_html: converter.makeHtml(postDoc[0].body),
          message: req.flash('message')
        });
      });
    });
  });

  router.get('/login_page', function(req, res, next) {
    res.render('login',{message: req.flash('message')});
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/posts',
    failureRedirect: '/',
    failureFlash : true
  }));

  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
  }));

  return router;
}
