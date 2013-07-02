
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  //, Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  //, imagerConfig = require(config.root + '/config/imager.js')
  , Schema = mongoose.Schema
  , moment = require('moment')
  , _ = require('underscore')
  , autoinc = require('mongoose-id-autoinc')

;

//console.log('mongoose: ', mongoose);
autoinc.init(mongoose.connections[0]);

/**
 * Getters
 */

/**
 * Setters
 */

/**
 * Article Schema
 */
//*************************************************************************** STATUS
var StatusSchema = new Schema({
    status: String,
    date  : {type : Date, default : Date.now},
    comment: String
  });

StatusSchema.virtual('dateL')
  .get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').format('LLL');
  });

StatusSchema.virtual('dateISO').get(function() {
  var date = new Date(this.date);
  return date.toISOString();
});

StatusSchema.virtual('statusCreated').get(function() {
    return this.status === 'Создан';
});

StatusSchema.virtual('statusPaid').get(function() {
    return this.status === 'Оплачен';
});

StatusSchema.virtual('statusSent').get(function() {
    return this.status === 'Отправлен';
});

StatusSchema.virtual('statusClosed').get(function() {
    return this.status === 'Закрыт';
});

StatusSchema.virtual('statusCanseled').get(function() {
    return this.status === 'Отменен';
});

StatusSchema.virtual('index').get(function() {
  return this.parentArray().indexOf(this);
});

//*************************************************************************** ITEM
var ItemSchema = new Schema({
  id: {type : Schema.ObjectId, ref : 'Product'},
  name: String,
  count: Number,
  cost: Number,
  price: Number,
  unit: String,
  max_count: Number
});

ItemSchema.virtual('index').get(function() {
  return this.parentArray().indexOf(this);
});



//*************************************************************************** PaySto

var PaystoSchema = new Schema({
    ip: String,
    status: String,
    date  : {type : Date, default : Date.now},
    correctMD5: Boolean,
    objJSON: String
});

PaystoSchema.virtual('index').get(function() {
  return this.parentArray().indexOf(this);
});

PaystoSchema.virtual('dateL')
  .get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').format('LLL');
  });

PaystoSchema.virtual('dateISO').get(function() {
  var date = new Date(this.date);
  return date.toISOString();
});

PaystoSchema.virtual('correctMD5YN').get(function() {
  if (this.correctMD5 === true) {
    return 'Да';
  } else {
    return 'Нет';
  }
});
//*************************************************************************** ORDER

var OrderSchema = new Schema({
  _id: Number,
  //проект полей
  statuses: [StatusSchema], //Создан, Оплачен, Отправлен, Закрыт, Отменен
  cost: Number,
  buyer: {
    name: String,
    email: String,
    address: String,
    session_id: {type:String, index: true},
    ip: String
  },
  items: [ItemSchema],
  paysto: [PaystoSchema],
  comment_buyer: String,
  comment_seller: String,
  payment_method: String,
  tracking_number: String,
  date  : {type : Date, default : Date.now, index: true}

});

/**
 * Plugins
 */

OrderSchema.plugin(autoinc.plugin, { model: 'Order', start: 2000});

/**
 * Virtuals
 */



OrderSchema
  .virtual('dateFromNow')
  .get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').fromNow();
  });

OrderSchema
  .virtual('dateL')
  .get(function() {
    moment.lang('ru');
    var date = new Date(this.date);
    return moment(date).zone('+0400').format('LLL');
  });

OrderSchema.virtual('dateISO').get(function() {
    var date = new Date(this.date);
    return date.toISOString();
  });

OrderSchema
  .virtual('status')
  .get(function() {
    var date, status;
    _.each(this.statuses, function(item){
      if(date === undefined) {
        date = item.date;
        status = item.status;
      }

      if (item.date > date) {
        date = item.date;
        status = item.status;
      }

    });

    return status;

  });
/**
 * Validations
 */

// ProductSchema.path('title').validate(function (title) {
//   return title.length > 0
// }, 'Название товара не может быть пустым')

// ProductSchema.path('main_image').validate(function (main_image) {
//   return main_image.length > 0
// }, 'Необходимо указать хотя бы одну фотографию')

/**
 * Methods
 */


/**
 * Statics
 */

OrderSchema.statics = {


  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('items.id')
      //.populate('comments.user')
      .exec(cb)
  },

}

mongoose.model('Order', OrderSchema)
