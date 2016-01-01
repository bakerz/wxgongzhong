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
		url: url
	};
	var string = raw(ret),
		jsSHA = require('jssha'),
		shaObj = new jsSHA(string, 'TEXT');
		
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
				// return errorRender(res, '解析远程JSON数据错误', str);
				return false
			}
			var appInfo = app_info();
			var signature = sign(resp.ticket, url);
			
			cachedSignatures = {
				nonceStr: createNonceStr(),
				timestamp: createTimestamp(),
				appid: appInfo[0].app_id,
				signature: signature,
				url: url
			};
			
			/*
			responseWithJson(res, {
				nonceStr: nonceStr
				,timestamp: ts
				,appid: appid
				,signature: signature
				,url: url
			});
			*/
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
		console.log('========signature==========' + cachedSignatures.signature);
		
		if(t < expireTime) {
			return true;
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
				// return errorRender(res, '解析远程JSON数据错误', str);
				return 'false';
			}
			
			// getTicket
			getTicket(resp, url);
		});
	})
};

/*;
// 输出数字签名对象
var reponseWithJson = function(res, data) {
	// 允许跨域异步获取
	res.set({
		'Access-Control-Allow-Orign': '*',
		'Access-Control-Allow-Methods': 'POST,GET',
		'Access-control-Allow-Credentials': 'true'
	});
	res.json(data);
};
*/


/*
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
*/

exports.getAccessToken = getAccessToken;
