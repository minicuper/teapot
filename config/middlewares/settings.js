var  _ = require('underscore')
    , async = require('async')
    , mongoose = require('mongoose')
    , Setting = mongoose.model('Setting')
    , setting = undefined



exports.init = function(){
  Setting.findOne().exec(function(err, doc){
    if (err) {
      // console.log('error while  loading settings');
      setting = undefined;
    } else {
      // console.log('settings is loaded');
      setting = doc.toObject();

      //console.log(setting);
    }

  });
}

exports.setLocals = function(req, res, next){
  if (setting === undefined) {
    return next();
  }

  //console.log('Settings: ', res.locals.setting);

  res.locals.setting = setting;

  //console.log('Settings: ', res.locals.setting);

  next();
};

