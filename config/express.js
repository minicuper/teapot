/**
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , helpers = require('view-helpers')
  //art
  , hogan = require('hogan-express')
  , _ = require('underscore')
  , errors = require('./middlewares/errors')
  , cart = require('./middlewares/cart')
  , settings = require('./middlewares/settings')
  , force = require('express-force-domain')
  , env = process.env.NODE_ENV || 'development'
  // , nav = require('./navbar');
;
  //art

module.exports = function (app, config, passport) {

  app.set('showStackError', true);
  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }));
  app.use(express.favicon());
  app.use(express.static(config.root + '/public'));

  // don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

  // set views path, template engine and default layout
  //app.set('views', config.root + '/app/views')
  //app.set('view engine', 'jade')

  app.engine('html', hogan);

  app.set('layout', 'layouts/default');

  app.set('partials', {
    navbar:     'layouts/navbar',
    cart:       'layouts/cart',
    catalog:    'layouts/catalog',
    breadcrumb: 'layouts/breadcrumb',
    adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
    adm_sidebar: 'admin/layouts/adm_sidebar',
    adm_navbar: 'admin/layouts/adm_navbar',
  });

  app.set('view engine', 'html');
  app.set('views', config.root + '/app/views');

  app.enable('view cache');

  // var cart_fuller = require('./middlewares/cart')

  app.configure(function () {
    // dynamic helpers
    //app.use(helpers(config.app.name));

    // cookieParser should be above session
    app.use(express.cookieParser());

    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // express/mongo session storage
    app.use(express.session({
      secret: 'teapot123456789654',
      store: new mongoStore({
        url: config.db,
        auto_reconnect: true,
        collection : 'sessions'
      })
    }));

    // connect flash for flash messages
    app.use(flash());

    app.use(helpers(config.app.name));

    //console.log(cart);

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // use settings from db

    // console.log("new version!");

    app.use(settings.setLocals);
    app.use(cart.getCart);

    app.use(function(req, res, next){
      // console.log('originalUrl', req.originalUrl);
      // console.log('url', req.url);
      // console.log('host', req.host);
      // console.log('headers', req.headers);
      //console.log('session: ', req.sessionID);
      next();
    });

    //Redirect to teapots.su
    if (env === 'production'){
      app.use(force(config.app.url));
    }

    // routes should be at the last
    app.use(app.router);

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(errors.get500);

    // assume 404 since no middleware responded
    app.use(errors.get404);

  });
};
