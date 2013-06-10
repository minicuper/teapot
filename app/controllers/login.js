  

/**
 * Module dependencies.
 */

var passport = require('passport')
  
  , nav = require('../../config/navbar')
;




exports.loginRender = function(req, res){
  
  res.locals.navbar = nav.getNavibar();
    
    res.locals.bc_list = [{
        name: "Главная страница",
        href: "/"
      }];
      
  res.locals.bc_active = "Авторизация";
  
  res.locals.message = req.flash('error');
    
  res.render('login/login');

};

exports.loginCheck = function(req, res){
  
  res.redirect('/admin');

};

exports.loginLogout =  function(req, res){
  req.logout();
  res.redirect('/login');
};