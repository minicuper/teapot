
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

var NewsSchema = new Schema({
  name: {type : String, default : '', trim : true},
  active: Boolean,
  content: String,
  date  : {type : Date, default : Date.now}
})


NewsSchema.virtual('activeYN').get(function() {
  if (this.active === true) {
    return 'Да';
  } else {
    return 'Нет';
  }
});

NewsSchema.virtual('dateISO').get(function() {
  var date = new Date(this.date);
  return date.toISOString();
});

NewsSchema.virtual('dateFromNow').get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').fromNow();
});

NewsSchema.virtual('dateLocal').get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').format('LLL');
});

NewsSchema.virtual('formattedContent').get(function() {
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

NewsSchema.statics.getNews = function (monthes, cb) {
  var monthAgo;

  var addMonthToDate = function(date, monthes) {
    var result = new Date(date);
    result.setMonth(date.getMonth() + monthes);
    return result;
  };

  monthAgo = addMonthToDate(new Date(), -monthes);

  this.find({active: true, date: {$gte: monthAgo}}).sort('-date').limit(5).exec(cb);

}

NewsSchema.statics.getAllNews = function (cb) {
  this.find().sort('-date').exec(cb);
};



mongoose.model('News', NewsSchema)
