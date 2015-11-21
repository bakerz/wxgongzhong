$(function() {
	var range1 = 0,
		range2 = 0;
	$('#range1').change(function() {
		range1 = parseInt($(this).val());
		$('.range2').html(range1+1);
	});
	
	$('#range2').change(function() {
		range2 = parseInt($(this).val());
		console.log(typeof(range1), range2);
		if(range2 > range1+1) {
			$('.range3').html(range2+1);
			$('.alert-box').html('');
		} else {
			$('.alert-box').html('<div class="alert alert-danger" role="alert">请填写大于 ' + (range1+1) +' 的数</div>');
		}
	});
});