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
      console.log('attempting to deserialize user:',username);
      var usersCollection = database.get().collection('users');
      usersCollection.findOne({'username': username}, function(err, userDoc) {
        if(err){
          console.log("error getting user from db");
          done(err, user);
        }
        var user = {
          _id: userDoc._id,
          username: userDoc.username,
          password: userDoc.password,
          email: userDoc.email,
          firstName: userDoc.firstName,
          lastName: userDoc.lastName
        }
        console.log('deserialized user:' +JSON.stringify(user));
        done(err, user);
      });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}
