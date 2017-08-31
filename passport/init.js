var login = require('./login');
var signup = require('./signup');
var database = require('../db');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: '+user.username);
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
      console.log('deserializing user:',username);
      var usersCollection = database.get().collection('users');
      usersCollection.findOne({'username': username}, function(err, userDoc) {
        var user = {
          _id: userDoc._id,
          username: userDoc.username,
          pasword: userDoc.password,
          email: userDoc.email,
          firstName: userDoc.firstName,
          lastName: userDoc.lastName
        }
        console.log('deserializing user:',user);
        done(err, user);
      });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}
