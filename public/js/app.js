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
      'click .close': 'clickClose',
      'change .count-input': 'changeCount'
    },
    template: Hogan.compile('<td class="name"><a href="/catalog/{{id}}">{{name}}</a></td>' +
                            '<td class="hidden-tablet text-count">	{{count}} {{unit}}</td>' +
                            '<td class="cost"> {{cost}} руб.</td>' +
                            '<td><a class=close>&times;</a></td>'),

    onDestroyModel: function(){
      this.remove();
    },
    onChangeModel: function(){
      this.$el.find('.text-count').text(this.model.get('count') +' ' + this.model.get('unit'));
      this.$el.find('.cost').text(this.model.get('cost') +' ' + app.currencyName);
      //this.$el.find('.count-input').val(this.model.get('count'));

      //this.render();
    },
    clickClose: function (){
      this.model.destroy();
      //console.log(this.model.get('id'));
      return false;
    },
    changeCount: function(event){
      var $element = $(event.target);
      var model = this.model;

      model.set('count', $element.val(), {silent: true});
      model.set('cost', model.get('count') * model.get('price'));
      // this.$el.find('.cost').text (model.get('cost') +' ' + app.currencyName);
      model.save();
      // app.cart_view.calculateTotal();

      // console.log(event);
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
      this.collection.on('change', this.onChangeCollection);
      //this.collection.fetch();
    },
    onChangeCollection: function(){
      //console.log('onChangeCollection');
      this.calculateTotal();
    },

    calculateTotal: function(){
      //console.log('calculateTotal');
      var total = app.deliveryPrice;
      this.collection.each(function(model){
        total += model.get('cost');
      });

      $('.cart-total-number').html(total);
    },


    onAddCollection: function (model){
      //console.log('onAddCollection');
        var view = new CartItemView({model: model});
        var content = view.render().el;
        $('.cart-delivery').before(content);

        $('.empty-cart').addClass('hidden');
        $('.full-cart').removeClass('hidden');
        this.calculateTotal();
    },
    onResetCollection: function(){
      //console.log('onResetCollection');
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
      //console.log('onRemoveCollection');
      if (this.collection.models.length === 0) {
        $('.empty-cart').removeClass('hidden');
        $('.full-cart').addClass('hidden');
      };
      this.calculateTotal();
    },
    addToCart: function(id, count, cb){
      //console.log('addToCart');
      var curModel = undefined
        , col = this.collection
        //, saveModel = false
        //, result = 0;
      ;


      col.each(function(model){
        if (model.get('id') === id) {
          curModel = model;
        }
      });

      if (curModel !== undefined) {//В корзине уже есть такой товар
        var tot = curModel.get('count') + count,
            max = curModel.get('max_count');

        if (tot > max) {
          tot = max;
        } else if (tot < 0) {
          tot = 0;
        }

        var l_count = tot - curModel.get('count');

        curModel.set('count', curModel.get('count') + l_count, {silent: true});
        curModel.set('cost', curModel.get('count') * curModel.get('price'));

        curModel.save();

        //this.calculateTotal();

        cb(l_count);

      } else { //Такого товара еще нет в корзине

        $.getJSON('/catalog/'+id)
        .done(function(data) {
          data.count = count;
          data.cost = count * data.price;
          col.add(data);
          curModel = col.models[col.length - 1];
          curModel.save();
          cb(count);
        })
        .fail(function(data) {
          //curModel = undefined;
          cb(0);
        });

      }

    } //end of addToCart
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
        var in_cart = app.cart_view.addToCart(id, 1, function(n){
          return;
        });
        //console.log(in_cart);
    }
  });
})