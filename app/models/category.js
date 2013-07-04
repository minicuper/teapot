
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  //, Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  //, imagerConfig = require(config.root + '/config/imager.js')
  , Schema = mongoose.Schema

/**
 * Getters
 */

/**
 * Setters
 */

/**
 * Article Schema
 */

var CategorySchema = new Schema({
  name: {type : String, default : '', trim : true},
  order: Number,
  url: {type : String, default : '', trim : true},
  active: Boolean,
  createAt  : {type : Date, default : Date.now},
  description: {type : String, default : '', trim : true},
  meta: {
    description: {type : String, default : '', trim : true},
    keywords: {type : String, default : '', trim : true}
  }
})


CategorySchema.virtual('activeYN').get(function() {
  if (this.active === true) {
    return 'Да';
  } else {
    return 'Нет';
  }
});

CategorySchema.virtual('createAtISO').get(function() {
  var date = new Date(this.createAt);
  return date.toISOString();
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

mongoose.model('Category', CategorySchema)
