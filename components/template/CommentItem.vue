<!-- 
	商品评论 by 杨智源
	list 评论列表
	comment_detail 评论详情
	other 其他评论
 -->
<template>
	<view>
		<view class="comment-box module-content">
			<view class="comment-title dis-flex flex-y-center flex-x-between">
				<view class="comment-user dis-flex flex-y-center flex-box">
					<image :src="comment_detail.avatarUrl" mode=""></image>
					<view class="user-info dis-flex flex-dir-column flex-x-between m-left12 flex-box">
						<view class="user-name col-3 f-28 onelist-hidden">{{comment_detail.nickName}}</view>
						<view class="user-comment-time col-9 f-24">{{comment_detail.create_time}}</view>
					</view>
				</view>
				<view class="comment-star dis-flex flex-y-center">
					<view class="iconfont icon-shoucangxiao select" v-for="(items,index) in comment_detail.score" :key="index"></view>
				</view>
			</view>
			<view class="comment-text col-3 f-28">{{comment_detail.content}}</view>
			<view class="comment-reply col-9 f-24" v-for="(replyItem,idx) in comment_detail.comment_reply" :key="idx" v-if="type === 'list'?!!comment_detail.comment_reply:!!comment_detail.reply_content">商家回复:{{type==="list"?replyItem.reply_content:comment_detail.comment_reply}}</view>
			<view class="comment-imgs dis-flex flex-dir-row m-top10" v-if="!!comment_detail.comment_image">
				<view class="comment-img" v-for="(coment_image,idx) in comment_detail.comment_image" :key="idx" :style="'background-image:url('+coment_image.file_path+')'"
				 @click.stop="pre_image(coment_image.file_path)"></view>
			</view>
			<view class="comment-goods dis-flex flex-y-center" v-if="type !== 'other' && !!comment_detail.order_goods">
				<view class="comment-goods_image" :style="{'background-image':'url('+goods_images+')'}"></view>
				<view class="comment-good-detail dis-flex flex-dir-column flex-x-between flex-box">
					<view class="goods-title twolist-hidden col-3 f-26">{{type==='list'||type==='detail'?comment_detail.order_goods.goods_name:comment_detail.recommend_goods.goods_name}}</view>
					<view class="goods-derc col-9 f-24">{{type==='list'||type==='detail'?'无':comment_detail.recommend_goods.sku.title}}</view>
					<view class="dis-flex flex-dir-row flex-x-between">
						<view class="goods-price col-m f-32 price-font-family">{{settingData.currency}}{{type==='list'||type==='detail'?comment_detail.order_goods.goods_price:comment_detail.recommend_goods.sku.goods_price}}<text
							 v-if="type!=='list'&&type!=='detail'">{{settingData.currency}}{{comment_detail.recommend_goods.sku.line_price}}</text></view>
						<view class="goods-buy-btn t-c f-24" @click.stop="spgoodsdl(comment_detail.order_goods.goods_id)">立即购买</view>
					</view>
				</view>
			</view>
			<view class="dis-flex flex-x-end comment-handle m-top20" v-if="type === 'list'">
				<view class="iconfont icon-appreciatefill" :class="isgivelike?'already':''" @click.stop="singe_givelike">{{isgivenum}}</view>
				<view class="iconfont icon-forwardfill btn-share" v-if="type === 'list' && !!comment_detail.order_goods" @click.stop="hold(comment_detail)">分享
					<button open-type="share" :data-shopname="comment_detail.order_goods.goods_name"
					 :data-shopid="comment_detail.order_goods.goods_id" :data-shopimgUrl="(comment_detail.order_goods.file?comment_detail.order_goods.file.file_path:'')"></button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from '@/common/js/app.js';
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	export default {
		data() {
			return {
				comimage: []
			};
		},
		props: {
			type: String,
			comment_detail: {
				type: Object,
				default: null
			}
		},
		components: {

		},
		computed: {
			isgivelike() {
				return this.comment_detail.isgl = this.comment_detail.is_fabulous === 1 ? true : false
			},
			isgivenum() {
				return this.comment_detail.total_comment = this.comment_detail.total_comment
			},
			goods_images() {
				let comment_detail = this.comment_detail,
					type = this.type;
				return type === 'list' || type === 'detail' ? (comment_detail.order_goods && comment_detail.order_goods.file ?
					comment_detail.order_goods.file.file_path : '') : comment_detail.recommend_goods.image.file_path
			}
		},
		watch: {

		},
		beforeCreate() {

		},
		onLoad(options) {

		},

		onShow() {

		},
		mounted() {
			this.imagesPrev();
			// #ifdef MP
			uni.hideShareMenu();
			// #endif
		},
		methods: {
			spgoodsdl(goods_id, user_id) {
				App.navigationTo({
					url: `pages/subPages/goods/index/index?goods_id=${goods_id}&user_id=${user_id}`
				})
			},
			pre_image(file_path) {
				uni.previewImage({
					current: file_path,
					indicator: 'default',
					urls: this.comimage
				})
			},
			imagesPrev() {
				let that = this,
					comment_detail = that.comment_detail,
					comimage = [];
				if (!!comment_detail.comment_image) {
					comment_detail.comment_image.map((val) => {
						comimage.push(val.file_path)
						return comimage
					});
				}
				this.comimage = comimage;
			},
			singe_givelike() {
				this.$emit("singegivelike");
			},
			// 阻止跳转
			hold(detail) {
				let currentPage = App.getCurrentPage();
				if (currentPage.$refs.shareView) {
					currentPage.shareImg = true;
				}
				let clientType = App.getClientType(),
					options = {
						comment_id: detail.comment_id,
						comment_type: "goodsingle",
						i: App.getUniacid(),
						referee_id: this.globalSaveRefereeId
					};
					console.log(detail, options,this.appClientType);
				if (this.appClientType === "4") {
					jWeixin.ready(() => {
						wxApi.wxShare({
							title: `${detail.nickName}邀请您来看看他(她)的商品评价~`, // 分享标题
							desc: detail.content, // 分享描述
							link: `${App.siteInfo.siteroot}h5/#/pages/subPages/comment/detail?${App.urlEncode(options)}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: detail.order_goods.file ? detail.order_goods.file.file_path : "",
						});
					});
				}
			}
		},
		/**
		 * 分享商品
		 */
		onShareAppMessage(res) {
			let shop_id = res.target.dataset.shopid,
				shopimgUrl = res.target.dataset.shopimgurl,
				shopName = res.target.dataset.shopname;
			if (res.from === 'button') { // 来自页面内分享按钮
				this.shopShare = true;
			};
			return {
				title: `正在分享商品:${shopName}给您！快点开看看吧~`,
				path: `/pages/subPages/goods/index/index?goods_id=${shop_id}&referee_id=${this.globalSaveRefereeId}`,
				imageUrl: shopimgUrl
			};
		},
	}
</script>

<style lang="scss">
	.comment-box {
		border-radius: 20upx;
		margin: 0 10upx;
	}

	.comment-user image {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
		display: block;
	}

	.comment-star .iconfont {
		width: 36upx;
		height: 36upx;
		line-height: 36upx;
		font-size: 28upx;
		margin-right: 8upx;
		display: block;
		color: #CCCCCC;
	}

	.comment-star .iconfont.select {
		color: #FFD940;
		color: var(--theme-color);
	}

	.comment-text {
		margin: 36upx 10upx;
	}

	.comment-reply {
		padding: 20upx 25upx;
		background: #F0F0F0;
		border-radius: 6upx;
	}

	.comment-imgs {
		flex-wrap: wrap;
		margin: 40upx 0 20upx;
	}

	.comment-img {
		width: 30%;
		padding-top: 30%;
		border-radius: 6upx;
		background-size: cover;
		margin: 0 1.5% 3%;
		background-repeat: no-repeat;
		background-position: center;

	}

	.comment-goods {
		padding: 30upx 20upx;
		background: #FFFFFF;
		border-radius: 20upx;
		box-shadow: 0 0 1em #efeff5;
	}

	.comment-goods_image {
		width: 140upx;
		height: 140upx;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		margin-right: 20upx;
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
		margin-left: 6upx;
	}

	.comment-goods .goods-buy-btn {
		border: 1px solid #FE504F;
		color: #FE504F;
		width: 164upx;
		height: 50upx;
		line-height: 50upx;
		border-radius: 25px;
	}

	.comment-handle .iconfont {
		font-size: 26upx;
		margin-left: 20upx;
		color: #999999;
	}

	.comment-handle .iconfont.already {
		color: #FE504F;
	}

	.comment-handle .iconfont::before {
		font-size: 36upx;
		margin-right: 10upx;
	}

	.btn-share {
		position: relative;
	}

	.btn-share button {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		opacity: 0;
	}
</style>
