$(function(){
  moment.lang('ru');

  var refreshRefs = function(){
    $('.status-item .status-date input').each(function(index){
      this.name = 'statuses[' + index + '][date]';
    });

    $('.status-item .status-status select').each(function(index){
      this.name = 'statuses[' + index + '][status]';
    });

    $('.status-item .status-comment input').each(function(index){
      this.name = 'statuses[' + index + '][comment]';
    });

  }

  var refreshOrderItems = function(){
    var a = ['name', 'id', 'count', 'cost'];

    _.each(a, function(name){
      $('.order-item-'+name).each(function(index){
        this.name = 'items[' + index + ']['+name+']';
      });
    });

  }

  $('.add-status-btn').click(function(event){
    var line = $('#status-template').html();
    var $new_status = $(line);
    var date = new Date();

    $new_status.find('.status-date span').text(moment(date).zone('+0400').format('LLL'));
    $new_status.find('.status-date input').val(date.toISOString());

    $new_status.appendTo('.status-body');

    refreshRefs();

    return false;
  });

  $('.status-del').live('click', function(event){
    $(this).parents('.status-item').remove();
    refreshRefs();
    return false;
  });

  $('.btn-del-order-item').live('click', function(event){
    $(this).parents('.order-item').remove();
    refreshOrderItems();
    return false;
  });


})