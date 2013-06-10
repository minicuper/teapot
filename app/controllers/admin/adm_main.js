  

/**
 * Module dependencies.
 */

var async = require('async')
  , _ = require('underscore')
  ;




exports.index = function(req, res){
  res.locals.title = "Teapot - Админка"
    
  res.locals.bc_active = "Главная страница";
  
  res.render('admin/layouts/main', {
    layout: 'admin/layouts/default',
    partials: {
      adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
      adm_sidebar: 'admin/layouts/adm_sidebar',
      adm_navbar: 'admin/layouts/adm_navbar',
    }
  });

};
