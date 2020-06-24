<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title" @tap="login">{{title}}</text>
		</view>
		<view>
		    <text class="hello-text">uni-app内置组件，展示样式仅供参考，文档详见：https://uniapp.dcloud.io/component/</text>
		</view>
	</view>
</template>

<script>
	var dateUtils = require('@/common/utils.js').dateUtils;
	var utils = require('@/common/utils.js'); //导入的是对象
	export default {
		data() {
			return {
				title: 'uniapp 开发提速项目',
				user: {
					name: 'carson2440',
					mobile: '18140092007'
				}
			}
		},
		onLoad() {
			console.log(dateUtils.formatTime(330));
			let form = utils.dateUtils.format("2020-06-18 17:34:05");
			let hum = dateUtils.humanize(50002);
			//yyyy-mm-dd HH:MM:ss
			let parse = dateUtils.parse("2020-06-18 17:34:05");
			console.log("formate time：" + form);
			console.log("hum:" + hum);
			console.log("parse:" + parse);
			this.$msg.showToast(dateUtils.humanize(7000))
			console.log("has name:" + this.$app.hasKey(this.user, "name"));
			console.log("has age:" + this.$app.hasKey(this.user, "age"));
			console.log("is number: "+this.$app.isNumber(10.5));
			// uni.showModal({
			// 	title: '保存成功',
			// 	content: '下次进入页面时，此文件仍可用',
			// 	showCancel: false
			// });

		},
		methods: {
			login() {
				uni.navigateTo({
					url:'/pages/index/test?id=11&name=uniapp'
				})
				// this.$api.uniRequest({
				// 	url: '/api/v1/yhgb/app/system/user/login',
				// 	data: {
				// 		account: '15982392309',
				// 		password: '392309'
				// 	}
				// }).then(res => {
				// 	console.log("登录结果：" + JSON.stringify(res.data))
				// }).catch(error => {
				// 	console.log("page:" + JSON.stringify(error));
				// });
			},
			acceptParamMethod(param){
				console.log("accept data:"+param);
			},			

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.hello-text {
	    color: #7A7E83;
	    font-size: 14px;
	    line-height: 20px;
	}
</style>
