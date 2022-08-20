<template>
	<view :style="themeColor">
		<DiyVideo :params="params" :itemStyle="style"></DiyVideo>
		<view class="live-title">
			<view class="live-title-left">
				<view class="onelist-hidden">
					<view class="back-btn">
						<view class="back-zfx"></view>直播回顾
					</view>
					 <text class="live-title-left-text ">{{name}}</text>
				</view>
				<view class="live-title-left-date">直播时间: {{start_time}}场</view>
			</view>
			<view class="live-title-right">
				<view class="fx p-r">
					<button type="primary" open-type="share"></button>
				</view>
			</view>
		</view>
		<view class="live-back">
			<text style="display: block;" class="title">直播回顾</text>
			<scroll-view class="scroll-view_H" scroll-x="true">
				<view class="scroll-img">
					<view v-for="(item,index) in back_list">
						<view class="img-right">
							<view class="back-bg" :style="{'background-image':'url('+item.videocover+')'}" @click="playLive(item.videolink,item.videocover)"></view>
							<text class="back-date">直播时间：{{item.create_time}} 场</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="back-goods" v-if="!!goods && goods.length>0">
			<text style="display: block;" class="title">商品列表</text>
			<view v-for="(item,index) in goods">
				<view>
					<view class="goods-lists" @click="navgateGoods(item.url)">
						<view class="left">
							<image class="goods-img" :src="item.cover_img"></image>
						</view>
						<view class="right">
							<view class="goods-name onelist-hidden">{{item.name}}</view>
							<view class="goods-price">￥ {{item.price}}</view>
						</view>
					</view>
					<view class="border"></view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import App from "@/common/js/app.js";
	import DiyVideo from "@/components/page/pageComponents/Video.vue";
	import RecommendGoods from "@/components/template/RecommendGoods.vue";
	
	export default {
		data() {
			return {
				back_list: [],
				name: '',
				start_time: '',
				style: {
					display: 1,
				},
				params: {},
				goods: {},
				room_id: ""
			}
		},
		components: {
			DiyVideo,
			RecommendGoods
		},
		onLoad(options) {
			this.getBackLists(options.id);
			this.room_id = options.id;
		},
		methods: {
			playLive(url, videocover) {
				let newParms = {
					videolink: url,
					videocover: videocover,
					videotype: '2'
				};
				this.params = newParms;
				console.log('this.params',this.params)
				this.$forceUpdate()
			},
			/**
			 * 返回按钮
			 */
			returnBtn(e) {
				uni.navigateBack({
					delta: 1
				})
			},
			getBackLists(room_id) {
				let _this = this;
				App._post_form('live.Live/playback', {
					room_id
				}, res => {
					_this.params = {
							videolink: res.data.back_list[0]['videolink'],
							videotype: '2',
							videocover: res.data.back_list[0]['videocover'],
						},
						_this.setData(res.data);
					console.log(this);
				})
			},
			
			navgateGoods(url) {
				App.navigationTo({
					url
				})
			}
		},
		onPullDownRefresh(){
			this.getBackLists(this.room_id);
			 setTimeout(function () {
			            uni.stopPullDownRefresh();  //停止下拉刷新动画
			        }, 1000);
		},
		onShareAppMessage(result) {
			return {
				title: this.name,
				imageUrl: this.cover_img,
				path: `/pages/subPages/live/liveBack?id=${this.room_id}&referee_id=${this.globalSaveRefereeId}`
			}
		}
	}
</script>

<style lang="scss">
	.goods-lists {
		width: 100%;
		height: 170rpx;
		margin: 10rpx 0 10rpx 0;

		.left {
			float: left;
			width: 150rpx;
			height: 150rpx;
			margin-left: 30rpx;
			border-radius: 10rpx;

			.goods-img {
				width: 100%;
				height: 100%;
			}
		}

		.right {
			float: left;
			height: 150rpx;
			font-family: PingFang SC;
			font-weight: bold;
			margin-left: 50rpx;
			font-size: 28rpx;

			.goods-name {
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				height: 100rpx;
			}

			.goods-price {
				height: 50rpx;
				font-family: DINPro;
				font-weight: 300;
				color: rgba(51, 51, 51, 1);
			}
		}


	}

	.border {
		height: 2rpx;
		width: 90%;
		margin: 0 auto;
		background-color: #EEEEEE;
	}

	.back-btn {
		background: linear-gradient(90deg, rgba(139, 139, 139, 1) 0%, rgba(214, 214, 214, 1) 100%);
		border-radius: 6px;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		font-size: 20rpx;
		display: inline-block;
		width: 130rpx;
		height: 40rpx;
		line-height: 40rpx;

		.back-zfx {
			margin: 0rpx 5rpx 2rpx 8rpx;
			display: inline-block;
			width: 15rpx;
			height: 15rpx;
			background-color: #FFFFFF;
			vertical-align: middle;
		}
	}

	.title {
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		margin: 30rpx 0rpx 30rpx 30rpx;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
		height: 320rpx;
	}

	.scroll-img {
		display: flex;
		width: 320rpx;
	}

	.live-back {
		font-family: PingFang SC;
		height: 360rpx;
		border-bottom: 1px #EEEEEE solid;

		.img-right {
			width: 320rpx;
			box-sizing: border-box;
			float: left;
			margin-left: 30rpx;
			border-radius: 4px;

			.back-bg {
				height: 200rpx;
				width: 300rpx;
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}

			.back-date {
				font-size: 24rpx;
				color: #333333;
			}
		}

	}

	.live-title {
		font-family: PingFang SC;
		width: 100%;
		height: 120rpx;
		border-bottom: 1px #EEEEEE solid;

		.live-title-left {
			float: left;
			width: 80%;
			height: 100%;
			margin-left: 30rpx;

			.live-title-left-text {
				color: #000000;
				font-weight: bold;
				font-size: 34rpx;
				line-height: 80rpx;
				margin-left: 25rpx;
			}

			.live-title-left-date {
				color: #999999;
				font-size: 24rpx;
			}
		}

		.live-title-right {
			float: right;
			width: 15%;
			height: 120rpx;

			.fx {
				margin: 60rpx auto;
				margin-top: 30rpx;
				width: 45rpx;
				height: 45rpx;
				background-image: url("~@/static/images/fx.png");
				background-repeat: no-repeat;
				background-size: 100% 100%;
				/* background: #FE504F; */
				border-radius: 10upx 10upx 0 0;

				>button {
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					opacity: 0;
					width: 100%;
					height: 100%;
				}
			}
		}
	}


	.diy-navigator {
		position: fixed;
		left: 0;
		right: 0;
		padding: 0 20rpx;
		height: 88rpx;
		z-index: 100;

		.return-btn {
			position: absolute;
			left: 20rpx;
			top: 50%;
			transform: translateY(-50%);
			width: 60rpx;
			height: 60rpx;
			line-height: 60rpx;
			border: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 50%;
			text-align: center;
			background-color: rgba(255, 255, 255, 0.6);
			z-index: 50;

			.icon-fanhuijiantou {
				position: relative;
				left: 14%;
				color: #000000;
				font-weight: bold;
			}
		}
	}

	.goods-video {
		width: 100%;
	}
</style>
