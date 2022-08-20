<template>
	<view class="container p-bottom" v-if="goodsList.length && formData.length" :style="themeColor">
		<view class="goods-list">
			<view class="goods-item" v-for="(item, key) in goodsList" :key="key">

				<!-- 商品详情 -->
				<view class="goods-detail dis-flex flex-dir-row">
					<view class="left">
						<image class="goods-image" :src="item.image.file_path"></image>
					</view>
					<view class="right dis-flex flex-box flex-dir-column flex-x-around">
						<view class="twolist-hidden">{{ item.goods_name }}</view>
						<view class="order-info" @click="orderInfo">订单详情</view>
						<view class="goods-price col-3 f-28">{{settingData.currency}}{{ item.goods_price }} <text>{{settingData.currency}}{{item.line_price}}</text></view>
					</view>
				</view>

				<view class="comment-detail">
					<!-- 选择评价 -->
					<view class="score-row dis-flex flex-x-center flex-y-center">
						<view class="set-score f-32 col-9">评分</view>
						<view class="score-list">
							<view class="comment-star dis-flex flex-y-center">
								<view class="iconfont icon-shoucangxiao" :class="item?'select':''" v-for="(item,index) in scoreList" :key="index"
								 @click="scoreClick(index)" data-index="score"></view>
							</view>
						</view>
					</view>

					<view class="comment-contnet">
						<!-- 评价内容 -->
						<view class="dis-flex content-row">
							<textarea @input="contentInput" :data-index="key" maxlength="200" placeholder="请输入评价内容"
							 placeholderStyle="color:#ccc"></textarea>
							<view class="content-num">{{contentlength}}/200</view>
						</view>

						<!-- 图片列表 -->
						<view class="image-list dis-flex flex-y-center">
							<view class="image-preview" v-for="(item2, key2) in formData[key].image_list" :key="key2">
								<text class="image-delete iconfont icon-shanchu" @click="deleteImage" :data-index="key" :data-image-index="key2"></text>
								<image mode="aspectFill" :src="item2"></image>
							</view>
							<view @click="chooseImage" class="image-picker dis-flex flex-dir-column flex-x-center flex-y-center" :data-index="key"
							 v-if="!formData[key].image_list || formData[key].image_list.length < 9">
								<text class="choose__icon iconfont icon-paizhao"></text>
								<text class="choose__text">{{formData[key].image_list.length}}/9</text>
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>

		<view class="flow-fixed-footer">
			<view class="flow-btn f-32 main-bg-color auxiliary-color">
				<view @click="submit" class="">确认提交</view>
			</view>
		</view>

	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				// 页面参数
				options: null,
				scorenum: null,
				// 待评价商品列表
				goodsList: [],
				imagarray: null,
				// 表单数据
				formData: [],
				localIds: [],
				contentlength: 0,
				// 判断是否重复提交
				submitDisable: false,

				//评价星级列表
				scoreList: [false, false, false, false, false]
			};
		},
		components: {

		},
		computed: {

		},
		onLoad(options) {
			// 记录页面参数
			this.options = options;

			// 获取待评价商品列表
			this.getGoodsList();
		},
		onShow() {

		},
		mounted() {

		},
		methods: {
			/**
			 * 获取待评价商品列表
			 */
			getGoodsList: function() {
				let _this = this;
				App._get('user.comment/order', {
					order_id: this.options.order_id
				}, function(result) {
					let goodsList = result.data.goodsList;
					_this.setData({
						goodsList,
						formData: _this.initFormData(goodsList)
					});
				});
			},

			/**
			 * 初始化form数据
			 */
			initFormData: function(goodsList) {
				let data = [];
				goodsList.forEach(function(item) {
					data.push({
						goods_id: item.goods_id,
						order_goods_id: item.order_goods_id,
						scorenum: 0,
						content: '',
						image_list: [

						],
						uploaded: []
					});
				});
				return data;
			},

			/**
			 * 设置评分
			 */
			// 			setScore: function(e) {
			// 				let dataset = e.currentTarget.dataset;
			// 				this.$set(this.formData[dataset.index], "score", dataset.score);
			// 			},

			/**
			 * 输入评价内容
			 */
			contentInput: function(e) {
				let index = e.currentTarget.dataset.index;
				this.contentlength = e.detail.value.length;
				this.$set(this.formData[index], "content", e.detail.value);
			},

			/**
			 * 选择图片
			 */
			chooseImage: function(e) {
				let _this = this,
					index = e.currentTarget.dataset.index,
					imageList = _this.formData[index].image_list,
					localIds = _this.localIds;
				// 选择图片
				App.chooseImage({
					count: 9 - imageList.length,
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						console.log(res);
						_this.$set(_this.formData[index], "image_list", imageList.concat(res.tempFilePaths));
						if (_this.appClientType === "4") {
							_this.$set(_this, "localIds", localIds.concat(res.localIds));
						}
					}
				});
			},

			/**
			 * 删除图片
			 */
			deleteImage: function(e) {
				let dataset = e.currentTarget.dataset,
					image_list = this.formData[dataset.index].image_list;
				image_list.splice(dataset.imageIndex, 1);
			},

			/**
			 * 评论提交,
			 */
			commentSubmit(formData, imgsarray) {
				let _this = this;
				App._post_form('Comment/createComment', {
					score: formData.scorenum,
					content: formData.content,
					order_id: Number(_this.options.order_id),
					img_list: imgsarray
				}, (res) => {
					console.log(res, '评价成功')
					if (res.code === 1) {
						let url = 'pages/mainPages/order/comment/success';
						App.showSuccess('评价成功', () => {
							let params = {
								type: "success",
								comment_id: res.data,
							}
							// #ifdef H5
							params.i = App.getUniacid();
							// #endif
							uni.redirectTo({
								url: `/pages/mainPages/order/comment/success?${App.urlEncode(params)}`
							})
						})
					}
				}, false, () => {
					uni.hideLoading();
					_this.submitDisable = false;
				})
			},
			submit() {
				let _this = this,
					formData = _this.formData[0];
				if (formData.scorenum === 0) {
					App.showError('请选评价等级');
					return false;
				}
				if (!formData.content) {
					App.showError('请填写评论内容');
					return false;
				}
				// 判断是否重复提交
				if (_this.submitDisable === true) {
					return false;
				}

				// if (_this.appClientType === "4" && _this.localIds.length > 0) {
				// 	formData.image_list = _this.localIds;
				// }

				uni.showLoading({
					title: '正在提交...',
					mask: true
				});
				// 表单提交按钮设为禁用 (防止重复提交)
				_this.submitDisable = true;
				if (formData.image_list.length > 0) {
					let imgsarray = [],
						upLoadArray = _this.appClientType === "4" ? _this.localIds : formData.image_list;
					App._upLoadAll(upLoadArray).then(options => {
						console.log(options);
						let imgsid = options.map(val => val.file_id);
						imgsarray.push(imgsid);
						_this.commentSubmit(formData, imgsarray);
					})
				} else {
					_this.commentSubmit(formData, '');
				}
			},

			/**
			 * 修改评分
			 */
			scoreClick(scoreIndex) {
				let scoreList = this.scoreList.map((val, index) => {
					val = index <= scoreIndex;
					return val;
				})
				for (let scoreListIdx in scoreList) {
					console.log(scoreList[scoreListIdx]);
					if (scoreList[scoreListIdx]) {
						this.$set(this.formData[0], "scorenum", Number(scoreListIdx) + 1);
					}
				}
				this.$set(this, "scoreList", scoreList);
			},

			/**
			 * 跳转订单信息
			 */
			orderInfo() {
				App.navigationTo({
					url: "pages/mainPages/order/detail?order_id=" + this.options.order_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-list {
		font-size: 28upx;
	}

	.goods-item {
		margin: 20upx 30upx;
	}

	.goods-item .goods-detail {
		padding: 30upx;
		background: #FFFFFF;
		border-radius: 20upx;
		position: relative;
	}

	.goods-item .goods-detail .order-info {
		font-size: 24upx;
		padding: 10upx 18upx;
		border-radius: 28upx;
		border: 1upx solid #6B696C;
		position: absolute;
		right: 30upx;
		bottom: 44upx;
	}

	.goods-item .goods-detail .left .goods-image {
		display: block;
		width: 150upx;
		height: 150upx;
		border-radius: 6upx;
	}

	.goods-item .goods-price text {
		font-size: 24upx;
		text-decoration: line-through;
		color: #999999;
		margin-left: 12upx;
	}

	.goods-item .goods-detail .right {
		padding-left: 20upx;
	}

	.goods-item .comment-detail {
		margin-top: 20upx;
		padding: 30upx;
		border-radius: 20upx;
		background: #FFFFFF;
	}

	.goods-item .score-row {
		margin-bottom: 30upx;
	}

	.goods-item .score-row .score-item.score__praise {
		color: #ff4544;
	}

	.goods-item .score-row .score-item.score__praise .score__icon {
		background: #ff4544;
	}

	.goods-item .score-row .score-item.score__review {
		color: #fcb500;
	}

	.goods-item .score-row .score-item.score__review .score__icon {
		background: #fcb500;
	}

	.goods-item .score-row .score-item.score__negative {
		color: #9b9b9b;
	}

	.goods-item .score-row .score-item.score__negative .score__icon {
		background: #9b9b9b;
	}

	.goods-item .score-row .score-item .score {
		padding: 10upx 20upx 10upx 10upx;
		border-radius: 30upx;
	}

	.goods-item .score-row .score-item .score .score__icon {
		margin-right: 10upx;
		padding: 10upx;
		border-radius: 50%;
		font-size: 30upx;
		color: #fff;
	}

	.goods-item .score-row .score-item.__active .score {
		color: #fff;
	}

	.goods-item .score-row .score-item.__active.score__praise .score {
		background: #ff4544;
	}

	.goods-item .score-row .score-item.__active.score__review .score {
		background: #fcb500;
	}

	.goods-item .score-row .score-item.__active.score__negative .score {
		background: #9b9b9b;
	}

	.goods-item .comment-contnet {
		padding: 20upx 30upx;
		margin-top: 20upx;
		background: #FDFBFE;
	}

	.goods-item .content-row {
		position: relative;
	}

	.goods-item .content-row .content-num {
		position: absolute;
		right: 0;
		bottom: 0;
		color: #CCCCCC;
		font-size: 28upx;
	}

	.goods-item .content-row textarea {
		width: 100%;
		height: 220upx;
		padding: 12upx;
		border-radius: 6upx;
		box-sizing: border-box;
	}

	.goods-item .image-list {
		flex-wrap: wrap;
	}

	.goods-item .image-list:after {
		clear: both;
		content: " ";
		display: table;
	}

	.goods-item .image-list image {
		display: block;
		width: 150upx;
		height: 150upx;
		border-radius: 6upx;
	}

	.goods-item .image-list .image-picker {
		width: 150upx;
		height: 150upx;
		border: 1upx dashed #ccc;
		color: #ccc;
	}

	.goods-item .image-list .image-picker .choose__icon {
		font-size: 56upx;
		margin-bottom: 6upx;
	}

	.goods-item .image-list .image-picker .choose__text {
		font-size: 22upx;
	}

	.goods-item .image-list .image-picker,
	.goods-item .image-list .image-preview {
		margin-right: 30upx;
		margin-top: 30upx;
	}

	/* 	.goods-item .image-list .image-picker:nth-child(4n+0),
	.goods-item .image-list .image-preview:nth-child(4n+0) {
		margin-right: 0;
	} */

	.goods-item .image-list .image-preview {
		position: relative;
	}

	.goods-item .image-list .image-preview .image-delete {
		position: absolute;
		top: -15upx;
		right: -15upx;
		height: 42upx;
		width: 42upx;
		line-height: 42upx;
		background: rgba(0, 0, 0, 0.64);
		border-radius: 50%;
		color: #fff;
		font-weight: bolder;
		font-size: 22upx;
		z-index: 10;
		text-align: center;
	}

	.flow-fixed-footer {
		border: 0;
		padding: 0 30upx 30upx;
		box-sizing: border-box;
		background-color: transparent;
	}

	.flow-fixed-footer .flow-btn {
		background: #FFD940;
		border-radius: 50upx;
	}

	.score-list {
		margin-left: 20upx;
	}

	.score-list image {
		width: 50upx;
		height: 50upx;
		display: block;
		margin-left: 10upx;
	}

	.comment-star .iconfont {
		width: 36upx;
		height: 36upx;
		line-height: 36upx;
		font-size: 36upx;
		margin-right: 8upx;
		display: block;
		color: #CCCCCC;
	}

	.comment-star .iconfont.select {
		color: #FFD940;
		color: var(--theme-color);
	}

	.set-score {
		margin-top: 2upx;
	}
</style>
