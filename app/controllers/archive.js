
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  //, Imager = require('imager')
  , async = require('async')
  , Product = mongoose.model('Product')
  , Category = mongoose.model('Category')
  , _ = require('underscore')
  , nav = require('../../config/navbar')
  , async = require('async')

;


exports.index = function(req, res, next){

  var url = req.params.cat
      , navbar = nav.getNavibar(url)
      , url_name = nav.getNavibarName(url, navbar)
      , prod_list
      , cat_id, cat
  ;

  res.locals.navbar = navbar;


  //console.log(navbar, url);

  res.locals.active_catalog = true;

  res.locals.bc_list = [
  {
      name: "Главная страница",
      href: "/"
  }];
  res.locals.title = "Teapots - Архив";

  res.locals.description  = "";
  res.locals.keywords     = "";

  res.locals.bc_active = 'Архив';

  res.locals.scripts = [
    'lib/jquery.scrollTo.min.js',
    'scroll.js'
  ];


  Product.getUnavailableProducts(function (err, docs) {
        //console.log('product - was here');
        if (err) return next(err);
        res.locals.products = docs;
        res.locals.enable_upbutton = (docs.length > 1);
        res.render('catalog/index');
      });
};