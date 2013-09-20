
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

  , textSearch = require('mongoose-text-search')

  //, Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , moment = require('moment')
  //, imagerConfig = require(config.root + '/config/imager.js')
  , Schema = mongoose.Schema
  , _ = require('underscore')

;



/**
 * Getters
 */

/**
 * Setters
 */

/**
 * Article Schema
 */

var RefSchema = new Schema({
  name: {type : String, default : '', trim : true},
  url: {type : String, default : '', trim : true}
});

RefSchema.virtual('index').get(function() {
  return this.parentArray().indexOf(this);
});

var ImageSchema = new Schema({
  url: {type : String, default : '', trim : true}
});

ImageSchema.virtual('index').get(function() {
  return this.parentArray().indexOf(this);
});

ImageSchema.virtual('url_mini').get(function() {
  if (this.url.indexOf('googleusercontent') === -1) {
    return this.url;
  } else {
    return this.url.replace(/\/s\d+\//, '/s42/');
  }
});

ImageSchema.virtual('url_small').get(function() {
  if (this.url.indexOf('googleusercontent') === -1) {
    return this.url;
  } else {
    return this.url.replace(/\/s\d+\//, '/s120/');
  }
});

ImageSchema.virtual('url_normal').get(function() {
  if (this.url.indexOf('googleusercontent') === -1) {
    return this.url;
  } else {
    return this.url.replace(/\/s\d+\//, '/s870/');
  }
});

ImageSchema.virtual('url_large').get(function() {
  if (this.url.indexOf('googleusercontent') === -1) {
    return this.url;
  } else {
    return this.url.replace(/\/s\d+\//, '/s2048/');
  }
});

var ProductSchema = new Schema({
  name: {type : String, default : '', trim : true},
  main_image: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  active: Boolean,
  count: {type: Number, default: 1},
  priority: {type: Number, default: 0},
  price: Number,
  unit: {type : String, default : 'шт.', trim : true},
  category: {type : Schema.ObjectId, ref : 'Category'},
  images: [ImageSchema],
  refs: [RefSchema],
  date  : {type : Date, default : Date.now},
  meta: {
    description: {type : String, default : '', trim : true},
    keywords: {type : String, default : '', trim : true}
  }
});

// give our schema text search capabilities
ProductSchema.plugin(textSearch);

// add a text index to the description array
ProductSchema.index({ name: 'text', description: 'text' }, { default_language: 'russian'});

ProductSchema.virtual('main_image_mini').get(function() {
  if (this.main_image.indexOf('googleusercontent') === -1) {
    return this.main_image;
  }
  var url = this.main_image.replace(/\/s\d+\//, '/s42/');
  //console.log(url);
  return url;
});

ProductSchema.virtual('main_image_small').get(function() {
  if (this.main_image.indexOf('googleusercontent') === -1) {
    return this.main_image;
  }
  var url = this.main_image.replace(/\/s\d+\//, '/s120/');
  //console.log(url);
  return url;
});

ProductSchema.virtual('main_image_normal').get(function() {
  if (this.main_image.indexOf('googleusercontent') === -1) {
    return this.main_image;
  }
  var url = this.main_image.replace(/\/s\d+\//, '/s870/');
  //console.log(url);
  return url;
});

ProductSchema.virtual('main_image_large').get(function() {
  if (this.main_image.indexOf('googleusercontent') === -1) {
    return this.main_image;
  }
  var url = this.main_image.replace(/\/s\d+\//, '/s2048/');
  //console.log(url);
  return url;
});

_.each([870, 700, 538, 710, 423], function(num){
  
  ProductSchema.virtual('main_image_' + num).get(function() {
    if (this.main_image.indexOf('googleusercontent') === -1) return this.main_image;

    return this.main_image.replace(/\/s\d+\//, '/s' + num + '/');;
  });
  
});



ProductSchema.virtual('activeYN').get(function() {
  if (this.active === true) {
    return 'Да';
  } else {
    return 'Нет';
  }
});



ProductSchema.virtual('isNew').get(function() {
  var addDayDate = function(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate()+days);
    return result;
  };

  var weekAgo = addDayDate(new Date(), -7);

  return this.date > weekAgo;

});

ProductSchema.virtual('formattedDescription').get(function() {
  var res = '', ar = this.description.split(/\r\n/);
  _.each(ar, function(val){
    res += '<p>' + val + '</p>\r\n';
  });
  //console.log(res);
  return res;
});

ProductSchema.virtual('dateISO').get(function() {
  var date = new Date(this.date);
  return date.toISOString();
});

ProductSchema.virtual('dateFromNow').get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').fromNow();
});

ProductSchema.virtual('dateLocal').get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').format('LLL');
});

ProductSchema.virtual('disabled').get(function() {
    return this.active === false || this.count === 0;
});


/**
 * Validations
 */

ProductSchema.path('name').validate(function (name) {
  return name.length > 0
}, 'Название товара не может быть пустым')

ProductSchema.path('main_image').validate(function (main_image) {
  return main_image.length > 0
}, 'Необходимо указать хотя бы одну фотографию')

/**
 * Methods
 */


/**
 * Statics
 */

ProductSchema.statics.getAvailableProducts = function (cat_id, cb) {
  this.find({"category": cat_id, active: true, count:{$ne: 0}}).sort({priority: -1, date: -1}).exec(cb);
};

ProductSchema.statics.getUnavailableProducts = function (cb) {
  this.find({active: true, count: 0}).sort({priority: -1, date: -1}).exec(cb);
};


ProductSchema.statics.findFullText = function(query, cb) {

  var options = {
    filter: { active: true, count: {$ne: 0} },
    language: 'russian',
    limit: 10
  };

  this.textSearch(query, options, function(err, output){
    var results = [];

    if (err) {
      return cb(err, []);
    }

    //req.flash('query', query);

    _.each(output.results, function(obj){
      results.push(obj.obj);
    });

    cb(err, results);
  });
};

ProductSchema.statics.findByObjIds = function(objs, cb) {
  var ids = [];

  _.each(objs, function(obj){
    ids.push(mongoose.Types.ObjectId(obj.id));
  });

  this.find({_id:{$in: ids}}).exec(cb);
};

ProductSchema.statics.getSortedProductsWithFilter = function(filter, cb){
  this.find(filter).sort({category: 1, priority: -1, date: -1}).populate('category').exec(cb);
};




mongoose.model('Product', ProductSchema)
