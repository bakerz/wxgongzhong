$(function() {
	$('.submit-btn').click(function() {
		var name = $('input[name="name"]').val().trim();
		var artno = $('input[name="artno"]').val().trim();
		var place = $('input[name="place"]').val().trim();
		var price = $('input[name="price"]').val().trim();
		var stock = $('input[name="stock"]').val().trim();
		if(!name.length>0 || !artno.length>0 || !place.length>0 || !price.length>0 || !stock.length>0) {
			$('.alert-box').html('<div class="alert alert-danger" role="alert">请完整填写每项数据</div>');
			$(document).scrollTop(0);
			return false;
		}
	})
});