<!-- @liveList 直播数据列表 -->
<template>
	<view class="container">
		<view class="list-main padding-box">
			<!-- 样式1 -->
			<view class="live-list-one" v-if="false">
				<view class="live-list-one-main p-r" :style="{'background-image':'url('+livebg+')'}">
					<!-- 直播状态 -->
					<view class="live-status">
						<!-- 直播中 -->
						<block>
							<view class="live-style-1 dis-flex flex-y-center">
								<view class="live-style-1-content dis-flex flex-y-center">
									<image class="live-statusBg-1" src="/static/images/live/live1.png"></image>
									<view class="live-intro f-24 col-f">直播中</view>
								</view>
								<view class="watch-number">
									<text class="col-f f-24">8455观看</text>
								</view>
							</view>
						</block>
						<!-- 预告 -->
						<block v-if="false">
							<view class="live-style-2 dis-flex flex-y-center">
								<image class="live-statusBg-2" src="/static/images/live/live2.png"></image>
								<view class="live-intro f-24 col-f">预告</view>
							</view>
						</block>
						<!-- 结束 -->
						<block v-if="false">
							<view class="live-style-3 dis-flex flex-y-center">
								<image class="live-statusBg-3" src="/static/images/live/live3.png"></image>
								<view class="live-intro f-24 col-f">观看回放</view>
							</view>
						</block>
					</view>
					<view class="live-list-one-detail">
						<!-- 直播人头像昵称 -->
						<view class="live-user dis-flex flex-y-center">
							<view class="live-userAvatar" :style="{'background-image':'url('+livebg+')'}"></view>
							<view class="f-24 col-f">名扬天下</view>
						</view>
						<view class="live-title onelist-hidden f-28 col-f m-top-btm30">今晚很嗨烤鱼正儿八经的...</view>
						<view class="live-goods dis-flex flex-y-center">
							<view class="goodsItem p-r" v-for="(item,index) in 3" :style="{'background-image':'url('+livebg+')'}">
								<view class="goodsItem-price col-f f-24">¥12.0</view>
							</view>
						</view>
					</view>
					<view class="live-play" :style="{'background-image':'url('+imageRoot+'live_play.png)'}"></view>
				</view>
			</view>
			<!-- 样式2 -->
			<view class="live-list-two dis-flex flex-warp flex-x-between">
				<view class="live-left">
					<view class="live-list-Item m-btm20" v-for="(item,index) in newLivelist" :key="index" v-if="index%2==0">
						<view class="live-bg p-r" :style="{'background-image':'url('+item.cover_img+')'}" @click="navgateLive(item.roomid,item.live_status)">
							<!-- 直播状态 -->
							<view class="live-status">
								<!-- 直播中 -->
								<block v-if="item.live_status===101">
									<view class="live-style-1 dis-flex flex-y-center">
										<view class="live-style-1-content dis-flex flex-y-center">
											<image class="live-statusBg-1" src="/static/images/live/live1.png"></image>
											<view class="live-intro f-24 col-f">直播中</view>
										</view>
										<!-- <view class="watch-number">
										<text class="col-f f-24">8455观看</text>
									</view> -->
									</view>
								</block>
								<!-- 预告 -->
								<block v-if="item.live_status===102">
									<view class="live-style-2 dis-flex flex-y-center">
										<image class="live-statusBg-2" src="/static/images/live/live2.png"></image>
										<view class="live-intro f-24 col-f">预告</view>
									</view>
								</block>
								<!-- 结束 -->
								<block v-if="item.live_status===103">
									<view class="live-style-3 dis-flex flex-y-center">
										<image class="live-statusBg-3" src="/static/images/live/live3.png"></image>
										<view class="live-intro f-24 col-f">观看回放</view>
									</view>
								</block>
							</view>
							<!-- 直播人头像昵称 -->
							<!-- <view class="live-user dis-flex flex-y-center">
								<view class="live-userAvatar" :style="{'background-image':'url('+item.anchor_img+')'}"></view>
								<view class="f-24 col-f">{{item.anchor_name}}</view>
							</view> -->
						</view>
						<view class="live-content b-f">
							<view class="live-title onelist-hidden f-28 col-3">{{item.name}}</view>
							<view class="live-goodsDetail dis-flex flex-x-between flex-y-center m-top20" v-if="!!item.goods && !!item.goods.length>0"
							 @click="navgateGoods(item.goods[0]['url'])">
								<view class="goodsContent">
									<view class="goods-title onelist-hidden col-9 f-24">{{item.goods[0]['name']}}</view>
									<view class="goods-price col-3 f-24">¥{{item.goods[0]['price']}}</view>
								</view>
								<view class="goodsImage" :style="{'background-image':'url('+item.goods[0]['cover_img']+')'}"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="live-right">
					<view class="live-list-Item m-btm20" v-for="(item,index) in newLivelist" :key="index" v-if="index%2==1">
						<view class="live-bg p-r" :style="{'background-image':'url('+item.cover_img+')'}" @click="navgateLive(item.roomid,item.live_status)">
							<!-- 直播状态 -->
							<view class="live-status">
								<!-- 直播中 -->
								<block v-if="item.live_status===101">
									<view class="live-style-1 dis-flex flex-y-center">
										<view class="live-style-1-content dis-flex flex-y-center">
											<image class="live-statusBg-1" src="/static/images/live/live1.png"></image>
											<view class="live-intro f-24 col-f">直播中</view>
										</view>
										<!-- <view class="watch-number">
										<text class="col-f f-24">8455观看</text>
									</view> -->
									</view>
								</block>
								<!-- 预告 -->
								<block v-if="item.live_status===102">
									<view class="live-style-2 dis-flex flex-y-center">
										<image class="live-statusBg-2" src="/static/images/live/live2.png"></image>
										<view class="live-intro f-24 col-f">预告</view>
									</view>
								</block>
								<!-- 结束 -->
								<block v-if="item.live_status===103">
									<view class="live-style-3 dis-flex flex-y-center">
										<image class="live-statusBg-3" src="/static/images/live/live3.png"></image>
										<view class="live-intro f-24 col-f">观看回放</view>
									</view>
								</block>
							</view>
							<!-- 直播人头像昵称 -->
							<!-- <view class="live-user dis-flex flex-y-center">
								<view class="live-userAvatar" :style="{'background-image':'url('+item.anchor_img+')'}"></view>
								<view class="f-24 col-f">{{item.anchor_name}}</view>
							</view> -->
						</view>
						<view class="live-content b-f">
							<view class="live-title onelist-hidden f-28 col-3">{{item.name}}</view>
							<view class="live-goodsDetail dis-flex flex-x-between flex-y-center m-top20" v-if="!!item.goods && !!item.goods.length>0"
							 @click="navgateGoods(item.goods[0]['url'])">
								<view class="goodsContent">
									<view class="goods-title onelist-hidden col-9 f-24">{{item.goods[0]['name']}}</view>
									<view class="goods-price col-3 f-24">¥{{item.goods[0]['price']}}</view>
								</view>
								<view class="goodsImage" :style="{'background-image':'url('+item.goods[0]['cover_img']+')'}"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				
			}
		},
		props: {
			liveList: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		components: {

		},
		computed: {
			newLivelist() {
				return this.liveList
			}
		},
		methods: {
			navgateLive(room_id,live_status) {
				if(live_status === 103){
					App.navigationTo({
						// url: `pages/subPages/live/liveBack?id=${room_id}`
						url: `pages/subPages/livePlayer/livePlayer?id=${room_id}`
					})
				}else{
					App.navigationTo({
						url: `pages/subPages/livePlayer/livePlayer?id=${room_id}`
					})
				}
				
			},
			navgateGoods(url) {
				App.navigationTo({
					url
				})
			}
		},
		onLoad() {

		}
	}
