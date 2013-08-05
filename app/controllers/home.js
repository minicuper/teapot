

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
  var monthAgo;

  res.locals.title = "Teapots - магазин чайников и чайных штук"
  //res.locals.description = "Интернет-магазин чайников и чайной утвари. Китайские чайники из иссинской глины, тайваньские чашки, фигурки для чайной церемонии, чайные доски.";
  //res.locals.keywords = "чайники, чайная утварь, фигурки, чашки, чайная церемония";

  if (req.session.logged) {
    //console.log('Welcome back!');
  }
  else {
    req.session.logged = true;
    //console.log('Welcome!');
  }

  res.locals.navbar = nav.getNavibar();

  res.locals.bc_active = "Главная страница";

  var addMonthToDate = function(date, monthes) {
    var result = new Date(date);
    result.setMonth(date.getMonth()+monthes);
    return result;
  };

  monthAgo = addMonthToDate(new Date(), -1);

  async.parallel([
    function (cb){
      News.getNews(1, function (err, docs) {
        //console.log('news', docs);

        res.locals.shownews = (docs.length !== 0);

        res.locals.news = docs;
        cb(err);
      });
    },
    function (cb){
      Page.getMainPage(function (err, docs) {
        //console.log('main page: ',docs);
        //if (docs !== null && docs.length > 0) {
        //console.log('error in main page: ', err);
        res.locals.keywords     = docs.meta.keywords;
        res.locals.description  = docs.meta.description;
        res.locals.maintopic = docs;
          
        //}
        cb(err);
      });

    }],
  function(err, results){
    res.render('home/index');
  });

};


