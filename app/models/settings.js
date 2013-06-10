
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  //, Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  //, imagerConfig = require(config.root + '/config/imager.js')
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

var SettingSchema = new Schema({
  deliveryPrice: {type: Number, min: 0, default: 0},
  currencyName: {type: String, default: 'руб.'}
  // name: {type : String, default : '', trim : true},
  // active: Boolean,
  // content: String,
  // date  : {type : Date, default : Date.now}
})


/**
 * Validations
 */


/**
 * Methods
 */



/**
 * Statics
 */

mongoose.model('Setting', SettingSchema)
