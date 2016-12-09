//请求Apple验证码
var arguments = process.argv;
const count =  arguments[2]|| 5;

var co = require('co');
var urllib = require('urllib');
var fs = require('fs');
var log = require('./log');

// 提取sessionId
var firstRequest = function (){
	 return new Promise(function(resolve, reject) {
	 	// log('准备注册','grey')
		var headers = {
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Encoding": "gzip, deflate, sdch, br",
				"Accept-Language": "zh-CN,zh;q=0.8",
				"Connection": "keep-alive",
				"Cookie": cookie(),
				"Host": "appleid.apple.com",
				"Referer": "https://www.icloud.com/",
				"Upgrade-Insecure-Requests": "1",
		};

		urllib.request("https://appleid.apple.com/widget/account/?widgetKey=" + widgetKey + "&locale=zh_CN&font=sf&v=2", {
		  method: 'GET',
		  headers: headers
		}).then(function ( data) {
				updateScnt(data.headers.scnt)
		  		data = data.data.toString();
				var index = data.indexOf("sessionId");
				var index2 = data.indexOf('\'', index);
				var index3 = data.indexOf('\'', index2 + 1);
				sessionId = data.substring(index2 + 1, index3);
				// console.log(sessionId)
				// console.log('【参数 sessionId 】: ',sessionId);
				resolve(true);
		}).catch(function (err) {
			    // logger.error(err);
			    reject(new Error('请求超时或出错'));
			});

	 });
}

// 提取验证码
var captchaRequest = function (name){
	return new Promise(function(resolve, reject) {
			var headers = getHeader();
			
			urllib.request("https://appleid.apple.com/captcha", {
			  method: 'POST',
			  headers: headers,
			  data:{
			  	"type":"IMAGE"
			  }
			}).then(function (data) {
				updateScnt(data.headers.scnt);
				// console.log(data)
				data = JSON.parse(data.data.toString());
				captcha_token = data.token;
				captcha_id = data.id;
				// console.log('sessionId: ', sessionId);
				log('保存验证码 ' + (name || 'test.jpg'))
				fs.writeFile( 'img_src/' + name || 'test.jpg', new Buffer(data.payload.content, 'base64') ,resolve(true) )

			}).catch(function (err) {
				  logger.error(err);
			   reject(new Error('保存验证码失败 ' ))
			});
	 });
};

var sessionId = "";
var scnt = '';
var captcha_id = '';
var captcha_token = '';
var widgetKey = "83545bf919730e51dbfba24e7e8a78d2";

function getHeader(){
	return {
			"Accept": "application/json, text/javascript, */*; q=0.01",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-CN,zh;q=0.8",
			"Connection": "keep-alive",
			"Content-Type": "application/json",
			"Cookie": cookie(),
			"Host": "appleid.apple.com",
			"Origin": "https://appleid.apple.com",
			"Referer": "https://appleid.apple.com/widget/account/?widgetKey=" + widgetKey + "&locale=zh_CN&font=sf&v=2",
			"X-Apple-ID-Session-Id": sessionId,
			"X-Apple-Widget-Key": widgetKey,
			"X-Requested-With": "XMLHttpRequest",
			"User-Agent":  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
			"scnt": scnt
		};
}

var updateScnt = function(s){
	scnt = s; // console.log('【参数 scnt 】'+ scnt)
}


function cookie() {
	var _sessionId = "";
	if (sessionId != null && sessionId.length > 0) {
		_sessionId = sessionId; 
	} else {
		_sessionId = "aid=82E752713983EC353EF82617CB30E60B91CB511F1A3E08FC3E8D310389DCFDEC9C1940D89BEB928D7BCC8A6BB20F69B551E81ADBFEBCB099F142356ABE7C6F7E1DFA37FF0DABC2B50FBCAC2A68C4CDEFF0C15AC5F6466354CCF3CDE9838FC56917142F21AFB6631C059EC3A508B4E52AA13D718BAF4BB1A81076D7915F181CD0CB1040DE6046C03E6740159C8F8066DB18E9C7A7420AEE3C33A90738A71272641FD059AF992B1808D51DCF24F1E5BB2B9731BB8EC8EFE6CD73F438663CD05A9E18F036598569F4EE7AC6113AB62BA71FFFDC4274AD33DD6B7D0FF70E11E2CBA774C4F448C2CDD13B06E4FEDB6352962DC40C1A44605D6D4B806F8FDF95376C38";
	}
	var ret = "xp_ci=3z4DVcXjz77bz5KpzCnNzQQgsERi; s_vnum_n2_cn=30%7C1%2C1%7C1; geo=CN; ccl=5NN+5nkM2dCrI7DzGYLsmw==; POD=us~en; s_ppvl=apple%2520-%2520index%2Ftab%2520%2528us%2529%2C100%2C71%2C1222%2C200%3A2%7C300%3A5%7C400%3A5%7C500%3A5%7C600%3A5%7C700%3A5%7C800%3A5%7C900%3A5%7C1000%3A5%7C1100%3A5; s_vnum_n2_us=19%7C3%2C4%7C4%2C3%7C1; s_cc=true; s_orientation=%5B%5BB%5D%5D; s_orientationHeight=1147; s_fid=1CEF04504A9D8C8F-0DD0379BD86808D0; s_sq=appleussupportdev1%2Cappleglobal%252Capplesupport%3D%2526c.%2526a.%2526activitymap.%2526page%253Dacs%25253A%25253Ahome%25253A%25253Ahome%25253A%25253Alanding%252520%252528en-us%252529%252520%2526link%253DApple%2526region%253Dac-globalnav%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c%2526pid%253Dacs%25253A%25253Ahome%25253A%25253Ahome%25253A%25253Alanding%252520%252528en-us%252529%252520%2526pidt%253D1%2526oid%253Dhttps%25253A%25252F%25252Fwww.apple.com%25252F%2526ot%253DA; s_vi=[CS]v1|2BD6CFE3051926C7-60000611C0001283[CE]; idclient=web; dslang=CN-ZH; site=CHN;";
	ret = ret + _sessionId;
	return ret;
}
	
co.wrap(function* () {
	log(`准备生成${count}个图片`,'yellow');
	yield firstRequest();
	for(var i = 0; i< count; i++){
		
		yield captchaRequest(`img_${i}.jpg`)
	}
})();
