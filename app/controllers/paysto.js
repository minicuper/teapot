var crypto = require('crypto')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , mongoose = require("mongoose")
  , Order = mongoose.model('Order')
  , Product = mongoose.model('Product')
  , _ = require("underscore")

  , nav = require('../../config/navbar')
  , nodemailer = require('nodemailer')
  , path = require('path')
  , Hogan = require('hogan.js')
  , cart = require('../../config/middlewares/cart')
;


//Почта
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
var sendmail_to_buyer = function(order, subject, template){

  var message = {
      from: config.mail.name + ' <' + config.mail.login+ '>',
      to: order.buyer.name + ' <' + order.buyer.email+'>',
      subject: subject,

      html: processTemplate(template, order)

  };

  transport.sendMail(message, function(error){

    if(error){
      console.log('Error sending message to buyer!');
      return;
    }

  });
};

// Шлем почту покупателю
var sendmail_to_seller = function(order, subject, template){

  var message = {
      from: config.mail.name + ' <' + config.mail.login+ '>',
      to:   config.mail.name + ' <' + config.mail.login+ '>',
      subject: subject,

      html: processTemplate(template, order)

  };

  transport.sendMail(message, function(error){

    if(error){
      console.log('Error sending message to buyer!');
      return;
    }

  });
};

