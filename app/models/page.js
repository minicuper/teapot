
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  //, Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  //, imagerConfig = require(config.root + '/config/imager.js')
  , moment = require('moment')
  , Schema = mongoose.Schema
  , _ = require('underscore')

/**
 * Getters
 */

/**
 * Setters
 */

/**
 * Article Schema
 */

var PageSchema = new Schema({
  name: {type : String, default : '', trim : true, index: true},
  url: {type : String, default : '', trim : true, index: true},
  active: Boolean,
  content: String,
  date  : {type : Date, default : Date.now},
  meta: {
    description: {type : String, default : '', trim : true},
    keywords: {type : String, default : '', trim : true}
  }
})


PageSchema.virtual('activeYN').get(function() {
  if (this.active === true) {
    return 'Да';
  } else {
    return 'Нет';
  }
});

PageSchema.virtual('dateISO').get(function() {
  var date = new Date(this.date);
  return date.toISOString();
});

PageSchema.virtual('dateFromNow').get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').fromNow();
});

PageSchema.virtual('dateLocal').get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').format('LLL');
});

PageSchema.virtual('formattedContent').get(function() {
  var res = '', ar = this.content.split(/\r\n/);
  _.each(ar, function(val){
    res += '<p>' + val + '</p>\r\n';
  });
  //console.log(res);
  return res;
});

/**
 * Validations
 */


/**
 * Methods
 */



/**
 * Statics
 */

PageSchema.statics.getMainPage = function(cb) {
  this.findOne({url: 'main'}).exec(cb);
};

PageSchema.statics.getByUrl = function(url, cb) {
  this.findOne({url: url, active: true}).exec(cb);
};

mongoose.model('Page', PageSchema)
