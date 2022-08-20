<template>
	<view :style="themeColor">
		<view class="success-title dis-flex flex-dir-column flex-x-center flex-y-center" v-if="type === 'success'">
			<icon type="success" size="40" color="#FFDD02" />
			<view class="success-text col-3 f-30 f-w  m-top20">点评成功!</view>
			<view class="success-tip col-9 f-24  m-top20">分享出去让更多人看到吧~</view>
		</view>
		<view class="success-detail" v-if="comment_id">
			<view class="module-content">
				<view class="comment-title dis-flex flex-y-center flex-x-between">
					<view class="comment-user dis-flex flex-y-center ">
						<image :src="user.avatarUrl" mode=""></image>
						<view class="user-info dis-flex flex-dir-column flex-x-between m-left12">
							<view class="user-name col-3 f-28">{{user.nickName}}</view>
							<view class="user-comment-time col-9 f-26">{{commentdatail.create_time}}</view>
						</view>
					</view>
					<view class="comment-star dis-flex flex-y-center">
						<view class="iconfont icon-shoucangxiao select" v-for="(item,index) in commentdatail.score" :key="index"></view>
					</view>
				</view>
				<view class="comment-text col-3 f-28">{{commentdatail.content}}</view>
				<view class="comment-image">
					<block v-for="(item,index) in commentdatail.comment_image">
						<image :src="item.file_path" mode=""></image>
					</block>
				</view>
				<view class="comment-reply col-9 f-24" v-if="replyData">商家回复:{{replyData.reply_content}}</view>
				<view class="comment-goods dis-flex flex-y-center" @click="toGoodsInfo(goods.goods_id)">
					<image :src="goods.file_path"></image>
					<view class="comment-good-detail dis-flex flex-dir-column flex-x-between flex-box">
						<view class="goods-title twolist-hidden col-3 f-26">{{goods.goods_name}}</view>
						<view class="goods-derc col-9 f-24">商品规格:{{!!goods.spec_title?goods.spec_title:'无'}}</view>
						<view class="goods-price col-3 f-26">{{settingData.currency}}{{goods.goods_price}} <text>{{settingData.currency}}{{goods.line_price}}</text></view>
					</view>
				</view>
				<block v-if="commentdatail.qr">
					<image class="app-code" :src="commentdatail.qr" @click="previewImage(commentdatail.qr)"></image>
				</block>
				<view class="app-code-tips t-c f-24 col-6">{{flowTip}}</view>
			</view>
		</view>
		<ShareView ref="shareView" :pid="comment_id" :poster-type="'evaluate'" viewStyle="2"></ShareView>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import ShareView from "@/components/template/ShareView.vue"
	import App from "@/common/js/app.js";
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	export default {
		data() {
			return {
				comment_id: null,
				commentdatail: {},
				user: {},
				goods: {},
				type: "",
				replyData: null,
				shareData: null
			};
		},
		components: {
			ShareView
		},
		computed: {
			flowTip() {
				const clientType = App.getClientType()
				switch (+clientType) {
					case 2:
						return '点击预览长按识别小程序，查看详情'
					case 4:
						return '点击预览长按识别公众号，查看详情'
					default:
						return '点击预览长按识别小程序，查看详情'
				}
			}

		},
		beforeCreate() {

		},
		onLoad(options) {
			this.pageLoad(options);
		},
		mounted() {

		},
		methods: {
			/**
			 * 页面加载处理
			 */
			pageLoad(options) {
				this.type = options.type;
				this.comment_id = Number(options.comment_id);
				this.getCommentDetail();
			},
			toGoodsInfo(goods_id) {
				App.navigationTo({
					url: "pages/subPages/goods/index/index?goods_id=" + goods_id
				});
			},
			getCommentDetail() {
				let _this = this;
				return new Promise((resolve, reject) => {
					App._get('Comment/detail', {
						comment_id: _this.comment_id
					}, (result) => {
						console.log(result);
						let data = result.data,
							comment_reply = data.comment_reply;
						data.score = data.score;
						if (comment_reply.length > 0) {
							_this.replyData = comment_reply.filter(val => val.reply_type === 1)[0];
						}
						_this.setShareData(data);
						_this.setData({
							commentdatail: data,
							user: data.user,
							goods: data.order_goods,
						})
					}, false, () => {
						App.hideLoading(800)
					})
				})
			},
			previewImage(qrUrl) {
				uni.previewImage({
					urls: [qrUrl]
				})
			},
			setShareData(detail) {
				let clientType = App.getClientType(),
					shareData = null;
				if (clientType === "4") {
					wxApi.wxShare({
						title: `${detail.user.nickName}邀请您来看看他(她)的商品评价~`, // 分享标题
						desc: detail.content, // 分享描述
						link: `${App.siteInfo.siteroot}h5/#/pages/mainPages/order/comment/success?comment_id=${detail.comment_id}&referee_id=${this.globalSaveRefereeId}&i=${App.getUniacid()}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: detail.order_goods.file_path, // 分享图标
					});
				} else {
					shareData = {
						title: `${detail.user.nickName}邀请您来看看他(她)的商品评价~`,
						imageUrl: detail.order_goods.file_path,
						path: `/pages/mainPages/order/comment/success?comment_id=${detail.comment_id}&referee_id=${this.globalSaveRefereeId}`
					};
				}
				this.shareData = shareData;
			},
		},
		onShareAppMessage(res) {
			return this.shareData;
		}
	}
</script>

<style>
	.success-title {
		padding-top: 50upx;
	}

	.success-detail {
		overflow: hidden;
		border-radius: 20upx;
		margin: 40upx 30upx;
	}

	.comment-user image {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
		display: block;
	}

	.comment-star image {
		width: 36upx;
		height: 36upx;
		margin-right: 8upx;
		display: block;
	}

	.comment-text {
		margin: 40upx 10upx;
	}

	.comment-reply {
		padding: 20upx 25upx;
		background: #F0F0F0;
		border-radius: 6upx;
		margin-bottom: 20upx;
	}

	.comment-goods {
		padding: 30upx;
		background: #FFFBEF;
		border-radius: 20upx;
		border: 1upx solid #FFD940;
	}

	.comment-goods image {
		width: 128upx;
		height: 128upx;
		margin-right: 20upx;
		display: block;
		border-radius: 6upx;
	}

	.comment-goods .goods-price {
		font-weight: bold;
	}

	.comment-goods .goods-price text {
		font-weight: normal;
		color: #999999;
		font-size: 24upx;
		text-decoration: line-through;
		padding-left: 10upx;
	}

	.success-detail .app-code {
		width: 184upx;
		height: 184upx;
		display: block;
		margin: 50upx auto 26upx;
	}

	.app-code-tips {
		padding-bottom: 40upx;
	}

	.footer-btns {
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		background: #FFFFFF;
	}

	.footer-btn {
		width: 100%;
		text-align: center;
	}

	.footer-btn::after {
		content: " ";
		position: absolute;
		top: 15%;
		right: 0;
		bottom: 15%;
		width: 0;
		border-right: 1upx solid #EEEEEE;
	}

	.footer-btns .footer-btn:last-child::after {
		content: none;
	}

	.comment-star .iconfont {
		margin-left: 8upx;
		font-size: 28upx !important;
	}

	.comment-image image {
		width: 150upx;
		height: 150upx;
		margin-right: 12upx;
		margin-bottom: 6upx;
	}

	.comment-star .iconfont.select {
		color: #FFD940
	}
</style>
