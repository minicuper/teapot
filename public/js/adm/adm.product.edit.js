$(function(){
  //moment.lang('ru');
  var refreshImgs = function(){
    $('.image-url').each(function(index){
      this.name = 'images[' + index + '][url]';
    });
  }

  $('.add-image').click(function(event){

    var line = $('#image-item').html();

    $('.image-tbody').append(line);

    Holder.run();
    refreshImgs();

    return false;
  });

  var refreshRefs = function(){
    $('.ref-item .inp-name input').each(function(index){
      this.name = 'refs[' + index + '][name]';
    });

    $('.ref-item .inp-url input').each(function(index){
      this.name = 'refs[' + index + '][url]';
    });
  }

  var isValidUrl = function (url)
  {
    var objRE = /(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i;
    return objRE.test(url);
  }

  $('.add-ref').click(function(event){
    var line = $('#ref-item').html();
    $('.ref-tbody').append(line);

    refreshRefs();

    return false;
  });

  $('.image-del').live('click', function(event){
    $(this).parents('.image-item').remove();
    refreshImgs();
    return false;
  });

  $('.ref-del').live('click', function(event){
    $(this).parents('.ref-item').remove();
    refreshRefs();
    return false;
  });

  // $('.image-tbody').on('input keyup', '.image-url', function(event){

  //   if (isValidUrl(this.value)) {
  //     $(this).parents('.image-item').find('img').attr('src', this.value);
  //   }

  //   console.log('input keyup', this.value);
  // });

  // $('body').on('error', 'img', function(){
  //   console.log('error');
  //   $(this).attr('src', 'holder.js/42x28');
  //   Holder.run();
  // });

  $('#text').wysihtml5({
    "locale": "ru-RU",
		"font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
		"emphasis": true, //Italics, bold, etc. Default true
		"lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
		"html": true, //Button which allows you to edit the generated HTML. Default false
		"link": true, //Button to insert a link. Default true
		"image": true, //Button to insert an image. Default true,
		"color": false //Button to change color of font
	});

})