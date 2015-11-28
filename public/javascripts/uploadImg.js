$(function(){
	var $_btn = $('#submit-btn');
	var $_alertBox = $('.alert-box');
	var $_modalImg = $('#pro-img .modal-img');
	
	$('#img').change(function() {
		var imgVal = $(this).val();
		
		if(imgVal.length == 0){
			$('.alert-box').html('<div class="alert alert-danger" role="alert">请选择要上传的文件</div>');
			setTimeout(function() {$('.alert-box').html('')}, 2000);
			$_btn.attr('disabled', 'disabled');
			$_modalImg.html('');
			return false;
		}
		
		var extName = imgVal.substring(imgVal.lastIndexOf('.'), imgVal.length).toLowerCase();
		
		if(extName != '.png' && extName != '.jpg') {
			$('.alert-box').html('<div class="alert alert-danger" role="alert">只支持png和jpg格式图片</div>');
			setTimeout(function() {$('.alert-box').html('')}, 2000);
			$_btn.attr('disabled', 'disabled');
			$_modalImg.html('');
			return false;
		}
		
		// 图片预览
		var objUrl = getObjectURL(this.files[0]);
		if(objUrl) {
			$_modalImg.html('<img src="'+ objUrl +'" id="img0">');
		}
		
		$_alertBox.html('');
		$_btn.removeAttr('disabled');
		return true;
	});
});


// del
//建立一個可存取到該file的url
function getObjectURL(file) {
	var url = null ; 
	if (window.createObjectURL!=undefined) { // basic
		url = window.createObjectURL(file) ;
	} else if (window.URL!=undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file) ;
	} else if (window.webkitURL!=undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file) ;
	}
	return url ;
}