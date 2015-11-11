$(function(){
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
});