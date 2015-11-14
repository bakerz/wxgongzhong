var express = require('express');
var crypto = require('crypto');
var router = express.Router();

var model = require('../models/model');
var checkIsLogin = require('./checkLogin');

var User = model.User;
var Product = model.Product;

var formidable = require('formidable'),
	fs = require('fs'),
	AVATAR_UPLOAD_FOLDER = '/avatar/',
	TITLE = '货品管理',
	fn;

/* GET home page. */
router.get('/', checkIsLogin.notLogin);
router.get('/', function(req, res, next) {
	res.render('index', {
		title: TITLE,
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/', function(req, res) {
	var data = new Product({
		username: req.session.user.username,
		name: req.body.name,
		artno: req.body.artno,
		place: req.body.place,
		price: req.body.price,
		stock: req.body.stock
	});
	
	data.save(function(err, doc) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		
		req.flash('success', '提交成功');
		return res.redirect('/uploadImg');
	});
	
})

/*-----------------------------------*\
|-------------登录login---------------|
\*-----------------------------------*/
router.get('/login', function(req, res) {
	res.render('login', { 
		title: '登录',
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
})

router.post('/login', function(req, res, next) {
	var username = req.body.username,
		password = req.body.password;

	User.findOne({username:username}, function(err, user) {
		if(err) {
			req.flash("err", err);
			return next(err);
		}
		if(!user) {
			req.flash('error', '用户不存在！');
			return res.redirect('/login');
		}
		//对密码进行md5加密
		var md5 = crypto.createHash('md5'),
			md5password = md5.update(password).digest('hex');
		if(user.password !== md5password) {
			req.flash('error', '密码错误！');
			return res.redirect('/login');	
		}
		req.flash('success', '登录成功！');
		user.password = null;
		delete user.password;
		req.session.user = user;
		return res.redirect('/');
	});
});

/*-----------------------------------*\
|-------------注册register------------|
\*-----------------------------------*/
router.get('/reg', function(req, res) {
	res.render('register', { 
		title: '注册',
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
})

router.post('/reg', function(req, res, next) {
	var username = req.body.username,
		password = req.body.password,
		passwordRepeat = req.body.passwordRepeat;

	//检查两次输入的密码是否一致
	if(password != passwordRepeat) {
		console.log('两次输入的密码不一致！');
		req.flash('error', '两次输入的密码不一致');
		return res.redirect('/reg');
	}

	//检查用户名是否已经存在
	User.findOne({username:username}, function(err, user) {
		if(err) {
			console.log(err);
			req.flash('error', err);
			return res.redirect('/reg');
		}

		if(user) {
			console.log('用户名已经存在');
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
				console.log(err);
				req.flash('error', err);
				return res.redirect('/reg');
			}
			console.log('注册成功！');
			req.flash('success', '注册成功');
			newUser.password = null;
			delete newUser.password;
			req.session.user = newUser;
			return res.redirect('/');
		});
	});
});

/*-----------------------------------*\
|------------图片uploadImg------------|
\*-----------------------------------*/
router.get('/uploadImg', function(req, res, next) {
	res.render('uploadImg', {
		title: '上传图片',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/uploadImg', function(req, res, next) {
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
			req.flash('error', err);
            res.render('index', { title: TITLE });
            return;
        }
        
        var extName = '';  //后缀名
        switch (files.img.type) {
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
			req.flash('error', '只支持png和jpg格式图片');
            return res.redirect('/uploadImg');				   
        }

        var avatarName = Math.random() + '.' + extName;
        var newPath = form.uploadDir + avatarName;
        fs.renameSync(files.img.path, newPath);  //重命名
    });

    console.log('上传成功');
	req.flash('success', '上传成功');
	res.redirect('/uploadImg');
})
/*-----------------------------------*\
|-------------退出logout--------------|
\*-----------------------------------*/
router.get('/logout', function(req, res, next) {
	req.session.user = null;
	req.flash('success', '退出登录成功！');
	return res.redirect('/login');
});


/*-----------------------------------*\
|------------活动activity-------------|
\*-----------------------------------*/
router.get('/activity', function(req, res, next) {
	res.render('activity', { title: '活动策划' });
});
module.exports = router;
