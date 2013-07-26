var _ = require("underscore")
  , sm = require('sitemap')
  , async = require('async')
  , mongoose = require('mongoose')
  , Product = mongoose.model('Product')
  , Category = mongoose.model('Category')

;

exports.get = function(req, res, next){
  var sitemap, urlList = [];

  //Static part
  urlList.push({url: '/'});
  urlList.push({url: '/delivery/'});
  urlList.push({url: '/payments/'});
  urlList.push({url: '/about/'});

  async.parallel([
    function(callback){
      Category.find({active: true}).exec(function(err, docs){
        if (err) {
          return callback(err);
        }

        _.each(docs, function(doc){
          urlList.push({url: '/catalog/' + doc.url + '/'});
        });

        callback(null);
      });

    },
    function(callback){
      Product.find({active: true}).exec(function(err, docs){
        if (err) {
          return callback(err);
        }

        _.each(docs, function(doc){
          urlList.push({url: '/catalog/' + doc.id});
        });

        callback(null);
      });
    }
  ],
  // optional callback
  function(err, results){
     // [
     //    { url: '/page-1/',  changefreq: 'daily', priority: 0.3 },
     //    { url: '/page-2/',  changefreq: 'monthly',  priority: 0.7 },
     //    { url: '/page-3/' }     // changefreq: 'weekly',  priority: 0.5
     //  ]

    sitemap = sm.createSitemap ({
      hostname: 'http://teapots.su',
      cacheTime: 600000,        // 600 sec - cache purge period
      urls: urlList
    });

    sitemap.toXML(function (xml) {
      res.header('Content-Type', 'application/xml');
      res.send( xml );
    });

  });






}