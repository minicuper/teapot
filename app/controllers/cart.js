var _ = require("underscore")
  , mongoose = require('mongoose')
  , Product = mongoose.model('Product')
;

exports.list = function (req, res){

  // var result = [
  // {id: "519205f818850e6a4b000005", name: "Чайник 'Джуни' 110 мл.", price: 5600, cost: 5600, count: 1, max_count: 2, unit: "шт."},
  // {id: "519263c305c9ddc22674c84f", name: "Чайник 'Груша' 90 мл.", price: 8500, cost: 8500, count: 1, max_count: 3, unit: "шт."}
  // ];

  // req.session.cart_items = result;

  res.send(req.session.cart_items);
}

exports.update = function (req, res){
  var found = false;

  Product.findById(req.body.id, function(err, doc){
    if (err) {
      return res.send(404);
    }

    var obj = {
      id: req.body.id,
      name: doc.name,
      count: Number(req.body.count),
      price: Number(doc.price),
      cost: Number(req.body.cost),
      unit: doc.unit,
      max_count: Number(doc.count)
    }

    if (obj.count > obj.max_count) {
      obj.count = Number(obj.max_count);
    }

    if (obj.count < 1) {
      obj.count = 1;
    }

    obj.cost = obj.count * obj.price;

    //console.log(req.body);
    //console.log(req.session.cart_items)
    _.each(req.session.cart_items, function(val, key){
      // console.log(val, key);
      // console.log(val.id);
      // console.log(val.id === req.body.id);
      if (val.id === obj.id) {

        val.count = obj.count;
        val.cost  = obj.cost;
        val.name  = obj.name;
        val.price = obj.price;
        val.unit  = obj.unit;
        val.max_count = obj.max_count
        found = true;
        //console.log();
      }
    });

    if (found === false) {
      //POST
        if (!req.session.cart_items) {
          req.session.cart_items = [];
        }
        req.session.cart_items.push(obj);

        //console.log('create cart-item');
    }
    res.send(200);
    //console.log(req.session.cart_items);

  });

}

exports.delete = function (req, res){
  // console.log('cart: ', req.session.cart_items);
  // console.log('body: ', req.body);
  // console.log('params: ', req.params);

  var del_index;
  _.each(req.session.cart_items, function(val, key){
    // console.log('cart-id: ', val.id, typeof val.id);
    // console.log('id: ', req.body.id, typeof req.body.id);
    if (val.id === req.params.id) {
      del_index = key;
    }
  });

  if (del_index !== undefined) {
    // console.log(del_index);
    req.session.cart_items.splice(del_index, 1);
  }
  res.send(200);
}

exports.create = function (req, res){

  res.send(200);
}