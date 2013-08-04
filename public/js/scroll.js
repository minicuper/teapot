$(function(){
  $('.upscroll-btn').click(function(e){
    e.preventDefault();
    $.scrollTo('0', 1000); /* откручиваем наверх */
  })
})