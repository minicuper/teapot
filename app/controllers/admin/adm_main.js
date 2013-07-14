/**
 * Module dependencies.
 */

var async = require('async')
  , _ = require('underscore')
  , mongoose = require('mongoose')
  , Product = mongoose.model('Product')
  , Order = mongoose.model('Order')
  , request = require('request')
  ;

var getDateYYYYMMDD = function(date) {
  var year = String(date.getFullYear());
  var month = ('0' + String(date.getMonth() + 1)).substr(-2, 2);
  var day   = ('0' + date.getDate()).substr(-2, 2);
  return  year + month + day;
};

var addDayDate = function(date, days) {
  var result = new Date(date);
  result.setDate(date.getDate()+days);
  return result;
};

var makeChart = function(days, cb){
  var today     = new Date();
  var firstday  = addDayDate(today, - (days * 2) + 1);

  var url = 'http://api-metrika.yandex.ru/stat/traffic/summary.json?id=21700723&date1='
  + getDateYYYYMMDD(firstday) + '&date2=' + getDateYYYYMMDD(today)  + '&pretty=1&oauth_token=60551b17844042b38b32b568d75b5c9b';

  request.get({url:url, json:true}, function (error, response, body) {
    var data = [], result = [];

    if (!error && response.statusCode == 200) {
      //console.log('was there');

      _.each(body.data, function(obj){
        data[obj.date] = obj.visits;
      });

      //console.log('data: ', data);

      for (var i = 0; i < days; i++) {
        var real = getDateYYYYMMDD(addDayDate(today, - i));
        var prev = getDateYYYYMMDD(addDayDate(today, - (days + i)));

        //console.log(real, prev);

        var v_real = data[real] || 0;
        var v_prev = data[prev] || 0;

        result.push([real.substr(6,2)+'.'+real.substr(4,2), v_prev, v_real]);

      }

      //console.log('result: ', result);

      result.reverse();
      result.unshift(['Дата','Раньше', 'Сейчас']);

      //console.log('result: ', result);

    } else {
      console.log('Ошибка при получении данных - график визитов!');
    }

    //console.log(body, error, response.statusCode);
    cb(error, result);

  });


}

var makeTable = function(days, count,  cb){
  var today     = new Date();
  var firstday  = addDayDate(today, - (days) + 1);

  var url = 'http://api-metrika.yandex.ru/stat/content/popular.json?id=21700723&date1='+getDateYYYYMMDD(firstday)+'&date2='+getDateYYYYMMDD(today)+'&oauth_token=60551b17844042b38b32b568d75b5c9b&per_page=200';

  request.get({url:url, json:true}, function (error, response, body) {
    var data = [];

    if (!error && response.statusCode == 200) {

      _.each(body.data, function(obj){
        if (!obj.foreign) {
          if (obj.url.slice(-1)!=='/' && obj.url.indexOf('catalog') !== -1) {

            //var a = obj.url.match(/\/(.*)$/m);

            //var a = obj.url.substr(obj.url.lastIndexOf('/')+1);

            //console.log(obj.url, obj.page_views, obj.url.substr(a+1));

            var o = {
              url: obj.url,
              views: obj.page_views,
              id: obj.url.substr(obj.url.lastIndexOf('/')+1)
            }

            data.push(o);

            //console.log(o);
          }
        }
      });

      data.sort(function(a,b){
        return b.views - a.views;
      });

      data = data.slice(0, count);

      //console.log(data);

      // for (var i = 0; i < days; i++) {
      // }


    } else {
      console.log('Ошибка при получении данных о лучших товарах!');
    }

    cb(error, data);

  });
};




exports.index = function(req, res){
  var data, table;
  // var today, yesterday;

  // today = new Date();
  // yesterday = new Date();
  // yesterday.setDate(today.getDate()-1);


  res.locals.title = "Teapots - Админка"
  res.locals.bc_active = "Главная страница";

  res.locals.scripts = [
    '/js/adm/adm.main.js'
  ];



  async.parallel([
    function(callback){
      Order.getLastDaysOrders(1, function (err, docs) {

          //console.log('order - was here');

          if (err) return callback(err);;

          res.locals.orders = docs;

          callback(null);

      });

    },
    function(callback){
      makeChart(7, function(err, d){
        res.locals.data = JSON.stringify(d);
        callback(null);
      });
    },
    function(callback){
      // var ids = [], prod;
      var prod;

      makeTable(3, 15, function(err, r){
        //console.log(r);
        // _.each(r, function(doc){
        //   ids.push(mongoose.Types.ObjectId(doc.id));
        // });

        Product.findByObjIds(r, function(err, docs){
          if (err) {
            res.locals.table = '[]';
            return callback(new Error('Не найдены товары из корзины!'));
          }

          //console.log(docs);

          _.each(r, function(doc){

            prod = undefined;
            _.each(docs, function(p){
              if (p._id.toString() === doc.id) {
                prod = p;
              }
            });

            if (prod !== undefined) {
              doc.name = prod.name;
              doc.img  = prod.main_image_mini;
            } else {
              doc.name = doc.id;
              doc.img  = '';
            }

          });

          //console.log(r);

          res.locals.table = r;
          callback(null);

        });

      });
    }
  ],
  // optional callback
  function(err, results){

    res.render('admin/layouts/main', {
      layout: 'admin/layouts/default'
      // ,
      // partials: {
      //   adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
      //   adm_sidebar: 'admin/layouts/adm_sidebar',
      //   adm_navbar: 'admin/layouts/adm_navbar',
      // }
    });

    // res.render('index', {
    //   data: JSON.stringify(data),
    //   table: table
    // });
  });

    //console.log(yesterday);





};
