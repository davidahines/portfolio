var LocalStrategy   = require('passport-local').Strategy;
var database = require('../db');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            // check in mongo if a user with username exists or not
            var usersCollection = database.get().collection('users');
						console.log("findOne: " +username);
            usersCollection.findOne({ 'username' :  username }, function(err, userDoc) {
								console.log("creating user:"+ JSON.stringify(userDoc));
								var user = {
										_id: userDoc['_id'],
										username: userDoc.username,
										password: userDoc.password,
										email: userDoc.email,
										firstName: userDoc.firstName,
										lastName: userDoc.lastName
								}
								console.log("user: "+JSON.stringify(user));
                // In case of any error, return using the done method
                if (err){
										console.log("err" +err);
                    return done(err);
								}
                // Username does not exist, log the error and redirect back
                if (!user){
                    console.log('User Not Found with username '+username);
                    return done(null, false, req.flash('message', 'User Not found.'));
                }
                // User exists but wrong password, log the error
								console.log('checking password')
                if (!isValidPassword(user, password)){
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                }
                // User and password both match, return user from done method
                // which will be treated like success
								console.log("User and password match");
                return done(null, user);
            });
        })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

}
