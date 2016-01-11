var express = require('express');
var crypto  = require('crypto');
var http    = require('http');
var router  = express.Router();

var sign = require('./sign');

var model = require('../models/model');
var checkIsLogin = require('./checkLogin');

var User = model.User;
var Product = model.Product;

var formidable = require('formidable'),
	fs = require('fs'),
	AVATAR_UPLOAD_FOLDER = '/avatar/',
	end;

var config;
/*-----------------------------------*\
|--------------货品列表---------------|
\*-----------------------------------*/
router.get('/', checkIsLogin.notLogin);
router.get('/', function(req, res, next) {
	Product.find({
		username: req.session.user.username
	}, function(err, products) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		
		res.render('index', {
			title: '货品列表',
			products: products,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
			
		});
	})
});

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
|--------编辑货品信息product----------|
\*-----------------------------------*/
router.get('/product', function(req, res) {
	res.render('product', {
		title: '货品管理',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/product', function(req, res) {
	var arr_range = [];
	var arr_price = [];
	
	arr_range.push(req.body.range1, req.body.range2);
	arr_price.push(req.body.price1, req.body.price2, req.body.price3);
	
	var newProduct = new Product({
		username: req.session.user.username,
		name: req.body.name,
		artno: req.body.artno,
		place: req.body.place,
		range: arr_range,
		price: arr_price,
		stock: req.body.stock
	});
	
	newProduct.save(function(err, doc) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/product');
		}
		
		req.flash('success', '提交成功');
		req.session.product = {
			username: newProduct.username,
			name: newProduct.name,
			artno: newProduct.artno
		};
		return res.redirect('/uploadImg');
	});
});

/*-----------------------------------*\
|------------图片uploadImg------------|
\*-----------------------------------*/
router.get('/uploadImg', function(req, res, next) {
	config = sign.getAccessToken(req.url);
	
	Product.findOne({
		name: req.session.product.name,
		artno: req.session.product.artno
	}, function(err, product) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/uploadImg');
		}

		res.render('uploadImg', {
			title: '上传图片',
			user: req.session.user,
			proImgs: product.imgs,
			success: req.flash('success').toString(),
			error: req.flash('error').toString(),
			config: config
		});
	})
});

// 图片下载到本地服务器
router.get('/downloadImg/:media_id', function(req, res, next) {
	var url = 'http://api.weixin.qq.com/cgi-bin/media/get?access_token='+config.access_token+'&media_id='+ req.params.media_id;
	console.log('url = '+ url);
	http.get(url, function(_res) {
		_res.on('data', function(data) {
			console.log('server=' + data);
		});
		_res.on('end', function() {
			try {
				return 'success';
			} catch(e) {
				return 'error';
			}
		});
	});
});

router.post('/uploadImg', function(req, res, next) {
	
	//var file = req.body.img;
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
            return res.redirect('/uploadImg');
        }
        
        var extName = '';  //后缀名
		console.log('file = ' + files.img);
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
		
		Product.update({
			username: req.session.product.username,
			name: req.session.product.name,
			artno: req.session.product.artno
		},{
			$push: {'imgs': avatarName}
		}, function(err) {
			if(err) {
				req.flash('error', err);
				return res.redirect('/uploadImg');
			}
		})

		console.log('上传成功');
		req.flash('success', '上传成功');
		res.redirect('/uploadImg');
    });
	/*
	//get filename
	var filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);
	//copy file to a public directory
	var targetPath = path.dirname(__filename) + '/public/' + filename;
	//copy file
	fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
	//return file url
	res.json({code: 200, msg: {url: 'http://' + req.headers.host + '/' + filename}});
	res.redirect('/uploadImg');
	*/
})

/*-----------------------------------*\
|-----------提交完成complete----------|
\*-----------------------------------*/
router.get('/complete', function(req, res, next) {
	Product.findOne({
		name: req.session.product.name,
		artno: req.session.product.artno
	}, function(err, product) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		
		res.render('complete', {
			product: product,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		})
	});
});

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
