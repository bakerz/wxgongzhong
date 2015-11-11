var express = require('express');
var router = express.Router();

var model = require('../models/model');
var checkIsLogin = require('./checkLogin');

var User = model.User;

var formidable = require('formidable'),
	fs = require('fs'),
	AVATAR_UPLOAD_FOLDER = '/avatar/',
	TITLE = '货品管理',
	fn;

/* GET home page. */
//router.get('/', checkIsLogin.notLogin);
router.get('/', function(req, res, next) {
  res.render('index', { title: TITLE });
});

router.post('/', function(req, res) {
	
    //创建上传表单
    var form = new formidable.IncomingForm();
    
    //设置编辑
    form.encoding = 'utf-8';
    
    //设置上传目录
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;
    
    //保留后缀
    form.keepExtensions = true;
    
    //文件大小 2M
    form.maxFieldsSize = 2 * 1024 * 1024;
    
    // 上传文件的入口文件
    form.parse(req, function(err, fields, files) {
    
        if (err) {
            console.log(err);
            res.render('index', { title: TITLE });
            return;
        }
        
        var extName = '';  //后缀名
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;		 
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;		 
        }
    
        if(extName.length == 0){
            console.log('只支持png和jpg格式图片');
            res.render('index', { title: TITLE });
            return;				   
        }

        var avatarName = Math.random() + '.' + extName;
        var newPath = form.uploadDir + avatarName;
        fs.renameSync(files.fulAvatar.path, newPath);  //重命名
		
		res.render('index', { title: TITLE });
    });

    console.log('上传成功');
})

router.get('/login', function(req, res) {
	res.render('login', { title: '登录' });
})

router.get('/reg', function(req, res) {
	res.render('register', { title: '注册' });
})

router.post('/reg', function(req, res, next) {
	var username = req.body.username,
		password = req.body.password,
		passwordRepeat = req.body.passwordRepeat;

	//检查两次输入的密码是否一致
	if(password != passwordRepeat) {
		req.flash('error', '两次输入的密码不一致！');
		return res.redirect('/reg');
	}

	//检查用户名是否已经存在
	User.findOne({username:username}, function(err, user) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}

		if(user) {
			req.flash('error', '用户名已经存在');
			return res.redirect('/reg');
		}

		//对密码进行md5加密
		var md5 = crypto.createHash('md5'),
			md5password = md5.update(password).digest('hex');

		var newUser = new User({
			username: username,
			password: md5password,
			email: req.body.email
		});

		newUser.save(function(err, doc) {
			if(err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.flash('success', '注册成功！');
			newUser.password = null;
			delete newUser.password;
			req.session.user = newUser;
			return res.redirect('/');
		});
	});
});

module.exports = router;
