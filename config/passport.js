
var env = process.env.NODE_ENV || 'development'
  , mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , config = require('./config')[env]
  // , TwitterStrategy = require('passport-twitter').Strategy
  // , FacebookStrategy = require('passport-facebook').Strategy
  // , GitHubStrategy = require('passport-github').Strategy
  // , GoogleStrategy = require('passport-google-oauth').Strategy
  // , User = mongoose.model('User')


module.exports = function (passport, config) {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser(function(user, done) {
    //done(null, user.id)
    done(null, user);
  })

  passport.deserializeUser(function(id, done) {
    //User.findOne({ _id: id }, function (err, user) {
    //  done(err, user)
    //})
    done(null, id);
  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'password'
    },
    function(login, password, done) {
      //User.findOne({ email: email }, function (err, user) {
        //if (err) { return done(err) }
        if (login !== config.admin.login) {
          return done(null, false, {message: 'Неизвестный пользователь'});
        }
        if (password !==config.admin.password) {
          return done(null, false, {message: 'Неправильный пароль'});
        }
        return done(null, login);
      //})
    }
  ));


}
