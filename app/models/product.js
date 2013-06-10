
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

var ProductSchema = new Schema({
  name: {type : String, default : '', trim : true},
  main_image: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  active: Boolean,
  count: {type: Number, default: 1},
  price: Number,
  unit: {type : String, default : 'шт.', trim : true},
  category: {type : Schema.ObjectId, ref : 'Category'},
  images: [String],
  refs: [RefSchema],
  date  : {type : Date, default : Date.now}
});

// give our schema text search capabilities
ProductSchema.plugin(textSearch);

// add a text index to the description array
ProductSchema.index({ name: 'text', description: 'text' }, { default_language: 'russian'});

ProductSchema.virtual('activeYN').get(function() {
  if (this.active === true) {
    return 'Да';
  } else {
    return 'Нет';
  }
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

ProductSchema.statics.load = function (id, cb) {
  this.findOne({ _id : id })
    .populate('category')
      //.populate('comments.user')
    .exec(cb)
};



mongoose.model('Product', ProductSchema)
