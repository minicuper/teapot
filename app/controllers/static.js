var nav = require('../../config/navbar')

exports.about = function(req, res){
  
  res.locals.navbar = nav.getNavibar();
  res.locals.active_about = true;
  
  res.locals.bc_list = [{
        name: "Главная страница",
        href: "/"
      }];
  res.locals.bc_active = "О нас";

  res.render('static/about');

};

exports.payments = function(req, res){
  
  res.locals.navbar = nav.getNavibar();
  res.locals.active_payments = true;
  
  res.locals.bc_list = [{
        name: "Главная страница",
        href: "/"
      }];
  res.locals.bc_active = "Оплата";
      

  res.render('static/payments');

};

exports.delivery = function(req, res){
  
  res.locals.navbar = nav.getNavibar();
  res.locals.active_delivery = true;
  
  res.locals.bc_list = [{
        name: "Главная страница",
        href: "/"
      }];
  res.locals.bc_active = "Доставка";

  res.render('static/delivery');

};