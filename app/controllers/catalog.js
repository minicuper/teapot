
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
  , async = require('async');


exports.show = function(req, res, next){

  if (req.xhr === false) {//обычный HTML-запрос
    var navbar = nav.getNavibar()
        ;

    res.locals.navbar = navbar;

    res.locals.bc_list = [
      {
          name: "Главная страница",
          href: "/"
      },{
          name: "Каталог",
          href: "/catalog/"
      }
      ];

    Product.findById(req.params.id, function (err, doc){

      if (err) {
        //console.log('error in individual product');
        return next(new Error('Page not found!'));
      }
      if (doc.active === false || doc.count === 0){
        doc.disabled = true;
      }

      res.locals.title = "Teapots - " + doc.name;
      res.locals.description  = doc.meta.description;
      res.locals.keywords     = doc.meta.keywords;


      res.locals.product = doc;
      res.locals.product_img_empty = (doc.images.length === 0);
      res.locals.product_ref_empty = (doc.refs.length === 0);

      res.locals.bc_active = doc.name;
      res.render('catalog/show');
    });

  } else { //req.xhr
    Product.findById(req.params.id, function (err, doc){

      if (err) {
        //console.log('error in individual product');
        return next(new Error('Page not found!'));
      }
      var respond = {
        id: doc._id,
        name: doc.name,
        price: doc.price,
        cost: doc.price,
        count: 0,
        max_count: doc.count,
        unit: doc.unit
      };

      res.send(respond);
    });
  }


};

exports.index = function(req, res){

  res.redirect('/catalog/teapots/');

};

exports.index_cat = function(req, res, next){

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
    },{
        name: "Каталог",
        href: "/catalog/"
    }
    ];

  async.series([
    function(callback) {
      Category.findOne({"url": url}, function(err, doc){

        if (err) return callback(err);
        if (doc === null) return callback(true);

        res.locals.title = "Teapots - " + doc.name;
        res.locals.description  = doc.meta.description;
        res.locals.keywords     = doc.meta.keywords;

        cat_id = doc._id;
        res.locals.bc_active = doc.name;
        res.locals.category = doc;
        //console.log(cat_id);
        callback();

      });
    },
    function(callback) {
      Product.find({"category": cat_id, active: true, count:{$ne: 0}}).sort({priority: -1, date: -1}).exec(function (err, docs) {
        //console.log('product - was here');
        if (err) return callback(err);
        res.locals.products = docs;
        callback();
      });
    }
  ], function(err){
    if (err) {
      //console.log('error in db - products', err);
      return next(new Error('Page not found!'));

    } else {

    }

    res.render('catalog/index');
  });



};