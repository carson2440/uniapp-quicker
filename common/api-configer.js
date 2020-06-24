// const host = "https://cloud.yhgb.haogonge.com" // release
const host = "https://dev.yhgb.haogongeasy.com:883" // dev

function combineURLs(baseURL, relativeURL) {
	return relativeURL ?
		baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') :
		baseURL
}
const uniRequest = (obj) => {
	let token = uni.getStorageSync('loginUser').token || '';
	let requestData = obj.data || {};
	let showLoading = obj.showLoading || true;

	console.log("request->: " + obj.url + " : " + JSON.stringify(requestData));

	return new Promise((resolve, reject) => {

		if (showLoading) {
			uni.showLoading({
				title: '加载中'
			});
		}
		let requestMethod = (obj.method || "POST").toLocaleUpperCase();
		let requestHeader = requestMethod == 'GET' ? {
			'token': token
		} : {
			'token': token,
			'content-type': 'application/json'
		};

		uni.request({
			url: combineURLs(host, obj.url),
			method: requestMethod,
			header: requestHeader,
			data: requestMethod == 'GET' ? requestData : JSON.stringify(requestData),
			success: function(res) {
				if (showLoading) {
					uni.hideLoading();
				}
				resolve(res);

				// 响应拦截在这里处理
				// if (!res.data.success) {
				// 	console.error("error: " + JSON.stringify(res.data));
				// 	if (res.data.code == '1000') {
				// 		uni.removeStorageSync('token');
				// 		uni.reLaunch({
				// 			url: "../login/login"
				// 		});
				// 	} else {
				// 		uni.showToast({
				// 			title: res.data.message,
				// 			icon: 'none'
				// 		});
				// 	}
				// }
			},
			fail: function(res) {
				if (showLoading) {
					uni.hideLoading();
				}
				// console.log("request error: " + JSON.stringify(res));
				reject(res)
			},
			complete: function(res) {
				if (res.request == 'fail timeout') {
					uni.showToast({
						title: '超时',
						duration: 2000
					});
				}
			}
		});
	})
};

const uniImageUrl = (obj) => {
	return host + "/api/v1/yhgb/app/file/redirect-file-url?fileName=" + obj;
}

//可以用于后面的页面给前面的页面传递参数
const prevPage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


//全局挂载，在main.js中进行设置
export default {
	uniRequest,
	uniImageUrl,
	prevPage	
}
