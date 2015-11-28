$(function() {
	var html = $('.alert-box').html();
	
	if(html.length > 0) {
		setTimeout(function() {$('.alert-box').html('')}, 2000);
	}
});