$(function() {
	var range1 = 0,
		range2 = 0;
	$('input[name="range1"]').change(function() {
		range1 = parseInt($(this).val());
		$('.range2').html(range1+1);
	});
	
	$('input[name="range2"]').change(function() {
		range2 = parseInt($(this).val());
		if(range2 > range1+1) {
			$('.range3').html(range2+1);
			$('.alert-box').html('');
		} else {
			$('.alert-box').html('<div class="alert alert-danger" role="alert">请填写大于 ' + (range1+1) +' 的数</div>');
			setTimeout(function() {$('.alert-box').html('')}, 2000);
		}
	});
	
	$('.submit-btn').click(function() {
		var name = $('input[name="name"]').val().trim();
		var artno = $('input[name="artno"]').val().trim();
		var place = $('input[name="place"]').val().trim();
		var range1 = $('input[name="range1"]').val().trim();
		var range2 = $('input[name="range2"]').val().trim();
		var price1 = $('input[name="price1"]').val().trim();
		var price2 = $('input[name="price2"]').val().trim();
		var price3 = $('input[name="price3"]').val().trim();
		var stock = $('input[name="stock"]').val().trim();
		/*
		if(!name.length>0 || !artno.length>0 || !place.length>0 || !range1.length>0 || !range2.length>0 || !price1.length>0 || !price2.length>0 || !price3.length>0 || !stock.length>0) {
			$('.alert-box').html('<div class="alert alert-danger" role="alert">请完整填写每项数据</div>');
			setTimeout(function() {$('.alert-box').html('')}, 2000);
			return false;
		}
		
		if(parseInt(range1)+1 >= parseInt(range2)) {
			$('.alert-box').html('<div class="alert alert-danger" role="alert">请填写递增的起批量数目</div>');
			setTimeout(function() {$('.alert-box').html('')}, 2000);
			return false;
		}
		*/
	})
});