//MD5
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var checkMD5 = function(obj, secret, c_mode) {
  var a = [], s = '';

  for (var prop in obj){
    if (prop !== 'PAYSTO_MD5') {
      a.push({name: prop, val:obj[prop]});
    }
  }

  a.sort(function (a,b){
    if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
    if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
    return 0;
  });

  a.forEach(function(o){
    s += o.name + '=' + o.val + '&';
  })

  s += secret;

  if (c_mode === true) {
    s = s.replace(/[^a-zA-Z0-9$&%;:?!\.,\s}(\[){\]""'`\\/|^_~*+=<>@-]/g, '');
  }

  var md5 = crypto.createHash('md5').update(s).digest('hex').toUpperCase();

  // console.log('a:', a);
  // console.log('s:', s);
  // console.log(md5);
  // console.log(obj.PAYSTO_MD5);

  return md5===obj.PAYSTO_MD5;
}

// Меняем складские остатки (добавляем из отмененного заказа)
var change_stock = function(cart){
  //console.log('function: change_stock')

  var change_stock_by_id = function(id, count){

    Product.findById(id, function (err, doc){
      //console.log(doc, count);
      if (err) return err;

      doc.count = doc.count + count;
      doc.save();

    });
  };

  _.each(cart, function(obj){
      change_stock_by_id(obj.id, obj.count);
  });
};

var fillCartFromOrder = function(req, res, order){
  //console.log('cart: ', req.session.cart_items);
  //console.log('order: ', order.items);

  var l_cart = req.session.cart_items;

  if (!l_cart) {
    l_cart = [];
  }

  //console.log('cart: ', req.session.cart_items);

  if (l_cart.length === 0) {
    order.items.forEach(function(doc){
      l_cart.push({
        id: doc.id,
        name: doc.name,
        count: doc.count,
        cost: doc.cost,
        price: doc.price,
        unit: doc.unit,
        max_count: doc.max_count
      });
    });
  }

  cart.getCart(req, res);
  //console.log('cart: ', req.session.cart_items);

};


//Экспорт
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//PaySto проверяет мы ли создали данный заказ, все ли реквизиты корректны
//мы должны подтвердить
exports.postCheck = function (req, res, next){
  req.session.destroy();
  //console.log('paysto/check');
  //console.log(req.body);
  //console.log('secret', config.paysto.secret);
  var obj = req.body;

  if (!checkMD5(obj, config.paysto.secret, true)) {
    console.log('Ошибка - некорректна подпись MD5!');
    return res.send(200, 'Ошибка - некорректна подпись MD5!');
  }

  if (obj.PAYSTO_INVOICE_ID) {
    Order.findById(obj.PAYSTO_INVOICE_ID).exec(function(err, doc){

      if (doc === null) {
        console.log('Ошибка - заказ не найден!');
        return res.send(200, 'Ошибка - заказ не найден!');
      }

      if (Number(obj.PAYSTO_SUM) !== Number(doc.cost)) {
        console.log('Ошибка - суммы не совпадают!');
        return res.send(200, 'Ошибка - суммы не совпадают!');
      }

      if (doc.status === 'Оплачен') {
        console.log('Ошибка - заказ уже оплачен!');
        return res.send(200, 'Ошибка - заказ уже оплачен!');
      }

      if (doc.status === 'Отправлен') {
        console.log('Ошибка - заказ уже отправлен!');
        return res.send(200, 'Ошибка - заказ уже отправлен!');
      }

      if (doc.status === 'Закрыт') {
        console.log('Ошибка - заказ закрыт!');
        return res.send(200, 'Ошибка - заказ закрыт!');
      }

      if (doc.status === 'Отменен') {
        console.log('Ошибка - заказ отменен!');
        return res.send(200, 'Ошибка - заказ отменен!');
      }

      //Все ОК - подтверждаем, что заказ сделан с сайта и все совпадает
      res.send(200, req.body.PAYSTO_INVOICE_ID);
    });
  } else {
    return res.send(200, 'Ошибка - в запросе отсутствует поле PAYSTO_INVOICE_ID!');
  }


}

//POST
//PaySto передает сюда статус платежа
// RES_BILLED – заявка отправлена на оплату, (статус возникает, когда PaySto перенаправила покупателя на какой-нибудь шлюз, нам не присылается)
// RES_CANCEL - покупатель отказался от покупки, (нужно отменить заказ)
// RES_CREATED – заявка зарегистрирована (первый статус в системе PaySto,
// RES_ERROR - при платеже произошли ошибки, (нужно связяться с покупателем)
// RES_HOLD - заявка приостановлена; (нужно связяться с покупателем)
// RES_PAID - оплата состоялась, (оплата прошла, можно отсылать)

//Создан, Оплачен, Отправлен, Закрыт, Отменен
exports.postResult = function (req, res){
  req.session.destroy();
  console.log('paysto/result');
  //console.log('session: ', req.sessionID);

  var obj = req.body, correctMD5, ip;
  ip = req.headers['x-client-ip'];

  correctMD5 = checkMD5(obj, config.paysto.secret, true);

  if (obj.PAYSTO_INVOICE_ID) {
    Order.findById(obj.PAYSTO_INVOICE_ID).exec(function(err, doc){
      console.log('status: ', obj.PAYSTO_REQUEST_MODE);

      if (doc === null) {
        console.log('Ошибка - заказ c таким номером не найден!', obj.PAYSTO_INVOICE_ID)
        return res.send(200, 'Ошибка - заказ c таким номером не найден!');
      }

      doc.paysto.push({
        ip: ip,
        correctMD5: correctMD5,
        status: obj.PAYSTO_REQUEST_MODE,
        objJSON: JSON.stringify(obj)
      });

      if (obj.PAYSTO_REQUEST_MODE === 'RES_PAID') {
        doc.statuses.push({
          status: 'Оплачен',
          comment: 'Как сообщила PaySto'
        });

        sendmail_to_buyer(doc, "Оплата получена!", "gate_payment_ok_buyer");
        sendmail_to_seller(doc, "Получена оплата за заказ! - " + doc.cost + ' руб.', "gate_payment_ok_seller");

      }

      if (obj.PAYSTO_REQUEST_MODE === 'RES_CANCEL' || obj.PAYSTO_REQUEST_MODE === 'RES_ERROR') {
        doc.statuses.push({
          status: 'Отменен',
          comment: 'PaySto прислала статус оплаты: ' + obj.PAYSTO_REQUEST_MODE
        });


        if (obj.PAYSTO_REQUEST_MODE === 'RES_CANCEL') {
          sendmail_to_buyer(doc, 'Заказ отменен в процессе оплаты!', 'gate_payment_cancel_buyer');
          sendmail_to_seller(doc, 'Заказ отменен в процессе оплаты!', 'gate_payment_cancel_seller');
        }

        if (obj.PAYSTO_REQUEST_MODE === 'RES_ERROR') {
          sendmail_to_buyer(doc, 'Ошибка в процессе оплаты!', 'gate_payment_error_buyer');
          sendmail_to_seller(doc, 'Ошибка в процессе оплаты!', 'gate_payment_error_seller');
        }

        change_stock(doc.items);
        //возврат товаров в доступ (изменение количества доступных товаров)

      }
      //console.log('id: ', doc._id);

      doc.save();
      // doc = doc.toObject();
      // var id = doc._id;
      // delete doc._id;

      // Order.findByIdAndUpdate(id, doc, function(err, saved) {

      //   if( err || !saved ) {
      //     console.log("Post not updated: "+err);
      //   } else {
      //     console.log("Post updated: %s", saved);
      //   }

      // });


      //Все ОК - подтверждаем, что запомнили статус
      res.send(200, req.body.PAYSTO_INVOICE_ID);
    });
  } else {
    return res.send(200, 'Ошибка - в запросе отсутствует поле PAYSTO_INVOICE_ID!');
  }

}

//POST Возвращаемся с PaySto - нужно сгенерировать страницу возврата
exports.postReturn = function (req, res, next){
  //console.log('paysto/return');
  //console.log('session: ', req.sessionID);

var obj = req.body, correctMD5, ip, condition;

  //console.log(obj);

  ip = req.headers['x-client-ip'];

  correctMD5 = checkMD5(obj, config.paysto.secret, true);

  if (obj.PAYSTO_INVOICE_ID) {
    condition = {"_id": obj.PAYSTO_INVOICE_ID}
  } else {
    condition = {"buyer.session_id": req.sessionID}
  }

  //console.log('condition: ', condition);

  Order.find(condition).sort("-data").limit(1).exec(function(err, docs){
    var status, doc;
    if (!docs || docs.length === 0 || err) {
      return next(new Error('Что-то не то'));
    }
    doc = docs[0];

    console.log(doc);

    if (doc.paysto.length === 0) {
      console.log('Отстутствуют статусы у заказа!');

      doc.statuses.push({
        status: 'Отменен',
        comment: 'Пользователь отменил оплату в PaySto'
      });

      //Возврат товаров в доступ (изменение складских остатков)
      change_stock(doc.items);

      doc.save();

      status = 'RES_CANCEL';
    } else {
      status = doc.paysto[doc.paysto.length - 1].status;
    }

    res.locals.navbar = nav.getNavibar();

    res.locals.bc_list = [{
      name: "Главная страница",
      href: "/"
    }];

    res.locals.getting_order = false;

    //Обрабатываем последний статус оплаты

    if (status === 'RES_PAID') {
      res.locals.bc_active = "Заказ успешно создан, оплата прошла";
      res.render('paysto/success');
    }

    if (status === 'RES_CANCEL') {

      fillCartFromOrder(req, res, doc);

      res.locals.bc_active = "Заказ отменен";
      res.render('paysto/cancel');
    }

    if (status === 'RES_BILLED' || status === 'RES_CREATED' || status === 'RES_HOLD') {
      res.locals.bc_active = "Заказ создан, ожидается оплата";
      res.render('paysto/billed');
    }

    if (status === 'RES_ERROR') {
      fillCartFromOrder(req, res, doc);

      res.locals.bc_active = "Заказ отменен из-за ошибки";
      res.render('paysto/error');
    }


  });
  // } else {
  //   next(new Error('Page not found!'));
  // }
}

// exports.success = function (req, res){

// }

// exports.error = function (req, res){

// }

// exports.cancel = function (req, res){

// }

// exports.progress = function (req, res){

// }
