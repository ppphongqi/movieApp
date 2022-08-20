<template>
	<view v-if="isOpen">
		<view class="pop-mask" @click.stop="close"></view>
		<view class="pop-container" :class="'advert-type-'+showType">
			<view class="img-box">
				<image class="image" :src="showType === '1'?(params.thumb.file_path||params.thumb):(params.pattern === '2'?(params.thumb.file_path||params.thumb):getImageRoot(showType === '2'?'53.png':'52.png'))"
				 mode="widthFix" @click="imageClick(params.link)"></image>
				<view class="advert-content" v-if="showType !== '1'">
					<view class="advert-cutdown" v-if="overtime" :class="[showType === '3'?'dis-flex flex-y-center flex-x-center':'']">
						<view class="cutdown-title col-f t-c">{{showType === "2"?"距活动结束":"开奖倒计时"}}</view>
						<CountDown :leftTime="overtime" :showColon="false" color="#DA5E28" splitorColor="#FFFFFF" backgroundColor="#FAE373"
						 @timeEnd="close"></CountDown>
					</view>
					<view class="advert-goods dis-flex flex-y-center" v-if="goodsData">
						<view class="goods-image-box p-r">
							<image :src="goodsData.image" class="goods-image"></image>
						</view>
						<view class="goods-info flex-box dis-flex flex-x-around flex-dir-column">
							<view class="goods-title f-26 col-3 twolist-hidden">{{goodsData.title}}</view>
							<view class="goods-price dis-flex flex-x-between flex-y-line">
								<block v-if="showType === '2'">
									<view class="prices dis-flex flex-x-between flex-y-line">
										<view class="new-price price-font-family f-30 f-w col-m">{{settingData.currency}}{{goodsData.goods_price}}</view>
										<view class="oldw-price price-font-family f-26 col-9 m-left12">{{settingData.currency}}{{goodsData.line_price}}</view>
									</view>
									<view class="f-24 col-9">{{goodsData.viewed || 0}}人喜欢</view>
								</block>
								<block v-if="showType === '3'">
									<view class="f-26 col-9">{{goodsData.num}}份</view>
									<view class="f-26 col-m">价值:{{goodsData.goods_price}}元</view>
								</block>
							</view>
						</view>
					</view>
					<view class="advert-btn" @click="advertLink(goodsData.id,goodsData.perids_id)"></view>
					<!-- <view class="advert-user dis-flex flex-x-center flex-y-center" v-if="showType === '3' && params.join_user === '1'">
						<view class="f-26 col-f m-right30">已有{{goodsData.count}}人参与</view>
						<view class="users">
							<image :src="item.avatarUrl" class="user-item p-r" :style="{'z-index':0+index}" v-for="(item,index) in goodsData.user"
							 :key="index"></image>
							<view class="user-item  p-r iconfont icon-more t-c f-w" v-if="goodsData.user.length === 4"></view>
						</view>
					</view> -->
				</view>
				<view class="iconfont icon-roundclose" :class="'pos-'+params.position" v-if="params.close === '1'" @click.stop="close"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import CountDown from "@/components/template/CountDown.vue"
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {}
		},
		props: {
			itemIndex: Number,
			itemData: Object,
			params: Object,
		},
		components: {
			CountDown
		},
		computed: {
			overtime() {
				if (this.params && this.params.overtime && this.params.pattern === "2" && this.showType !== "1") {
					let nowTime = Math.round(new Date().getTime() / 1000);
					return Number(this.params.overtime) - nowTime;
				} else {
					return false
				}
			},
			isOpen() {
				console.log(this.$store.state.openAdvert,'params++++++++++++++++++++++++++')
				if (this.$store.state.openAdvert && this.params) {
					let {
						type, //广告类型 1图片 2商品 3抽奖
						pattern, //弹窗样式 1默认 2自定义
						overtime, //倒计时结束时间
						status, //显示类型 1仅首次 2每次 3多次
						rate, //每日显示次数
					} = this.params;
				}
				return this.$store.state.openAdvert && this.$store.state.openAdvertIndex == this.itemIndex;
			},
			showType() {
				return this.params && this.params.type
			},
			goodsData() {
			
				if (this.params && this.itemData) {
					let goodsType = this.showType,
						itemData = this.itemData,
						data = {};
					if (goodsType === "2") {
						data = {
							id: itemData.goods_id,
							title: itemData.goods_name,
							image: itemData.file_path,
							goods_price: this.$util.removePoint(itemData.goods_price),
							line_price: this.$util.removePoint(itemData.line_price),
							viewed: itemData.viewed,
						}

					} else if (goodsType === "3") {
						console.log(this.itemData,'itemData23223322	================')
						data = {
							id: itemData.luck_id,
							perids_id:itemData.period_id,
							title: itemData.luck_title,
							image: itemData.image && itemData.image.length > 0 ? itemData.image[0].file_path : "",
							goods_price: this.$util.removePoint(itemData.luck_price),
							num: itemData.luck_count,
							count: itemData.user && itemData.user.count ? itemData.user.count : 0,
							user: itemData.user && itemData.user.user ? itemData.user.user.filter((val, index) => index < 4) : [],
						}
					}
					console.log(data,'data=============')
					return data;
				}
			}
		},
		mounted() {
		},
		methods: {
			isShowAdvert() {
				this.advertHandle(this.params.open == "1");
			},
			close() {
				this.$store.commit("setOpenAdvertIndex",this.$store.state.openAdvertIndex + 1);
			},
			imageClick(link) {
				this.navigationTo(link);
				this.close()
			},
			/**
			 * 弹窗广告设置
			 */
			advertHandle(params) {
				
				this.$store.commit("showAdvert", params);
			},
			advertLink(id,period_id) {
				
				if (!id) return;
				let url = this.showType === "2" ? "pages/subPages/goods/index/index?goods_id=" :
					"pages/subPages/drawlotter/index/index?luck_id=";
				
				if(this.showType=='3'){
					App.navigationTo({
						url: url + id+'&period_id='+period_id
					})
				}else if(this.showType=='2'){
					App.navigationTo({
						url: url + id
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pop-container {
		// position: fixed;
		// top: 0;
		// left: 0;
		// right: 0;
		// bottom: 0;
		// z-index: 50;
	}

	.pop-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 49;
	}

	.pop-container .img-box {
		position: fixed;
		top: 50%;
		left: 13vw;
		width: 74vw;
		transform: translateY(-50%);
		border-radius: 8upx;
		z-index: 51;
	}

	.pop-container .img-box .image {
		display: block;
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.pop-container .icon-roundclose {
		position: absolute;
		z-index: 51;
		font-family: "iconfont" !important;
		font-size: 52rpx;
		font-style: normal;
		color: #FFFFFF;
		width: 1em;
		height: 1em;
		line-height: 1em;

	}

	.pop-container .icon-roundclose.pos-1 {
		top: -1.5em;
		right: -1em;
	}

	.pop-container .icon-roundclose.pos-2 {
		left: 50%;
		bottom: -1.5em;
		transform: translateX(-50%);
	}

	.advert-content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
	}

	.goods-info {
		height: 100%;
	}

	.goods-title {
		height: 2.4em;
		line-height: 1.2em;
	}

	.img-box {
		top: 42%;
		left: 9vw;
		width: 82vw;
	}

	.goods-price {
		white-space: nowrap;
	}

	.advert-type-2 {

		.advert-cutdown {
			position: absolute;
			top: 15%;
			left: 50%;
			transform: translateX(-50%);
		}

		.cutdown-title {
			margin-bottom: 8%;
			font-size: 32rpx;
		}

		.advert-goods {
			position: absolute;
			top: 40.5%;
			margin: 0 4%;
			width: 92%;
			height: 26.5%;
			padding: 20rpx;
			box-sizing: border-box;
		}

		.goods-image-box {
			position: relative;
			background: #2F9DE2;
			height: 100%;
			width: 0;
			padding-left: 25%;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}

		.goods-image-box .goods-image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.advert-btn {
			position: absolute;
			top: 77%;
			left: 5%;
			right: 5%;
			height: 15%;
			z-index: 8;
		}
	}

	.advert-type-3 {

		.advert-cutdown {
			position: absolute;
			top: 31%;
			left: 50%;
			transform: translateX(-50%);
			width: 100%;
		}

		.cutdown-title {
			font-size: 26rpx;
		}

		.advert-goods {
			position: absolute;
			top: 40.5%;
			margin: 0 10.5%;
			width: 79%;
			height: 21.5%;
			padding: 20rpx;
			box-sizing: border-box;
		}

		.goods-image-box {
			position: relative;
			background: #2F9DE2;
			height: 100%;
			width: 0;
			padding-left: 25%;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}

		.goods-image-box .goods-image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}


		.advert-user {
			position: absolute;
			bottom: 4%;
			width: 100%;
		}

		.users {
			height: 60rpx;
			line-height: 60rpx;
			margin-left: 16rpx;
			margin-top: -4rpx;
		}

		.user-item {
			width: 60rpx;
			height: 60rpx;
			display: inline-block;
			margin-left: -28rpx;
			border-radius: 50%;
			border: 1rpx solid #FFFFFF;
			vertical-align: middle;
			box-sizing: border-box;
		}

		.user-item.icon-more {
			background: #EEEEEE;
			z-index: 10;
		}

		.advert-btn {
			position: absolute;
			top: 69%;
			left: 15%;
			right: 15%;
			height: 12%;
			z-index: 8;
		}
	}
</style>
