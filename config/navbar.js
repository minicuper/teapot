var  _ = require('underscore')
    , async = require('async')
    , mongoose = require('mongoose')
    , Category = mongoose.model('Category')
    , navbar = undefined



exports.init = function(){
  Category.find({active: true}).sort('order').exec(function(err, docs){
    navbar = docs;
  });
}

exports.getNavibar = function(active){
  var result = [];

  _.each(navbar, function(nav){
    //console.log(active, nav.url);
    result.push({name: nav.name, url: nav.url, active: (nav.url === active)});
  });

  return result;

};

exports.getNavibarName = function(url, navbar){
  var result;

  _.each(navbar, function(nav){
    if (nav.url === url) {
      //console.log(nav);
      //console.log(nav.name);
      result = nav.name;
    }
  });

  return result;
};