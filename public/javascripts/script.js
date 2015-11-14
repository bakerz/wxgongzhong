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
			alert('请选择要上传的文件');
			return false;
		}
		
		// 验证上传文件后缀
		var extName = imgVal.substring(imgVal.lastIndexOf('.'), imgVal.length).toLowerCase();
		
		if(extName != '.png' && extName != '.jpg') {
			alert('只支持png和jpg格式图片');
			return false;
		}
		
		// 图片预览
		var objUrl = getObjectURL(this.files[0]);
		console.log('objUrl = ' + objUrl);
		if(objUrl) {
			$('.img-group div.col-xs-12').before('<div class="col-xs-4 pro-img-item"><img src="'+ objUrl +'" id="img0"></div>');
		}
		
		$('#pro-img').modal('hide');
		$(this).val('');
		return true;
	});
	
	// 颜色
	$('.color-ok-btn').on('click', function() {
		var color = $('input[name="color"]').val();
		$('#pro-color').modal('hide');
		$('.pro-color-box').append('<div class="pro-color-item">'+ color +'</div>');
	});
	
	// 尺寸
	$('.size-ok-btn').on('click', function() {
		var size = $('input[name="size"]').val();
		$('#pro-size').modal('hide');
		$('.pro-size-box').append('<div class="pro-size-item">'+ size +'</div>');
	});
});

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