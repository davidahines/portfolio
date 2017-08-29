var database = require('../db');
var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}
// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    // check in mongo if a user with username exists or not
    var usersCollection = database.get().collection('posts');
    usersCollection.findOne({ 'username' :  username }, function(err, user) {
      // In case of any error, return using the done method
      if (err)
        return done(err);
      // Username does not exist, log error & redirect back
      if (!user){
        console.log('User Not Found with username '+username);
        return done(null, false,
              req.flash('message', 'User Not found.'));
      }
      // User exists but wrong password, log the error
      if (!isValidPassword(user, password)){
        console.log('Invalid Password');
        return done(null, false,
            req.flash('message', 'Invalid Password'));
      }
      // User and password both match, return user from
      // done method which will be treated like success
      return done(null, user);
    });
  }
}));
passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      var usersCollection = database.get().collection('posts');
      usersCollection.findOne({ 'username' :  username }, function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false,
          req.flash('message','User Already Exists'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.param('email');
          newUser.firstName = req.param('firstName');
          newUser.lastName = req.param('lastName');

          // save the user
          postsCollection.findOneAndUpdate({_id: ObjectId(req.params.id)}, postUpdate, function(err, postDoc) {
            if (err){
              console.log('Error in Saving user: '+err);
              throw err;
            }
            console.log('User Registration succesful');
            return done(null, newUser);
          });
        }
      });
    };

    // Delay the execution of findOrCreateUser and execute
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  });
);
