var _ = require("underscore")
  , js2yml = require('js2yml')
  , async = require('async')
  , mongoose = require('mongoose')
  , Product = mongoose.model('Product')
  , Category = mongoose.model('Category')
  , shortID = require('mongodb-short-id')
;

exports.get = function(req, res, next){

  req.session.destroy();

  var xml, obj;

  obj = {
    name: "TeaPots",
    company: "Teapots",
    url: "http://teapots.su",
    currencies: [{id: 'RUB', rate: '1'}],
    categories: [],
    offers: []
  };

  //Static part

  async.parallel([
    function(callback){
      Category.find().exec(function(err, docs){
        if (err) {
          return callback(err);
        }

        _.each(docs, function(doc){
          obj.categories.push({
            id: doc.order,
            name: doc.name
          });
        });

        callback(null);
      });

    },
    function(callback){
      Product.find({active: true}).populate('category').exec(function(err, docs){
        if (err) {
          return callback(err);
        }

        _.each(docs, function(doc){
          //console.log(typeof doc._id, doc._id);
          obj.offers.push({
            id: shortID.longToShort(doc._id.toString()),
            available: doc.active && (doc.count !== 0),
            bid: 21,
            url: ('http://teapots.su/catalog/' + doc._id),
            price: doc.price,
            currencyId: "RUB",
            categoryId: doc.category.order,
            picture: (doc.main_image_normal),
            name: doc.name
          });
        });

        callback(null);
      });
    }
  ],
  // optional callback
  function(err, results){

    xml = js2yml.createYmlSync(obj);
    //console.log(xml);

    res.header('Content-Type', 'application/xml');
    res.send(xml);

  });






}