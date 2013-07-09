var nav = require('../../config/navbar')
  , mongoose = require('mongoose')
  //, Imager = require('imager')
  , async = require('async')
  , Page = mongoose.model('Page')

exports.show = function(req, res, next){

  res.locals.navbar = nav.getNavibar();

  if (req.params.url === 'about') {
    res.locals.active_about = true;
    res.locals.keywords = "teapots, информация, о магазине, Анастасия";
  }
  if (req.params.url === 'delivery') {
    res.locals.active_delivery = true;
    res.locals.keywords = "teapots, доставка, условия, по России, за рубеж";
  }
  if (req.params.url === 'payments') {
    res.locals.active_payments = true;
    res.locals.keywords = "teapots, оплата, Visa, mastercart, Сбербанк";
  }


  res.locals.bc_list = [{
        name: "Главная страница",
        href: "/"
      }];

  Page.findOne({url: req.params.url, active: true}).exec(function (err, doc) {
    //console.log('main page: ',doc);
    if (doc === null) {
      return next(new Error('Page not found!'));
    }

    res.locals.topic = doc;
    //}
    res.locals.bc_active = doc.name;
    res.locals.title = "Teapots - " + doc.name;

    res.render('pages/show');
  });

};