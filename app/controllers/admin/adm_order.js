 /**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')
  , Product = mongoose.model('Product')
  , Order = mongoose.model('Order')

  ;


exports.create = function(req, res){

};

exports.edit = function(req, res){
res.locals.title = "Teapot - Заказы"

  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  },{
    name: "Заказы",
    href: "/admin/order"
  }];

  res.locals.sidebar = {orderclass: "active"};

  res.locals.bc_active = "Заказ №"+req.params.id;

  res.locals.scripts = [
    '/js/lib/moment/moment.js',
    '/js/lib/moment/lang/ru.js',
    '/js/adm/adm.order.edit.js'
  ];

  Order.findById(req.params.id).exec(function (err, docs) {

    console.log('order - was here');

    if (err) return err;

    res.locals.order = docs;

    // res.locals.scripts = [
    //   'adm.order.js'
    // ];

    res.render('admin/order/read', {
      layout: 'admin/layouts/default',
      partials: {
        adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
        adm_sidebar: 'admin/layouts/adm_sidebar',
        adm_navbar: 'admin/layouts/adm_navbar',
      }
    });


  });


};

exports.update = function(req, res){

  //console.log('Old ', req.body);

  var obj = {},
      id = req.body._id;

  delete req.body._id;



  var new_doc = Order.findByIdAndUpdate(id, req.body, function(err, saved) {

    if( err || !saved ) {
      //console.log("Post not updated: "+err);
    } else {
      //console.log("Post updated: %s", saved);
    }

  });

  res.redirect('/admin/order');
};

exports.delete = function(req, res){
  res.redirect('/admin');
};


exports.list = function(req, res){
  res.locals.title = "Teapot - Заказы"

  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  }];

  res.locals.sidebar = {orderclass: "active"};

  res.locals.bc_active = "Заказы";

  Order.find().exec(function (err, docs) {

    console.log('order - was here');

    if (err) return err;

    res.locals.orders = docs;

    // res.locals.scripts = [
    //   '/js/adm/adm.order.js'
    // ];

    res.render('admin/order/list', {
      layout: 'admin/layouts/default',
      partials: {
        adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
        adm_sidebar: 'admin/layouts/adm_sidebar',
        adm_navbar: 'admin/layouts/adm_navbar',
      }
    });


  });



};
