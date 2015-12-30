var app_info = require('../app-info');

var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

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
  var string = raw(ret);
      jsSHA = require('jssha');
      shaObj = new jsSHA(string, 'TEXT');
  ret.signature = shaObj.getHash('SHA-1', 'HEX');

  return ret;
};


/*
* 获取 access_token
*/

var getAccessToken = function() {
	// 2h后过期，需要重新计算签名
	var expireTime = 7100;
	var appInfo = app_info();
	return expireTime;
	/*;
	http.get('', function(res) {});
	
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
}

//module.exports = getAccessToken;
exports.getAccessToken = getAccessToken;
//module.exports = get_access_token;
