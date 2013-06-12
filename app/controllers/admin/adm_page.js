var async = require('async')
  , _ = require('underscore')
  , mongoose = require('mongoose')
  , Page = mongoose.model('Page')
  ;

exports.list = function(req, res){
  
  res.locals.title = "Teapot - Страницы"
  
  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  }]; 
    
  res.locals.sidebar = {pageclass: "active"};
  
  res.locals.bc_active = "Страницы";
  
  Page.find().exec(function (err, docs) {
    
    //console.log('page - was here');
    
    if (err) return err;
  
    res.locals.pages = docs;
    
    res.locals.scripts = [
       '/js/adm/adm.page.js'
    ];
    
    res.render('admin/page/list', {
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
  res.locals.title = "Teapot - Создание страницы";
  
  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  },{
    name: "Страницы",
    href: "/admin/page"
  }]; 
    
  res.locals.sidebar = {pageclass: "active"};
  
  
  
  // res.locals.scripts = [
  //   'cleditor/jquery.cleditor.js',
  //   'adm.news.new.js'
  // ];
  
  // res.locals.css = [
  //   'cleditor/jquery.cleditor.css'
  // ];
  
  
  res.locals.bc_active = 'Создание страницы';
    
    
  res.render('admin/page/new', {
    layout: 'admin/layouts/default',
    partials: {
      adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
      adm_sidebar: 'admin/layouts/adm_sidebar',
      adm_navbar: 'admin/layouts/adm_navbar',
    }
  });
  
    
  // });


}

exports.create = function(req, res){
  var doc = new Page(req.body);
  
  doc.save(); //console.log(doc);
  
  res.redirect('/admin/page');
}

exports.edit = function(req, res){
    res.locals.title = "Teapot - Редактирование страницы";
  
  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  },{
    name: "Страницы",
    href: "/admin/page"
  }]; 
    
  res.locals.sidebar = {pageclass: "active"};
  
  
  
  // res.locals.scripts = [
  //   'moment/moment.js',
  //   'moment/lang/ru.js',
  //   'adm.order.status.js'
  // ];
  
  Page.findById(req.params.id).exec(function (err, docs) {
    
    //console.log('order - was here');
    
    if (err) return err;
  
    res.locals.page = docs;
    
    res.locals.bc_active = "Страница '"+docs.name+"'";
    
    // res.locals.scripts = [
    //   'adm.order.js'
    // ];
    
    res.render('admin/page/edit', {
      layout: 'admin/layouts/default',
      partials: {
        adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
        adm_sidebar: 'admin/layouts/adm_sidebar',
        adm_navbar: 'admin/layouts/adm_navbar',
      }
    });
  
    
  });
}

exports.update = function(req, res){
  //console.log('Old ', req.body);
  
  var obj = {}
    , id = req.body._id;
      
  delete req.body._id;
  

  
  var new_doc = Page.findByIdAndUpdate(id, req.body, function(err, saved) {
  
    if( err || !saved ) {
      console.log("Post not updated: "+err);
    } else {
      //console.log("Post updated: %s", saved);
    }
    
    res.redirect('/admin/page');

  });
    

}

exports.delete = function(req, res){
  
}