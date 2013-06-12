
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

    //console.log(url_name);
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

        //console.log('category - was here');
        //console.log(url);
        //console.log(doc);

        if (err) return callback(err);
        if (doc === null) return callback(true);

        cat_id = doc._id;
        cat = doc;
        //console.log(cat_id);
        callback();

      });
    },
    function(callback) {
      Product.find({"category": cat_id, active: true, count:{$ne: 0}}).sort('-date').exec(function (err, docs) {
        //console.log('product - was here');
        if (err) return callback(err);
        res.locals.products = docs;
        callback();
      });
    }
  ], function(err){
    if (err) {
      console.log('error in db - products', err);
      return next(new Error('Page not found!'));

    } else {

    }
    res.locals.bc_active = cat.name;
    res.render('catalog/index');
  });

      //console.log(docs);
      // prod = new Product({
      //   "title":"Чайник 'Джуни' 110 мл.",
      //   "main_image": "https://lh5.googleusercontent.com/-JNzrPc9wNMI/T4_eqRjYZCI/AAAAAAAABRw/_TJnaEMPSEk/s800/4.jpg",
      //   "description": "<p>Чайники из исинской глины – это глубочайшая тема. Она намного глубже, чем может показаться на первый взгляд. Возможно, непосвященный пользователь улыбнется этому. Но на самом деле в производстве исинских чайников в Китае заняты миллионы людей. Я не оговорился. Тут это и ремесло, и древняя традиция, и вид искусства одновременно.</p>",
      //   "active": true,
      //   "count": 1,
      //   "price": 5600,
      //   "unit": "шт.",
      //   "category": doc._id,
      //   "images":
      //   [
      //   	"https://lh4.googleusercontent.com/-u8yfqMzvRac/T5ZptchAjXI/AAAAAAAABS0/rYc7XqXw_tI/s800/3.jpg",
      //   	"https://lh6.googleusercontent.com/-PIgk2t0Bqg0/T4_ep7Fvo5I/AAAAAAAABRs/CwwH7PQaS6k/s800/3.jpg"
      //   ],

      //   "refs":
      //   [
      //   	{name:"Бегство от суеты", url: "http://anastazia2008.livejournal.com/95215.html"},
      //   	{name:"Чай без никого", url: "http://anastazia2008.livejournal.com/94868.html"}
      //   ]
      // });
      // prod.save();



};