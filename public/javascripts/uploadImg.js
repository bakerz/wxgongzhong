$(function(){
	var $_btn = $('#submit-btn');
	var $_alertBox = $('.alert-box');
	
	$('#img').change(function() {
		var imgVal = $(this).val();
		
		if(imgVal.length == 0){
			$('.alert-box').html('<div class="alert alert-danger" role="alert">请选择要上传的文件</div>');
			$_btn.attr('disabled', 'disabled');
			return false;
		}
		
		var extName = imgVal.substring(imgVal.lastIndexOf('.'), imgVal.length).toLowerCase();
		
		if(extName != '.png' && extName != '.jpg') {
			$('.alert-box').html('<div class="alert alert-danger" role="alert">只支持png和jpg格式图片</div>');
			$_btn.attr('disabled', 'disabled');
			return false;
		}
		
		// 图片预览
		var objUrl = getObjectURL(this.files[0]);
		if(objUrl) {
			$('.img-group div.col-xs-12').before('<div class="col-xs-4 pro-img-item"><img src="'+ objUrl +'" id="img0"></div>');
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