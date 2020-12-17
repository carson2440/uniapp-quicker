<template>
	<view class="htz-image-upload-list">
		<view class="htz-image-upload-Item" :style="[wrapStyle]" v-for="(item, index) in imagePath" :key="index">
			<image :src="item" :mode="imgMode" @tap.stop="imgPreview(index)" :style="[imgStyle]"></image>
			<view class="htz-image-upload-Item-del" v-if="showDelete" @tap.stop="imgDel(index)">×</view>
		</view>
		<view class="htz-image-upload-Item htz-image-upload-Item-add" :style="[wrapStyle]" v-if="imagePath.length < max"
		 @tap.stop="imgAdd">+</view>
		<view style="position: absolute;top: -999999px;">
			<view v-for="(item, index) in max" :key="index">
				<!-- canvas 的宽度和image.js图片压缩后的宽度保持一致-->
				<canvas style="width: 600px;height: 1000px;" :canvas-id="'myCanvas' + index"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import image from './image.js';
	export default {
		name: 'quick-image',
		props: {
			bgColor: {
				// 图片的背景颜色
				type: String,
				default: 'transparent'
			},
			imgMode: {
				// 图片的裁剪模型
				type: String,
				default: 'aspectFill'
			},
			// 头像模型，square-带圆角方形，circle-圆形
			mode: {
				type: String,
				default: 'square'
			},
			size: {
				// 宽度等于高度 单位是rpx
				type: [String, Number],
				default: '96'
			},
			max: {
				//展示图片最大值
				type: Number,
				default: 10
			},
			showDelete: {
				//是否展示删除按钮
				type: Boolean,
				default: true
			},
			waterMark: {
				//是否添加水印
				type: Boolean,
				default: true
			},
			sourceType: {
				//选择照片来源 【ps：H5就别费劲了，设置了也没用。不是我说的，官方文档就这样！！！】
				type: Array,
				default: () => ['album', 'camera']
			},
			compress: {
				//是否需要压缩
				type: Boolean,
				default: true
			},
			action: {
				//上传地址
				type: String,
				default: ''
			},
			headers: {
				//上传的请求头部
				type: Object,
				default: () => {}
			},
			formData: {
				//HTTP 请求中其他额外的 form data
				type: Object,
				default: () => {}
			},
			quality: {
				//压缩质量，范围0～100
				type: Number,
				default: 80
			},
			value: {
				//受控图片列表
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				imagePath: [],
				waterDeltaY: 0
			};
		},
		mounted: function() {
			this.$nextTick(function() {
				this.imagePath = this.value;
			});
		},
		computed: {
			wrapStyle() {
				let style = {};
				style.height = this.size + 'rpx';
				style.width = style.height;
				// style.lineHeight = style.height;
				style.flex = `0 0 ${style.height}`;
				style.backgroundColor = this.bgColor;
				style.borderRadius = this.mode == 'circle' ? '500px' : '5px';
				// console.log(JSON.stringify(style));
				return style;
			},
			imgStyle() {
				let style = {};
				style.borderRadius = this.mode == 'circle' ? '500px' : '5px';
				return style;
			}
		},
		watch: {
			value(val, oldVal) {
				this.imagePath = val;
			}
		},
		methods: {

			imgPreview(index) {
				uni.previewImage({
					urls: this.imagePath,
					current: index,
					loop: false
				});
			},
			imgDel(index) {
				uni.showModal({
					title: '提示',
					content: '您确定要删除么?',
					success: (res) => {
						if (res.confirm) {
							this.imagePath.splice(index, 1)
							this.$emit("imgDelete", this.imagePath);
						} else if (res.cancel) {}
					}
				});
			},
			imgAdd() {
				// 打开选择sheet
				let options = [];
				let tempSourceType = [];
				if (this.sourceType.indexOf('camera') > -1) {
					options.push('拍照');
					tempSourceType.push('camera');
				}
				if (this.sourceType.indexOf('album') > -1) {
					options.push('从手机相册选择');
					tempSourceType.push('album');
				}
				// 打开选择sheet
				let that = this;
				uni.showActionSheet({
					itemList: options,
					success: function(res) {
						that.callSystemChooseImage(tempSourceType[res.tapIndex]);
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			callSystemChooseImage(sourceType) {
				let that = this;
				if (this.imagePath.length == this.max) {
					this.imagePath = [];
				}
				let avaliable = this.imagePath.length < this.max ? this.max - this.imagePath.length : 0;
				uni.chooseImage({
					count: avaliable,
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [sourceType],
					success: res => {
						if (res.tempFilePaths.length > avaliable) {
							uni.showToast({
								title: '图片超过' + avaliable + '张',
								duration: 2000
							});
						} else {
							//#ifdef APP-PLUS
							that.compressImageApp(res);
							if (sourceType == 'camera') {
								that.saveImageToPhotosAlbum(res);
							}
							//#endif

							//#ifdef H5
							that.compressImageH5(res);
							//#endif
						}
					}
				});
			},
			compressImageApp(res) {
				let item = [];
				var compressd = cp_images => {
					item = item.concat(cp_images); //压缩后的图片路径
					if (this.waterMark) {
						this.addWaterMarkAction(item);
					} else {
						this.imagePath = item;
						that.$emit('selectResult', that.imagePath);
					}
				};
				image.compress(res.tempFilePaths, compressd);
			},
			getTextLine(ctx, text, width) {
				const arrTr = [];
				if (text) {
					let line = '';
					ctx.setFontSize(20);
					for (let i = 0; i < text.length; i++) {
						const testLine = line + text[i];
						if (i < 8) {
							line = testLine;
						} else {
							const metrics = ctx.measureText(testLine);
							const textWidth = metrics.width;
							if (textWidth > width && i > 0) {
								arrTr.push(line);
								line = text[i];
							} else {
								line = testLine;
							}
						}
						if (i == text.length - 1) {
							arrTr.push(line);
						}
					}
				}
				return arrTr;
			},
			drawText(ctx, key, line) {
				if (line.length > 0) {
					//多行处理
					// let line = this.getTextLine(ctx, text, 180);
					this.waterDeltaY += 28;
					ctx.fillText(key + line[0], 20, this.waterDeltaY);
					if (line.length > 1) {
						this.waterDeltaY += 28;
						let str = line[1];
						if (line.length > 2) {
							str = str.substring(0, str.length - 1);
							str += '...';
						}
						ctx.fillText(str, 120, this.waterDeltaY);
					}
				}
			},
			getTime() {
				let date = new Date();
				let Y = date.getFullYear();
				let m = date.getMonth() + 1;
				let d = date.getDate();
				let H = date.getHours();
				let i = date.getMinutes();
				let s = date.getSeconds();
				if (m < 10) {
					m = '0' + m;
				}
				if (d < 10) {
					d = '0' + d;
				}
				if (H < 10) {
					H = '0' + H;
				}
				if (i < 10) {
					i = '0' + i;
				}
				if (s < 10) {
					s = '0' + s;
				}
				// var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
				var t = Y + '.' + m + '.' + d + ' ' + H + ':' + i;
				return t;
			},
			addWaterMarkAction(results) {
				let that = this;
				let callback = [];
				uni.showLoading({
					title: '加载中...'
				});
				// console.log("开始预处理");
				let bgHeight = 38; //因为一定有时间
				let lineHeight = 28;
				let maxLine = 2;
				let ctx = uni.createCanvasContext('myCanvas0');
				let linePro = this.getTextLine(ctx, that.formData.project, 180);
				bgHeight += (linePro.length > 1 ? maxLine : linePro.length) * lineHeight;
				let lineCompany = this.getTextLine(ctx, that.formData.devCompany, 180);
				bgHeight += (lineCompany.length > 1 ? maxLine : lineCompany.length) * lineHeight;
				let lineType = this.getTextLine(ctx, that.formData.type, 180);
				bgHeight += (lineType.length > 1 ? maxLine : lineType.length) * lineHeight;
				let lineAddress = this.getTextLine(ctx, that.formData.address, 180);
				bgHeight += (lineAddress.length > 1 ? maxLine : lineAddress.length) * lineHeight;
				let lineAuthor = this.getTextLine(ctx, that.formData.author, 180);
				bgHeight += (lineAuthor.length > 1 ? maxLine : lineAuthor.length) * lineHeight;
				let lineTime = [];
				lineTime.push(that.formData.time ? that.formData.time : that.getTime());
				for (let i = 0; i < results.length; i++) {
					let canvasid = 'myCanvas' + i;
					uni.getImageInfo({
						src: results[i],
						success: res => {
							let ctx = uni.createCanvasContext(canvasid);
							ctx.drawImage(results[i], 0, 0, res.width, res.height);
							ctx.setGlobalAlpha(0.3);
							ctx.setFillStyle('#f4f5f6');
							ctx.translate(10, 10);
							ctx.fillRect(10, 10, 300, bgHeight);
							ctx.setFontSize(20); //字体大小
							ctx.setFillStyle('#DC143C'); //字体颜色
							ctx.setGlobalAlpha(1);
							that.waterDeltaY = 6;
							that.drawText(ctx, '项目名称：', linePro);
							ctx.setFillStyle('#000000'); //字体颜色
							that.drawText(ctx, '施工单位：', lineCompany);
							that.drawText(ctx, '问题类型：', lineType);
							that.drawText(ctx, '问题位置：', lineAddress);
							that.drawText(ctx, '发现作者：', lineAuthor);
							that.drawText(ctx, '发现时间：', lineTime);
							ctx.draw(false, () => {
								uni.canvasToTempFilePath({
									canvasId: canvasid,
									width: res.width, // 画布宽
									height: res.height, // 画布高
									destWidth: res.width,
									destHeight: res.height,
									success: res2 => {
										uni.hideLoading();
										that.imagePath.push(res2.tempFilePath);
										that.$emit('selectResult', that.imagePath);
									},
									fail: function(errs) { //需要hbuilderx2.9.8+
										console.log('生成图片出错:', JSON.stringify(errs))
										uni.hideLoading()

									},
								});
							});
						}
					});
				}
			},
			compressImageH5(res) {
				uni.showLoading({
					title: '加载中...'
				});
				let that = this;
				this.imgCompressCompact(res.tempFilePaths)
					.then(results => {
						// if (that.waterMark) {
						// 	that.addWaterMarkAction(results);
						// } else {
						that.imagePath.push(results);
						that.$emit('selectResult', that.imagePath);
						// }
						uni.hideLoading();
					})
					.catch((res, object) => {
						uni.hideLoading();
					});
			},
			//async函数的返回值总是一个Promise
			imgCompressCompact(tempFilePaths) {
				let results = [];
				let that = this;
				tempFilePaths.forEach((item, index) => {
					results.push(
						new Promise((resolve, reject) => {
							// #ifndef H5
							uni.compressImage({
								src: item,
								quality: this.quality,
								success: res => {
									console.log('压缩后：' + res.tempFilePath);
									resolve(res.tempFilePath);
								},
								fail: err => {
									//console.log(err.errMsg);
									reject(err);
								},
								complete: () => {
									//uni.hideLoading();
								}
							});
							// #endif
							// #ifdef H5
							this.canvasDataURL(
								item, {
									quality: this.quality / 100
								},
								base64Codes => {
									resolve(base64Codes);
								}
							);
							// #endif
						})
					);
				});
				return Promise.all(results); //执行所有需请求的接口
			},
			getImageInfo(path) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: path,
						success: res => {
							resolve(res);
						}
					});
				});
			},
			saveImageToPhotosAlbum(data) {
				//#ifdef APP-PLUS
				if (data.tempFilePaths) {
					let tempFilePaths = data.tempFilePaths.join(',');
					uni.saveImageToPhotosAlbum({
						filePath: tempFilePaths, //String
						success: function(succ) {
							console.log('图片保存成功' + JSON.stringify(succ));
						},
						fail(err) {
							console.log('图片保存失败' + JSON.stringify(err));
						}
					});
				}
				//#endif
			},
			imgUpload(tempFilePaths) {
				// if (this.action == '') {
				// 	uni.showToast({
				// 		title: '未配置上传地址',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// 	return false;
				// }
				uni.showLoading({
					title: '上传中'
				});
				//console.log('imgUpload',tempFilePaths)
				let uploadImgs = [];
				tempFilePaths.forEach((item, index) => {
					uploadImgs.push(
						new Promise((resolve, reject) => {
							const uploadTask = uni.uploadFile({
								url: this.action, //仅为示例，非真实的接口地址
								filePath: item,

								fileType: 'image',
								formData: this.formData,
								header: this.headers,
								success: uploadFileRes => {
									//uni.hideLoading();
									resolve(uploadFileRes);
									this.$emit('uploadSuccess', uploadFileRes);
								},
								fail: err => {
									console.log(err);
									//uni.hideLoading();
									reject(err);
									this.$emit('uploadFail', err);
								},
								complete: () => {
									//uni.hideLoading();
								}
							});
						})
					);
				});
				Promise.all(uploadImgs) //执行所有需请求的接口
					.then(results => {
						uni.hideLoading();
					})
					.catch((res, object) => {
						uni.hideLoading();
						this.$emit('uploadFail', res);
					});
				// uploadTask.onProgressUpdate((res) => {
				// 	//console.log('',)
				// 	uni.showLoading({
				// 		title: '上传中' + res.progress + '%'
				// 	});
				// 	if (res.progress == 100) {
				// 		uni.hideLoading();
				// 	}
				// });
			},
			canvasDataURL(path, obj, callback) {
				var img = new Image();
				img.src = path;
				img.onload = function() {
					var that = this;
					// 默认按比例压缩
					var w = that.width,
						h = that.height,
						scale = w / h;
					w = obj.width || w;
					h = obj.height || w / scale;
					var quality = 0.8; // 默认图片质量为0.8
					//生成canvas
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					// 创建属性节点
					var anw = document.createAttribute('width');
					anw.nodeValue = w;
					var anh = document.createAttribute('height');
					anh.nodeValue = h;
					canvas.setAttributeNode(anw);
					canvas.setAttributeNode(anh);
					ctx.drawImage(that, 0, 0, w, h);
					// 图像质量
					if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
						quality = obj.quality;
					}
					// quality值越小，所绘制出的图像越模糊
					var base64 = canvas.toDataURL('image/jpeg', quality);
					// 回调函数返回base64的值
					callback(base64);
				};
			}
		}
	};
</script>

<style lang="scss" scoped>
	.htz-image-upload-list {
		display: flex;
		flex-wrap: wrap;
		margin: 13rpx;
	}

	.htz-image-upload-Item {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		line-height: 100rpx;
		position: relative;
		margin: 8rpx;
	}

	.htz-image-upload-Item image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.htz-image-upload-Item-add {
		font-size: 66rpx;
		text-align: center;
		border: 1px dashed #d9d9d9;
		color: #d9d9d9;
		vertical-align: middle;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.htz-image-upload-Item-del {
		background-color: #f5222d;
		font-size: 24rpx;
		position: absolute;
		width: 35rpx;
		height: 35rpx;
		line-height: 35rpx;
		text-align: center;
		top: 0;
		right: 0;
		color: #fff;
	}
</style>
