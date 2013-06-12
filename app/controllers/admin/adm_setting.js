var async = require('async')
  , _ = require('underscore')
  , mongoose = require('mongoose')
  , Setting = mongoose.model('Setting')
  , set = require('../../../config/middlewares/settings')
;


exports.edit = function(req, res, next){

  res.locals.title = "Teapot - Создание страницы";

  res.locals.bc_list = [{
    name: "Главная страница админки",
    href: "/admin"
  }];

  res.locals.sidebar = {settingclass: "active"};

  res.locals.bc_active = 'Настройки';

  Setting.findOne({}, function(err, doc){

    if (err) {
      return next(new Error('Page not found!'));
    }

    req.flash('success', 'Настройки сохранены.');

    res.locals.setting = doc;

    res.render('admin/setting/edit', {
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

exports.create = function(req, res, next){

  var doc = new Setting(req.body);

  doc.save(function(err, val){
    if (err) {
      next(new Error('Erron is saving settings!'));
    }
    req.flash('success', 'Настройки сохранены.');
    res.redirect('/admin/setting');

    set.init();
  });

}

exports.update = function(req, res, next){
  var id = req.body._id;

  delete req.body._id;

  Setting.findByIdAndUpdate(id, req.body, function(err, saved) {


    if( err || !saved ) {
      console.log("Post not updated: "+err);
    } else {
      //console.log("Post updated: %s", saved);
    }

    if (err) {
      next(new Error('Error while updating settings!'));
    }

    req.flash('success', 'Настройки сохранены.');

    res.redirect('/admin/setting');

    set.init();

  });


}
