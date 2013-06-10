var app = app || {};

(function () {

  var CartItemView = Backbone.View.extend({
    tagName: 'tr',
    attributes : function () {
      return {
        class : 'ci-'+this.model.get( 'id' )
      };
    },
    initialize: function(){
      _.bindAll(this);
      this.model.on('destroy', this.onDestroyModel);
      this.model.on('change', this.onChangeModel);
    },
    events: {
      'click .close': 'clickClose'
    },
    template: Hogan.compile('<td><a href="/catalog/{{id}}">{{name}}</a></td>' +
                            '<td class=hidden-tablet>	{{count}} {{unit}}</td>' +
                            '<td> {{cost}} руб.</td>' +
                            '<td><a class=close>&times;</a></td>'),

    onDestroyModel: function(){
      this.remove();
    },
    onChangeModel: function(){
      this.render();
    },
    clickClose: function (){
      this.model.destroy();
      //console.log(this.model.get('id'));
      return false;
    },
    render: function(){
      var content = this.template.render(this.model.toJSON());
      //console.log(content);
      this.$el.html(content);
      return this;
    }
  });

  var CartView = Backbone.View.extend({
    initialize: function(){
      _.bindAll(this);
      this.collection.on('add', this.onAddCollection);
      this.collection.on('reset', this.onResetCollection);
      this.collection.on('remove', this.onRemoveCollection);
      //this.collection.fetch();
    },

    calculateTotal: function(){
      var total = app.deliveryPrice;
      this.collection.each(function(model){
        total += model.get('cost');
      });

      $('.cart-total-number').html(total);
    },


    onAddCollection: function (model){
        var view = new CartItemView({model: model});
        var content = view.render().el;
        $('.cart-delivery').before(content);

        $('.empty-cart').addClass('hidden');
        $('.full-cart').removeClass('hidden');
        this.calculateTotal();
    },
    onResetCollection: function(){
      this.setElement($('.main-cart'));

      if (this.collection.models.length === 0) {
        $('.empty-cart').removeClass('hidden');
        $('.full-cart').addClass('hidden');
      } else {
        $('.empty-cart').addClass('hidden');
        $('.full-cart').removeClass('hidden');
      };

      this.collection.each(function(model){
        var view = new CartItemView({model: model});
        //view.$el = $('#ci-' + model.get('id'));
        var $el = $('.ci-'+model.id);

        if ($el.length !== 0) {
          view.setElement($el);
        } else {
          var content = view.render().el;
          $('.cart-delivery').before(content);
        }

      });

      this.calculateTotal();
    },
    onRemoveCollection: function (){
      if (this.collection.models.length === 0) {
        $('.empty-cart').removeClass('hidden');
        $('.full-cart').addClass('hidden');
      };
      this.calculateTotal();
    },
    addToCart: function(id, count){
      var curModel = undefined
        , col = this.collection
        //, saveModel = false
        , result = 0;
      ;

      async.parallel([
        function(callback){
          col.each(function(model){
            if (model.get('id') === id) {
              curModel = model;
            }
          });
          callback(null);
        },
        function(callback){
          $.getJSON('/catalog/'+id)
          .done(function(data) {

            col.add(data);
            curModel = col.models[col.length - 1];
            //saveModel = true;
            //console.log(model, ' -model');
            callback(null);
          })
          .fail(function(data) {
            curModel = undefined;
            callback(null);
          });
        }
      ],
      function(err){

        if (err) {
          result = 0;
          return;
        }

        if (curModel !== undefined) {
          var tot = curModel.get('count') + count,
              max = curModel.get('max_count');

          if (tot > max) {
            tot = max;
          } else if (tot < 0) {
            tot = 0;
          }

          var l_count = tot - curModel.get('count');

          curModel.set('count', curModel.get('count') + l_count);
          curModel.set('cost', curModel.get('count') * curModel.get('price'));

          curModel.save();

          result = l_count;

        }
        else {
          result = 0;
        }

      });

      return result;
    }
  });



  var CartModel = Backbone.Model.extend({

  });

  var CartCollection = Backbone.Collection.extend({
    model: CartModel,
    url: '/cart'
  });

  app.animateImageToCart = function(id) {

    var imagePosition = $('#im-'+id).position(); // получаем позицию изображения
    var cartPosition = $('.main-cart').position(); // получаем позицию корзины
    //cartPosition.left = cartPosition.left + ( $('.main-cart').width() / 2 ); // если корзина справа, то плюсуем, чтобы получить центр, иначе минусуем
    //cartPosition.top = cartPosition.top + ( $('.main-cart').height() / 2 ); // формальность
    $('body').prepend('<div id="imageToCart"><img src="'+ $('#im-'+id).attr('src') +'"></div>'); // вставляем картинку в самом низу страницы

    // моментально накладываем нашу новую картинку поверх существующей
    $('#imageToCart img').css({
      'position': 'absolute',
      'z-index': '1999',
      'left': imagePosition.left + 'px',
      'top': imagePosition.top + 'px',
      'width': $('#im-'+id).width() + 'px',
      'height': $('#im-'+id).height() + 'px'
    });

    // поехала анимация в направлении корзины
    $('#imageToCart img').animate({
      top: cartPosition.top + 'px',
      left: cartPosition.left + 'px',
      opacity: '0',
      width: $('.main-cart').width(),
      height: $('.main-cart').height()
      }, 1000, function() {
      $('#imageToCart').remove();
      });
  }

  app.cart_collection = new CartCollection;
  app.cart_view = new CartView({collection: app.cart_collection});

  app.cart_collection.reset(app.def_cart);

})();


$(function(){
  $('.into-cart').click(function(event){

    if ($(this).attr('disabled') !== 'disabled') {
      var id = $(event.target).attr('data-id');
        app.animateImageToCart(id);
        var in_cart = app.cart_view.addToCart(id, 1);
        //console.log(in_cart);
    }
  });
})