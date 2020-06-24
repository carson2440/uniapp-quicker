<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title" @tap="testPage">{{title}}</text>
		</view>
	</view>
</template>

<script>
	var dateUtils = require('@/common/utils.js').dateUtils;
	export default {
		data() {
			return {
				title: 'carson2440'
			}
		},
		onLoad(options) {
			console.log(options);
			// uni.showModal({
			// 	title: '保存成功',
			// 	content: '下次进入页面时，此文件仍可用',
			// 	showCancel: false
			// });

		},
		methods: {
			testPage() {
				//后面的页面往前一个页面传递参数
				this.$api.prevPage().acceptParamMethod('param cross page');
				//关闭当前页面
				uni.navigateBack();
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
</style>
