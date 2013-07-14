

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  //, Imager = require('imager')
  , async = require('async')
  , Product = mongoose.model('Product')
  , _ = require('underscore')
  , nav = require('../../config/navbar')
;




exports.index = function(req, res, next){
  var query = req.query.query;

  res.locals.navbar = nav.getNavibar();

    res.locals.bc_list = [{
        name: "Главная страница",
        href: "/"
      }];

  res.locals.bc_active = "Результаты поиска";

  res.locals.query = query;

  //console.log('flash query', res.locals.query);
  //console.log(req.query);



  //console.log(Product);

  Product.findFullText(query, function(err, results){

    if (err) {
      //console.log('error in find: ', err);
      return next(new Error('Page not found!'));
    }

    //req.flash('query', query);

    res.locals.results = results;

    //console.log('output: ', output);
    //console.log('results: ', results);

    res.render('find/index');

  });



};
