

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  //, Imager = require('imager')
  , async = require('async')
  , _ = require('underscore')
  , nav = require('../../config/navbar')
  , News = mongoose.model('News')
  , Page = mongoose.model('Page')
;




exports.index = function(req, res){
  res.locals.title = "Teapot - Чайные штуки для китайской чайной церемонии"



  if (req.session.logged) {
    //console.log('Welcome back!');
  }
  else {
    req.session.logged = true;
    //console.log('Welcome!');
  }

  res.locals.navbar = nav.getNavibar();

  res.locals.bc_active = "Главная страница";

  async.parallel([
    function (cb){
      News.find({active: true}).sort('-date').limit(5).exec(function (err, docs) {
        console.log('news', docs);

        res.locals.shownews = (docs.length !== 0);

        res.locals.news = docs;
        cb(err);
      });
    },
    function (cb){
      Page.findOne({url: 'main'}).exec(function (err, docs) {
        //console.log('main page: ',docs);
        //if (docs !== null && docs.length > 0) {
          res.locals.maintopic = docs;
        //}
        cb(err);
      });

    }],
  function(err, results){
    res.render('home/index');
  });




};


exports.get_test = function(req, res){
  res.locals.title = "Teapot - Test"



  if (req.session.logged) {
    //console.log('Welcome back!');
  }
  else {
    req.session.logged = true;
    //console.log('Welcome!');
  }

  res.locals.navbar = nav.getNavibar();

  res.locals.bc_active = "Главная страница";





};

exports.post_test = function(req, res){
  //console.log(req.body);

  res.redirect('/');

};