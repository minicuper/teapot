
var async = require('async')
    , mongoose = require('mongoose')
    , Category = mongoose.model('Category')

module.exports = function (app, passport, auth) {


  // login routes

  var login    = require('../app/controllers/login');

  app.get('/login', login.loginRender);
  app.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), login.loginCheck);
  app.get('/logout', login.loginLogout);


  // home routes
  var home    = require('../app/controllers/home');

  app.get('/', home.index);

  // app.get('/test', home.get_test);
  // app.post('/test', home.post_test);

  // catalog routes
  var catalog = require('../app/controllers/catalog');

  app.get('/catalog/', catalog.index);
  app.get('/catalog/:cat/', catalog.index_cat);
  app.get('/catalog/:id', catalog.show);

  // order routes

  var order = require('../app/controllers/order');

  app.get('/order',    order.makeOrder);
  app.post('/order',    order.postOrder);
  app.get('/order/complete',    order.completeOrder);

  // find routes

  var find = require('../app/controllers/find');

  app.get('/find/', find.index);

  // app.get('/addcat/',    function(req, res){
  //     cat = new Category({name: "Чайники", url: "teapots", active: true });
  //     cat.save();

  //     cat = new Category({name: "Доски", url: "teabords", active: true });cat.save();
  //     cat = new Category({name: "Чашки", url: "teacups", active: true });cat.save();
  //     cat = new Category({name: "Гайвани", url: "gaivans", active: true });cat.save();
  //     cat = new Category({name: "Фигурки", url: "teapets", active: true });cat.save();
  //     console.log(cat);

  //     res.redirect('/');

  // });

  // cart routes

  var cart = require('../app/controllers/cart');

  app.get ('/cart',       cart.list);
  app.put ('/cart/:id',   cart.update);
  app.del ('/cart/:id',   cart.delete);
  app.post('/cart/:id',   cart.create);

  // Админка +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  var adm_main = require('../app/controllers/admin/adm_main');
  app.get ('/admin', auth.requiresLogin, adm_main.index);

  var adm_order = require('../app/controllers/admin/adm_order');
  app.post('/admin/order',      auth.requiresLogin, adm_order.create);
  app.get ('/admin/order/:id/edit',  auth.requiresLogin, adm_order.edit);
  app.put ('/admin/order/:id',  auth.requiresLogin, adm_order.update);
  app.del ('/admin/order/:id',  auth.requiresLogin, adm_order.delete);
  app.get ('/admin/order',      auth.requiresLogin, adm_order.list);

  var adm_category = require('../app/controllers/admin/adm_category');
  app.post('/admin/category',      auth.requiresLogin, adm_category.create);
  app.get ('/admin/category/new',      auth.requiresLogin, adm_category.new);
  app.get ('/admin/category/:id/edit',  auth.requiresLogin, adm_category.edit);
  app.put ('/admin/category/:id',  auth.requiresLogin, adm_category.update);
  app.del ('/admin/category/:id',  auth.requiresLogin, adm_category.delete);
  app.get ('/admin/category',      auth.requiresLogin, adm_category.list);


  var adm_news = require('../app/controllers/admin/adm_news');
  app.post('/admin/news',      auth.requiresLogin, adm_news.create);
  app.get ('/admin/news/new',      auth.requiresLogin, adm_news.new);
  app.get ('/admin/news/:id/edit',  auth.requiresLogin, adm_news.edit);
  app.put ('/admin/news/:id',  auth.requiresLogin, adm_news.update);
  app.del ('/admin/news/:id',  auth.requiresLogin, adm_news.delete);
  app.get ('/admin/news',      auth.requiresLogin, adm_news.list);

  var adm_page = require('../app/controllers/admin/adm_page');
  app.post('/admin/page',      auth.requiresLogin, adm_page.create);
  app.get ('/admin/page/new',      auth.requiresLogin, adm_page.new);
  app.get ('/admin/page/:id/edit',  auth.requiresLogin, adm_page.edit);
  app.put ('/admin/page/:id',  auth.requiresLogin, adm_page.update);
  app.del ('/admin/page/:id',  auth.requiresLogin, adm_page.delete);
  app.get ('/admin/page',      auth.requiresLogin, adm_page.list);

  var adm_product = require('../app/controllers/admin/adm_product');
  app.post('/admin/product',      auth.requiresLogin, adm_product.create);
  app.get ('/admin/product/new',      auth.requiresLogin, adm_product.new);
  app.get ('/admin/product/:id/edit',  auth.requiresLogin, adm_product.edit);
  app.put ('/admin/product/:id',  auth.requiresLogin, adm_product.update);
  app.del ('/admin/product/:id',  auth.requiresLogin, adm_product.delete);
  app.get ('/admin/product',      auth.requiresLogin, adm_product.list);

  var adm_setting = require('../app/controllers/admin/adm_setting');
  app.post('/admin/setting',      auth.requiresLogin, adm_setting.create);
  app.put ('/admin/setting',      auth.requiresLogin, adm_setting.update);
  app.get ('/admin/setting',      auth.requiresLogin, adm_setting.edit);
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // var statics = require('../app/controllers/static');

  // app.get('/about/',    statics.about);
  // app.get('/delivery/', statics.delivery);
  // app.get('/payments/', statics.payments);

  var pages = require('../app/controllers/pages');

  app.get('/:url/', pages.show);


  // // comment routes
  // var comments = require('../app/controllers/comments')
  // app.post('/articles/:id/comments', auth.requiresLogin, comments.create)

  // // tag routes
  // var tags = require('../app/controllers/tags')
  // app.get('/tags/:tag', tags.index)

}