</script>

<style lang="scss" scoped>
	.live-list-one {
		padding: 20upx 0;

		.live-list-one-main {
			width: 100%;
			height: 690upx;
			background-size: 100% 690upx;
			background-repeat: no-repeat;
			border-radius: 10upx;
		}

		.live-play {
			width: 70upx;
			height: 70upx;
			background-size: 70upx 70upx;
			background-repeat: no-repeat;
			position: absolute;
			left: 50%;
			top: 40%;
			transform: translate(-50%);
		}

		.live-list-one-detail {
			position: absolute;
			left: 20upx;
			bottom: 30upx;

			.live-userAvatar {
				width: 30upx;
				height: 30upx;
				background-repeat: no-repeat;
				background-size: 30upx 30upx;
				border: 1px solid rgba(249, 249, 249, 1);
				border-radius: 50%;
				margin-right: 8upx;
			}

			.live-title {
				width: 500upx;
			}

			.live-goods {
				.goodsItem {
					width: 120upx;
					height: 120upx;
					border-radius: 8upx;
					margin-right: 24upx;
					background-size: 120upx 120upx;
					background-repeat: no-repeat;

					.goodsItem-price {
						position: absolute;
						left: 10upx;
						bottom: 10upx;
					}
				}
			}
		}
	}

	.live-list-two {
		.live-list-Item {
			.live-bg {
				width: 334upx;
				height: 334upx;
				border-radius: 10upx 10upx 0 0;
				background-repeat: no-repeat;
				background-size: cover;
				background-position: center;
			}

			.live-content {
				padding: 20upx;
				border-radius: 0 0 10rpx 10rpx;
				
				.live-title {
					width: 294upx;
				}
			}

			.live-goodsDetail {
				.goodsContent {
					.goods-title {
						width: 200upx;
					}
				}

				.goodsImage {
					width: 64upx;
					height: 64upx;
					border-radius: 8upx;
					background-repeat: no-repeat;
					background-size: 64upx 64upx;
				}
			}

			.live-user {
				position: absolute;
				left: 20upx;
				bottom: 20upx;

				.live-userAvatar {
					width: 30upx;
					height: 30upx;
					background-repeat: no-repeat;
					background-size: 30upx 30upx;
					border: 1px solid rgba(249, 249, 249, 1);
					border-radius: 50%;
					margin-right: 8upx;
				}
			}
		}
	}

	.live-status {
		position: absolute;
		left: 20upx;
		top: 20upx;
	}

	.live-intro {
		transform: scale(.9);
	}

	.live-style-1 {
		.live-style-1-content {
			width: 114upx;
			height: 22upx;
			line-height: 22upx;
			background: linear-gradient(90deg, rgba(255, 68, 68, 1), rgba(253, 113, 55, 1));
			border-radius: 6upx 0 0 6upx;
			padding: 6upx;

			.live-statusBg-1 {
				width: 30upx;
				height: 30upx;
				display: block;
				margin-right: 6upx;
			}
		}

		.watch-number {
			height: 22upx;
			line-height: 22upx;
			background-color: rgba(0, 0, 0, .2);
			border-radius: 6upx;
			padding: 6upx;

			>text {
				transform: scale(.9);
				display: block;
			}
		}
	}

	.live-style-2 {
		height: 22upx;
		line-height: 22upx;
		background: linear-gradient(90deg, rgba(67, 221, 107, 1), rgba(30, 217, 79, 1));
		border-radius: 6upx;
		padding: 6upx;

		.live-statusBg-2 {
			width: 30upx;
			height: 30upx;
			display: block;
			margin-right: 6upx;
		}
	}

	.live-style-3 {
		height: 22upx;
		line-height: 22upx;
		background: linear-gradient(90deg, rgba(139, 139, 139, 1), rgba(214, 214, 214, 1));
		border-radius: 6upx;
		padding: 6upx;

		.live-statusBg-3 {
			width: 30upx;
			height: 30upx;
			display: block;
			margin-right: 6upx;
		}
	}
</style>
