

/**
 * Module dependencies.
 */

var async = require('async')
  , _ = require('underscore')
  , mongoose = require('mongoose')
  , Product = mongoose.model('Product')
  , Order = mongoose.model('Order')
  ;




exports.index = function(req, res){
  var today, yesterday;
  res.locals.title = "Teapots - Админка"

  res.locals.bc_active = "Главная страница";

    today = new Date();
    yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    //console.log(yesterday);

    Order.find({date: {$gt: yesterday}}).sort("-date").exec(function (err, docs) {

    //console.log('order - was here');

    if (err) return err;

    res.locals.orders = docs;

    res.render('admin/layouts/main', {
      layout: 'admin/layouts/default'
      // ,
      // partials: {
      //   adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
      //   adm_sidebar: 'admin/layouts/adm_sidebar',
      //   adm_navbar: 'admin/layouts/adm_navbar',
      // }
    });


  });




};
