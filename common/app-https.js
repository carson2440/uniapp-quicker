
// const host = "http://test.app.haogongeasy.com:88" // test
const host = "http://dev.app.haogongeasy.com:88" // dev
// const host = "https://cloud.app.haogonge.com" // release


//可以用于后面的页面给前面的页面传递参数
const prevPage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

function combineURLs(baseURL, relativeURL) {
	return relativeURL ?
		baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') :
		baseURL
}
//网络请求封装方法，支持调用传递请求类型，参数
const http = (obj) => {
	let token = uni.getStorageSync('userInfo').token || '';
	let requestData = obj.data || {};
	let showLoading = obj.showLoading || true;

	console.log("-> " + obj.url + " : " + JSON.stringify(requestData));
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
				if (res.data.success == false) {
					console.error("error: " + JSON.stringify(res.data));
				}
				if (res.data.code && res.data.code != '200') { //不生效
					console.error("error: " + JSON.stringify(res.data));
					//处理token过期
					if (res.data.code == '1000') {
						uni.removeStorageSync('userInfo');
						uni.reLaunch({
							url: "/pages/login/login" //这里是绝对路径
						});
					}
				}
			},
			fail: function(res) {
				if (showLoading) {
					uni.hideLoading();
				}
				// console.log("request error: " + JSON.stringify(res));
				reject(res)
			},
			complete: function(res) {
				if (res.errMsg == 'request:fail abort statusCode:-1') {
					uni.showToast({
						title: '网络异常',
						image:'/static/network_error.png',
						duration: 2000
					});
				}
			}
		});
	})
};


const appVersionCheck=(onlyCheck)=>{
	// #ifdef APP-PLUS		
	let osType = "IOS";
	if (uni.getSystemInfoSync().platform == "android") {
		osType = "ANDROID";
	}
	
	return new Promise(function(resolve,reject){
		plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
			var reqData = {
				"osType": osType,
				"deviceType": "APP",
				"buildNumber": wgtinfo.versionCode
			};
			
			let _this = this;
			uni.request({
				url: server + "/api/v1/admin/system/app-version/upgrade",
				method: 'POST',
				header: {
					'content-type': 'application/json'
				},
				data: JSON.stringify(reqData),
				success: function(res) {
					if (res.data.success && res.data.object.appVersionResponse) {
						let newVersion = res.data.object.appVersionResponse.appVersion;
						let apkUrl = res.data.object.appVersionResponse.url;
						let forceUpdate = res.data.object.appVersionResponse.appForce;
						if(!onlyCheck){
							uni.showModal({ //提醒用户更新
								title: "发现新版本 "+newVersion,
								content: res.data.object.appVersionResponse.remark,
								showCancel:!forceUpdate,
								success: (dialog) => {
									if (dialog.confirm || forceUpdate) {
										if (uni.getSystemInfoSync().platform == "android") {
											uni.showLoading({
												title: '更新中...'
											})
											uni.downloadFile({
												url: apkUrl,
												success: result => {
													uni.hideLoading();
													if (result.statusCode == 200) {
														plus.runtime.install(
															result.tempFilePath, {
																force: true
															},
															function(ress) {
																plus.runtime.restart();
															}
														)
													}
												}
											})
										}else{
											//https://blog.csdn.net/csl125/article/details/107492568?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~all~sobaiduend~default-1-107492568.nonecase&utm_term=uniapp%20%E6%80%8E%E4%B9%88%E8%8E%B7%E5%8F%96%E7%89%88%E6%9C%AC%E5%8F%B7&spm=1000.2123.3001.4430
											//https://apps.apple.com/cn/app/%E5%A5%BD%E5%B7%A5e-pro/id1528944481
											plus.runtime.openURL(apkUrl);
										}
									}
								}
							})
						}
						resolve(newVersion);
					}
				}
			})
		})
	});
	// #endif
	
}


export default{
	host,
	http,
	prevPage,
	appVersionCheck
}
