var async = require('async')
  , _ = require('underscore')
  , mongoose = require('mongoose')
  , News = mongoose.model('News')
  ;

exports.list = function(req, res){

  res.locals.title = "Teapots - Новости"

  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  }];

  res.locals.sidebar = {newsclass: "active"};

  res.locals.bc_active = "Новости";

  News.getAllNews(function (err, docs) {

    //console.log('news - was here');

    if (err) return err;

    res.locals.news = docs;

    res.locals.scripts = [
        '/js/adm/adm.news.js'
    ];

    res.render('admin/news/list', {
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
    res.locals.title = "Teapot - Создание новости"

  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  },{
    name: "Новости",
    href: "/admin/news"
  }];

  res.locals.sidebar = {newsclass: "active"};


    res.locals.css = [
      'bootstrap-wysihtml5.css'
    ];

    res.locals.scripts = [
      '/js/lib/wysihtml5/wysihtml5-0.4.0pre.min.js',
      '/js/lib/wysihtml5/bootstrap-wysihtml5.js',
      '/js/lib/wysihtml5/bootstrap-wysihtml5.ru-RU.js',
      '/js/adm/adm.news.new.js'
    ];

  // res.locals.scripts = [
  //   'cleditor/jquery.cleditor.js',
  //   'adm.news.new.js'
  // ];

  // res.locals.css = [
  //   'cleditor/jquery.cleditor.css'
  // ];


  res.locals.bc_active = 'Создание новости';


  res.render('admin/news/new', {
    layout: 'admin/layouts/default'
    // ,
    // partials: {
    //   adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
    //   adm_sidebar: 'admin/layouts/adm_sidebar',
    //   adm_navbar: 'admin/layouts/adm_navbar',
    // }
  });


  // });


}

exports.create = function(req, res){
  var doc = new News(req.body);

  doc.save(); //console.log(doc);

  res.redirect('/admin/news');
}

exports.edit = function(req, res){
    res.locals.title = "Teapots - Редактирование новости"

  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  },{
    name: "Новости",
    href: "/admin/news"
  }];

  res.locals.sidebar = {newsclass: "active"};


    res.locals.css = [
      'bootstrap-wysihtml5.css'
    ];

    res.locals.scripts = [
      '/js/lib/wysihtml5/wysihtml5-0.4.0pre.min.js',
      '/js/lib/wysihtml5/bootstrap-wysihtml5.js',
      '/js/lib/wysihtml5/bootstrap-wysihtml5.ru-RU.js',
      '/js/adm/adm.news.new.js'
    ];

  News.findById(req.params.id).exec(function (err, docs) {

    //console.log('order - was here');

    if (err) return err;

    res.locals.news = docs;

    res.locals.bc_active = "Новость '"+docs.name+"'";

    // res.locals.scripts = [
    //   'adm.order.js'
    // ];

    res.render('admin/news/edit', {
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

exports.update = function(req, res){
  //console.log('Old ', req.body);

  var obj = {}
    , id = req.body._id;

  delete req.body._id;



  var new_doc = News.findByIdAndUpdate(id, req.body, function(err, saved) {

    if( err || !saved ) {
      console.log("Post not updated: "+err);
    } else {
      //console.log("Post updated: %s", saved);
    }

  });

  res.redirect('/admin/news');
}

exports.delete = function(req, res){

}