var app_info = require('../app-info');
var https = require('https');

var cachedSignatures = {};

// 生成签名的随机串
var createNonceStr = function () {
	return Math.random().toString(36).substr(2, 15);
};

// 生成签名的时间戳
var createTimestamp = function () {
	return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
	var keys = Object.keys(args);
	keys = keys.sort()
	var newArgs = {};
	keys.forEach(function (key) {
		newArgs[key.toLowerCase()] = args[key];
	});

	var string = '';
	for (var k in newArgs) {
		string += '&' + k + '=' + newArgs[k];
	}
	string = string.substr(1);
	return string;
};

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
var sign = function (jsapi_ticket, url) {
	var ret = {
		jsapi_ticket: jsapi_ticket,
		nonceStr: createNonceStr(),
		timestamp: createTimestamp(),
		url: 'http://www.qzfny.com:3001' + url
	};
	var string = raw(ret),
		jsSHA = require('jssha'),
		shaObj = new jsSHA(string, 'TEXT');
	
	console.log(string);
	ret.signature = shaObj.getHash('SHA-1', 'HEX');
	
	console.log('签名= ' + ret.signature);
	return ret;
};

// 获取 jsapi_ticket
var getTicket = function(accessData, url) {
	https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ accessData.access_token +'&type=jsapi', function(_res){
		var str = '', resp;
		_res.on('data', function(data){
			str += data;
		});
		_res.on('end', function(){
			try{
				resp = JSON.parse(str);
			}catch(e){
				return console.log('error: ' + str);
			}
			var appInfo = app_info();
			var ret = sign(resp.ticket, url);
			
			cachedSignatures = {
				nonceStr: ret.nonceStr,
				timestamp: ret.timestamp,
				appId: appInfo[0].app_id,
				signature: ret.signature,
				url: ret.url,
				access_token: accessData.access_token
			};
			
			return cachedSignatures;
		});
	});
};

// 获取 access_token
var getAccessToken = function(url) {
	// 2h后过期，需要重新计算签名
	var expireTime = 7100;
	var appInfo = app_info();
	
	if(cachedSignatures && cachedSignatures.nonceStr &&cachedSignatures.timestamp) {
		var t = createTimestamp() - cachedSignatures.timestamp;
		console.log('======= signature ========');
		
		if(t < expireTime) {
			console.log('====== result form cache ======');
			console.log('appId     = ' + cachedSignatures.appId);
			console.log('timestamp = ' + cachedSignatures.timestamp);
			console.log('nonceStr  = ' + cachedSignatures.nonceStr);
			console.log('signature = ' + cachedSignatures.signature);
			console.log('url       = ' + cachedSignatures.url);
			console.log('token     = ' + cachedSignatures.access_token);
			return cachedSignatures;
		}
	}
	https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appInfo[0].app_id + '&secret=' + appInfo[0].app_secret, function(_res) {
		var str = '', resp;
		_res.on('data', function(data) {
			str += data;
		});
		_res.on('end', function() {
			try {
				resp = JSON.parse(str);
			} catch(e) {
				return console.log('error: ' + str);
			}
			
			getTicket(resp, url);
		});
	})
};



exports.getAccessToken = getAccessToken;
