var _ = require('underscore')
;

exports.getCart = function (req, res, next) {

  if (req.session.cart_items) {
    res.locals.def_cart_JSON = JSON.stringify(req.session.cart_items);
  } else {
    res.locals.def_cart_JSON = "[]";
    req.session.cart_items = [];
  }
  res.locals.def_cart = req.session.cart_items;
  //console.log(res.locals.def_cart);

  var total = res.locals.setting.deliveryPrice;

  _.each(req.session.cart_items, function(item){
    total += item.cost;
  });

  if (req.session.cart_items.length ===0) {
    res.locals.cart = {
      fullcartclass: "hidden",
      emptycartclass: "",
      total: total
    }
  } else {
    res.locals.cart = {
      fullcartclass : "",
      emptycartclass : "hidden",
      total: total
    }
  }

  next();
}