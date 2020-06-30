<template>
	<view>
		<title-view bgColor="bg-gradual-blue" :isBack="true"><block slot="backText">返回</block><block slot="content">布局</block></title-view>
		<view class="text-area">
			<text class="title" @tap="testPage">{{title}}</text>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class='action'>
				<text class='cuIcon-title text-blue'></text>标签形状
			</view>
		</view>
		<view class="padding bg-white solid-bottom">
			<view class='cu-tag'>默认</view>
			<view class='cu-tag round'>椭圆</view>
			<view class='cu-tag radius'>圆角</view>
		</view>
		<view class="cu-bar bg-white margin-top">
			<view class='action'>
				<text class='cuIcon-title text-blue'></text>胶囊样式
			</view>
		</view>
		<view class="padding">
			<view class="cu-capsule">
				<view class='cu-tag bg-red'>
					<text class='cuIcon-likefill'></text>
				</view>
				<view class="cu-tag line-red">
					12
				</view>
			</view>
			<view class="cu-capsule round">
				<view class='cu-tag bg-blue '>
					<text class='cuIcon-likefill'></text>
				</view>
				<view class="cu-tag line-blue">
					23
				</view>
			</view>
			<view class="cu-capsule round">
				<view class='cu-tag bg-blue '>
					说明
				</view>
				<view class="cu-tag line-blue">
					123
				</view>
			</view>
			<view class="cu-capsule radius">
				<view class='cu-tag bg-grey '>
					<text class='cuIcon-likefill'></text>
				</view>
				<view class="cu-tag line-grey">
					23
				</view>
			</view>
			<view class="cu-capsule radius">
				<view class='cu-tag bg-brown sm'>
					<text class='cuIcon-likefill'></text>
				</view>
				<view class="cu-tag line-brown sm">
					23
				</view>
			</view>
		</view>
		<view class="cu-bar margin-top bg-white">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>块状按钮
			</view>
		</view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-grey lg">玄灰</button>
			<button class="cu-btn bg-red margin-tb-sm lg">嫣红</button>
		</view>
		<view class="cu-bar margin-top bg-white">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>按钮加图标
			</view>
		</view>
		<view class="padding-xl">
			<button class="cu-btn block line-orange lg">
				<text class="cuIcon-upload"></text> 图标</button>
			<button class="cu-btn block bg-blue margin-tb-sm lg">
				<text class="cuIcon-loading2 cuIconfont-spin"></text> 加载</button>
			<button class="cu-btn block bg-black margin-tb-sm lg" loading> 原生加载</button>
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
