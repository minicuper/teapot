var async = require('async')
  , _ = require('underscore')
  , mongoose = require('mongoose')
  , Product = mongoose.model('Product')
  , Category = mongoose.model('Category')
  ;

exports.list = function(req, res){

  res.locals.title = "Teapots - Товары"

  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  }];

  res.locals.sidebar = {productclass: "active"};

  res.locals.bc_active = "Товары";

  res.locals.scripts = [
    '/js/adm/adm.product.js'
  ];

  var filter = {}, categoryId;
  if (req.query.category !== undefined && req.query.category!=='') {
    filter.category = req.query.category;
    categoryId = filter.category;
  } else {
    res.locals.filter = {categoryNo: true};
  }

  //console.log(filter);

  async.parallel([
    function(cb){
      Product.find(filter).sort({category: 1, priority: -1, date: -1}).populate('category').exec(function (err, docs) {

        //console.log('product - was here');

        res.locals.products = docs;

        cb(err, docs);

      });

    },
    function(cb){
      Category.find().sort({order: 1}).exec(function (err, docs) {

        //console.log('category - was here');

        _.each(docs, function(doc){
          doc.selected = doc._id.toString() === categoryId;
          //console.log(doc._id.toString(), categoryId, doc._id.toString() === categoryId, doc.selected);

        })

        res.locals.categories = docs;

        cb(err, docs);

      });
    }],

  function(err, result){

    res.render('admin/product/list', {
      layout: 'admin/layouts/default'
      // ,
      // partials: {
      //   adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
      //   adm_sidebar: 'admin/layouts/adm_sidebar',
      //   adm_navbar: 'admin/layouts/adm_navbar',
      // }
    });

  });


}

exports.new = function(req, res){
  res.locals.title = "Teapots - Создание товара";

  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  },{
    name: "Товары",
    href: "/admin/product"
  }];

  res.locals.sidebar = {productclass: "active"};

  res.locals.css = [
    'bootstrap-wysihtml5.css'
  ];

  res.locals.scripts = [
    '/js/lib/wysihtml5/wysihtml5-0.4.0pre.min.js',
    '/js/lib/wysihtml5/bootstrap-wysihtml5.js',
    '/js/lib/wysihtml5/bootstrap-wysihtml5.ru-RU.js',
    '/js/lib/holder.js',
    '/js/adm/adm.product.edit.js'
  ];

  Category.find().exec(function (err, docs) {

    //console.log('category - was here');

    res.locals.categories = docs;

    res.locals.bc_active = 'Создание продукта';


    res.render('admin/product/edit', {
      layout: 'admin/layouts/default'
    });

  });
}

exports.create = function(req, res){
  var doc = new Product(req.body);

  doc.save(); //console.log(doc);

  res.redirect('/admin/product?category=' + doc.category);
}

exports.edit = function(req, res, next){
  var categoryId;

  res.locals.title = "Teapots - Редактирование товара";

  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  },{
    name: "Товары",
    href: "/admin/product"
  }];

  res.locals.sidebar = {productclass: "active"};

  res.locals.css = [
    'bootstrap-wysihtml5.css'
  ];

  res.locals.scripts = [
    '/js/lib/wysihtml5/wysihtml5-0.4.0pre.min.js',
    '/js/lib/wysihtml5/bootstrap-wysihtml5.js',
    '/js/lib/wysihtml5/bootstrap-wysihtml5.ru-RU.js',
    '/js/lib/holder.js',
    '/js/adm/adm.product.edit.js'
  ];

  async.series([
    function(cb){
      Product.findById(req.params.id).exec(function (err, docs) {

        //console.log('product - was here');

        res.locals.product = docs;

        categoryId = docs.category;

        res.locals.bc_active = "Товар '"+docs.name+"'";

        cb(err, docs);

      });

    },
    function(cb){
      Category.find().exec(function (err, docs) {

        //console.log('category - was here');

        _.each(docs, function(doc){
          doc.selected = doc._id.equals(categoryId);
          //console.log(doc._id.toString(), categoryId, doc._id.toString() === categoryId, doc.selected);

        })

        res.locals.categories = docs;

        cb(err, docs);

      });
    }],

  function(err, result){

    if (err) {
      //console.log('Ошибка при получении товара и категории из БД!');
      return next(err)
    }

    res.render('admin/product/edit', {
      layout: 'admin/layouts/default'
      // ,
      // partials: {
      //   adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
      //   adm_sidebar: 'admin/layouts/adm_sidebar',
      //   adm_navbar: 'admin/layouts/adm_navbar',
      // }
    });

  });

}

exports.update = function(req, res, next){
  var id = req.body._id;

  if (!req.body.active) {req.body.active = false;}

  //console.log('Before save: ', req.body);

  delete req.body._id;

  Product.findByIdAndUpdate(id, req.body, function(err, saved) {

    if( err || !saved ) {
      console.log("Post not updated: "+err);
    } else {
      //console.log("Post updated: %s", saved);
    }

    if (err) {return next(err)}

    res.redirect('/admin/product?category=' + saved.category);

  });


}

exports.delete = function(req, res){

}