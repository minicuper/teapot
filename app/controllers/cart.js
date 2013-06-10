var _ = require("underscore")
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
  //console.log(req.body);
  //console.log(req.session.cart_items)
  _.each(req.session.cart_items, function(val, key){
    // console.log(val, key);
    // console.log(val.id);
    // console.log(val.id === req.body.id);
    if (val.id === req.body.id) {
      val.count = req.body.count;
      val.cost  = req.body.cost;
      found = true;
      //console.log();
    }
  });
  
  if (found === false) {
    //POST
      if (!req.session.cart_items) {
        req.session.cart_items = [];
      }
      req.session.cart_items.push(req.body);
      
      //console.log('create cart-item');
  }
  res.send(200);
  //console.log(req.session.cart_items);
}

exports.delete = function (req, res){
  var del_index;
  _.each(req.session.cart_items, function(val, key){
    if (val.id === req.body.id) {
      del_index = key;
    }    
  });
  
  req.session.cart_items.splice(del_index, 1);
  res.send(200);
}

exports.create = function (req, res){

  res.send(200);
}