
  $(document).ready(function(){
    $("input[name='baracuda']").attr('autocomplete', 'off');
    $("input,select,textarea").not("[type=submit]").jqBootstrapValidation();

		var isLocalStorageAvailable = function() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
		};

		var loadFromLocalStorage = function(){
			if (isLocalStorageAvailable() === true) {
				var $name = $('input[name="name"]');
				var $zip = $('input[name="zip"]');
				var $email = $('input[name="e-mail"]')
				var $address = $('textarea[name="address"]');

				if ($name.val() === '') {
					$name.val(localStorage['name']);
				}
				if ($zip.val() === '') {
					$zip.val(localStorage['zip']);
				}
				if ($email.val() === '') {
					$email.val(localStorage['e-mail']);
				}
				if ($address.val() === '') {
					$address.val(localStorage['address']);
				}

			}
		};

		var saveToLocalStorage = function(event){
			console.log('changed: ', this);
			if (isLocalStorageAvailable() === true) {
				var name = $(this).attr('name');
				localStorage[name] = $(this).val();
			}
		}

		var fillAddress = function(){

			var pr    = $('.province').val();
			var city  = $('.city').val();
			var add   = $('.address1').val();

			var $area = $('textarea[name="address"]');

			//var text = $('textarea[name="address"]').val();



			//if (pr !== '' && city !== '' && add !== '') {
				$area.val(pr + ', ' + city + ', ' + add);
				saveToLocalStorage.call($area[0]);
			//}
		}

		$('.city, .province, .address1').change(fillAddress);

		$('input[name="name"], input[name="zip"], input[name="e-mail"], textarea[name="address"]').change(saveToLocalStorage);

		loadFromLocalStorage();

    var $form = $('#orderForm');

    $form.submit(function(){
      $.post("/order", $form.serialize(), function(data, textStatus, jqXHR){
        if (data.action === 'redraw') {
          $('.content').html(data.content);
        }
        if (data.action === 'redirect') {
          location.href=data.content;
        }
        if (data.action === 'paysto') {
          var inp = JSON.parse(data.content);

          $('[name="PAYSTO_SHOP_ID"]').val(inp.PAYSTO_SHOP_ID);
          $('[name="PAYSTO_SUM"]').val(inp.PAYSTO_SUM);
          $('[name="PAYSTO_INVOICE_ID"]').val(inp.PAYSTO_INVOICE_ID);
          $('[name="PAYSTO_DESC"]').val(inp.PAYSTO_DESC);
          $('[name="PayerEMail"]').val(inp.PayerEMail);

          $('#paysto').submit();
        }
        console.log('Make post');
      })
      .error(function(){
        console.log('Error post');
      })
      return false;
    })

  });
