

/**
 * Module dependencies.
 */

var env = process.env.NODE_ENV || 'development'
  , mongoose = require('mongoose')
  //, Imager = require('imager')
  , async = require('async')
  , Product = mongoose.model('Product')
  , _ = require('underscore')
  , nav = require('../../config/navbar')
  , nodemailer = require('nodemailer')
  , Hogan = require('hogan.js')
  , path = require('path')
  , _ = require('underscore')
  , Product = mongoose.model('Product')
  , Order = mongoose.model('Order')
  , config = require('../../config/config')[env]  // , set = require('../../config/middlewares/settings')

;

// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
        auth: {
            user: config.mail.login,
            pass: config.mail.password
        }
    });

var processTemplate = function (tplPath, locals) {
    var templatePath = path.normalize(__dirname + '/../../app/mailer/templates');
    var tpl = require('fs').readFileSync(templatePath+'/'+tplPath+'.html', 'utf8');
    var template = Hogan.compile(tpl);

    return template.render(locals);
}

// Шлем почту покупателю
var sendmail_to_bayer = function(order){

  var message = {
      from: 'Анастасия Заяц <bobr.zav@gmail.com>',
      to: '"Артур Заяц" <zag2art@gmail.com>',
      subject: 'Ваш заказ успешно сформирован!', //
      headers: {'X-Laziness-level': 1000},

      // plaintext body
      //text: 'Заказ сформирован!',

      // // HTML body
      html: processTemplate('sb_complite', order)

  };

  console.log('Sending Mail');

  transport.sendMail(message, function(error){

    if(error){
        console.log('Error occured');
        console.log(error.message);
        return;
    }
    console.log('Message sent successfully!');

    // if you don't want to use this transport object anymore, uncomment following line
    //transport.close(); // close the connection pool
  });
};
// Шлем почту продавцу
var sendmail_to_seller = function(order){

  var message = {

    from: 'Анастасия Заяц <bobr.zav@gmail.com>',
    to: '"Анастасия Заяц" <bobr.zav@gmail.com>',
    subject: 'Новый заказ в интернет-магазине "TeaPot"',
    headers: {'X-Laziness-level': 1000},
    html: processTemplate('sb_nastya', order),

  };

  transport.sendMail(message, function(error){
    if(error){
        console.log('Error occured');
        console.log(error.message);
        return;
    }
    console.log('Message sent successfully!');

    // if you don't want to use this transport object anymore, uncomment following line
    //transport.close(); // close the connection pool
  });
};

// Формируем заказ
var make_order = function(req, res, cart){
  var order = new Order()
    , total = res.locals.setting.deliveryPrice
    , body = req.body
  ;

  _.each(cart, function(doc){
    order.items.push({
      id: doc.id,
      name: doc.name,
      count: doc.count,
      cost: doc.cost
    });
    total += doc.cost;
  });

  order.cost = total;

  order.comment_buyer = body.message;

  order.buyer = {
    name: body.name,
    address: body.zip + ', ' + body.address,
    email: body.email,
    session_id: req.sessionID,
    ip: req.headers['x-client-ip']
  };

  order.payment_method = body.payment;

  order.statuses.push({
    status: 'Создан'
  });

  // order.status = 'Создан';

  //console.log(order);

  order.save();

  return order;

};

// Меняем складские остатки
var change_stock = function(body, cart){
  console.log('function: change_stock')

  var change_stock_by_id = function(id, count){

    Product.findById(id, function (err, doc){
      //console.log(doc, count);
      if (err) return err;

      doc.count = doc.count - count;
      //doc.save();

    });
  };

  _.each(cart, function(obj){
      change_stock_by_id(obj.id, obj.count);
  });
};

// Чистим корзину
var clear_cart = function(req, res){
  //console.log('function: clear_cart');
  req.session.cart_items = [];
  res.locals.def_cart = req.session.cart_items;
  res.locals.def_cart_JSON = '[]';

  res.locals.cart = {
    fullcartclass: "hidden",
    emptycartclass: "",
    total: 0
  }

};



exports.makeOrder = function(req, res){

  //Проверить складские запасы перед формированием заказа
  //Добавить возможность редактирования количества

  res.locals.navbar = nav.getNavibar();

    res.locals.bc_list = [{
        name: "Главная страница",
        href: "/"
      }];

  res.locals.bc_active = "Оформление заказа";
  res.locals.getting_order = true;
  res.locals.scripts = ['lib/jquery.validate.min.js', 'order.validate.js'];
  var del_arr = req.flash('delivery');
  if (del_arr !== undefined && del_arr.length !== 0) {
    res.locals.delivery = del_arr[del_arr.length - 1];
  }

  console.log(req.sessionID);

  //req.flash('info', 'Flash is back!')

  res.render('order/order');

};

exports.postOrder = function(req, res){
  var redirect;

  //console.log(req.body);

  var back_to_order = function(message){
    req.flash('errors', message);
    redirect = true;
  }

  if (req.session.cart_items === undefined || req.session.cart_items.length === 0) {
    back_to_order('Корзина пуста. Сначало необходимо положить товары в корзину!');
  }

  if (req.body.baracuda === undefined || req.body.baracuda.length !== 0) {
    back_to_order('Ошибка передачи данных!');
  }

  if (req.body.name === undefined || req.body.name.length < 4 || req.body.name.length > 100) {
    back_to_order('Длина поля "ФИО" должна быть от 4-х до 100 символов!');
  }

  if (req.body.address === undefined || req.body.address.length < 4 || req.body.address.length > 200) {
    back_to_order('Длина адреса должна быть от 4-х до 200 символов!');
  }

  if (req.body.zip === undefined || req.body.zip.length !== 6) {
    back_to_order('Длина поля "Индекс" должна быть 6-ть символов!');
  }

  if (req.body.email === undefined || req.body.email.indexOf('&') !== -1) {
    back_to_order('Неверный электронный адрес!');
  }

  if (redirect === true) {
    req.flash('delivery', req.body);
    res.redirect('/order');

    return;
  }

  if (req.body.payment === 'gate') {
    //TODO оплата через шлюз

  } else {
    var odrer = make_order(req, res, req.session.cart_items);

    sendmail_to_bayer(odrer);
    sendmail_to_seller(odrer);

    change_stock(req.body, req.session.cart_items);
    clear_cart(req, res);
  }
  //Если нужно оплачивать - оплатить
  //Послать на почту покупателю и Насте уведомления
  //Сформировать заказ в таблице "заказы"
  //Уменьшить складские запасы

  res.locals.navbar = nav.getNavibar();

  res.locals.bc_list = [{
    name: "Главная страница",
    href: "/"
  }];

  res.locals.bc_active = "Заказ успешно создан";
  res.locals.getting_order = true;


  res.render('order/complete');

};

exports.completeOrder =  function(req, res){

  res.locals.navbar = nav.getNavibar();

    res.locals.bc_list = [{
        name: "Главная страница",
        href: "/"
      }];

  res.locals.bc_active = "Заказ успешно создан";
  res.locals.getting_order = false;

  res.render('order/complete');

};

