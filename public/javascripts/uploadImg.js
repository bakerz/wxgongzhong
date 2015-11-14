$(function(){
	/*
    $('#btnSub').on('click',function(){
        var fulAvatarVal = $('#fulAvatar').val(),
        errorTip = '<div id="errorTip" class="alert alert-warning">{0}</div> ';
        
        $("#errorTip,#alt_warning").remove();
        
        if(fulAvatarVal.length == 0) {
            alert('请选择要上传的文件');
            return false;
        }
        
        // 验证上传文件后缀
        var extName = fulAvatarVal.substring(fulAvatarVal.lastIndexOf('.'),fulAvatarVal.length).toLowerCase();
        
        if(extName != '.png' && extName != '.jpg'){
            alert('只支持png和jpg格式图片');
            return false;				
        }
        
        return true;			
    })
	*/
	// 图片
	$('#img').change(function() {
		var imgVal = $(this).val();
		
		if(imgVal.length == 0) {
			$('.alert-box').html('<div class="alert alert-danger" role="alert">请选择要上传的文件</div>');
			return false;
		}
		
		// 验证上传文件后缀
		var extName = imgVal.substring(imgVal.lastIndexOf('.'), imgVal.length).toLowerCase();
		
		if(extName != '.png' && extName != '.jpg') {
			$('.alert-box').html('<div class="alert alert-danger" role="alert">只支持png和jpg格式图片</div>');
			return false;
		}
		
		
		// 图片预览
		var objUrl = getObjectURL(this.files[0]);
		console.log('objUrl = ' + objUrl);
		if(objUrl) {
			$('.img-group div.col-xs-12').before('<div class="col-xs-4 pro-img-item"><img src="'+ objUrl +'" id="img0"></div>');
		}
		
		$('.alert-box').html('');
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