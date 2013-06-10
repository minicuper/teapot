$(function(){
  // $('tr.list-item').click(function(event){
  //   var id = $(event.currentTarget).attr('data-id');
  //   document.location.href = '/admin/product/'+id+'/edit';
  // });
  
  // $('.list-checkbox').click(function(event){ event.stopPropagation() });
  // $('.product-edit').click(function(event){
  //   var id = $(this).attr('data-id');
  // })
  
  $('.clear-select').click(function(event){
    $(".category-select :first-child").prop("selected", true);
  });
})