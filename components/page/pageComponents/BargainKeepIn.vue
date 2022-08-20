<template>
	<view v-if="filterItemData.length > 0" class="keep-in dis-flex flex-dir-column flex-x-center flex-y-center">
		<view class="bargin-goods padding-box">
			<block v-for="(item,index) in filterItemData" :key="item.id">
				<view class="goods-list dis-flex flex-dir-row flex-x-between flex-y-center border-line" @click="toBargainInfo(item.id, item.goods_id, item.spec_sku_id)">
					<view class="img-logo">
						<image class="goods-img" :src="item.image && item.image[0] ? item.image[0]['file_path'] : ''" mode=""></image>
					</view>
					<view class="goods-info" style="width: 0;flex-grow: 1;">
						<view class="title twolist-hidden">
							{{item.goods_name}}
						</view>
						<view class="desc dis-flex flex-dir-column">
							<view class="progress">
								<view class="current-num" :style="{'width': `${item.progress > 95 ? 95 : item.progress}%`}">
									<view class="current-dot pos-col-center">
										<image class="pos-center" src="/static/images/bargain/knife.png" style="position: absolute;width: 20upx;margin-left: 3upx;height: 20upx;zoom: .8;"
										 mode="widthFix"></image>
									</view>
								</view>
							</view>
							<view class="dis-flex flex-dir-row flex-y-line f-24" style="margin: 20upx 0 -10upx;color:#9E9B9D;">
								已砍<text class="now f-24 price-font-family">{{settingData.currency}}<text class="f-w">{{item.is_bargain_price}}</text></text>
								还差<text class="now f-24 price-font-family">{{settingData.currency}}<text class="f-w">{{item.surplus_price}}</text></text>
							</view>
							<view class="price dis-flex flex-dir-row flex-x-between">
								<view class="old dis-flex flex-y-center">
									<CountDown :leftTime="item.overFormat" color="#333333" :isPadding="true"></CountDown>后结束
								</view>
								<!-- <text class="">{{item.overFormat}}</text> -->
								<view class="go-bargin help-bg-color">继续砍价</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import CountDown from "@/components/template/CountDown.vue"
	import App from "@/common/js/app.js"
	export default {
		props: {
			itemData: Array
		},
		data() {
			return {
				filterItemData: [],
				progress: 100,
				leftTime: 0
			};
		},
		components: {
			CountDown
		},
		watch: {
			'itemData': {
				handler(newData, oldData) {
					if (Array.isArray(newData) && newData.length > 0) {
						this.filterItemData.map(item => {
							clearInterval(item.timer);
						})

						this.filterItemData = [];
						this.itemData.map(item => {
							if (item.is_use == 1) {
								this.filterItemData.push(this.setOverTimer(item));
							}
						})
						this.$forceUpdate();
					}
				},
				immediate: true,
				deep: false
			}
		},
		computed: {

		},
		onLoad(e) {

		},
		onShow() {

		},
		mounted() {

		},
		methods: {
			toBargainInfo(group_id, goods_id, spec_sku_id) {
				App.navigationTo({
					url: 'pages/subPages/bargain/index/index?' + App.urlEncode({
						group_id: group_id,
						goods_id: goods_id,
						goods_sku_id: spec_sku_id
					}),
				})
			},
			setOverTimer(item) {
				let activityStatus = App.getActivityStatus(0, item.end_time);
				item.overFormat = activityStatus.leftTime;
				return item;
			}
		}
	}
</script>

<style lang="scss">
	.keep-in {
		// padding: 0 8upx;
		// margin: 30upx; 
		background: #FFFFFF;
		// background:linear-gradient(90deg,rgba(254,133,79,1) 0%,rgba(254,80,79,1) 100%);
		// border-radius:14upx;
		&:not(:nth-last-child(1)) {
			.line-gap {
				display: inline-block;
				width: calc(100% - 60upx);
				margin: 0 30upx;
				height: 1px;
				background: rgba(238, 238, 238, 1);
			}
		}

		.hd-title {
			color: #FFFFFF;
			font-weight: bold;
			font-style: italic;
			font-size: 30upx;
			padding: 26upx 0;

			.tip {
				width: 130upx;
				height: 4upx;

				&.fl {
					margin-right: 20upx;
					background: linear-gradient(-90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
				}

				&.fr {
					margin-left: 20upx;
					background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
				}
			}
		}
	}

	.padding-box {
		padding: 0 30upx;
		margin-left: 30upx;
		margin-right: 30upx;
		border-radius: 6upx;
		background: #FFFFFF;
		// margin-bottom: 8upx;
	}

	.bargin-goods {
		position: relative;
		width: 100%;
		z-index: 1;
		.goods-list{
			padding: 30upx 0;
			&:not(:first-child){
				border-top: 1px solid #eeeeee;
			}
		}
		.progress {
			width: 100%;
			height: 10upx;
			background: #EEEEEE;
			border-radius: 14upx;

			.current-num {
				position: relative;
				height: 100%;
				border-radius: 14upx;
				background: linear-gradient(90deg, rgba(254, 80, 79, 1) 0%, rgba(254, 133, 79, 1) 100%);

				.current-dot {
					left: 100%;
					width: 30upx;
					height: 30upx;
					background: rgba(254, 82, 79, 1);
					border-radius: 50%;
				}
			}
		}
	}

	.bargin-goods .goods-list .img-logo {
		position: relative;
		font-size: 0;
	}

	.bargin-goods .goods-list .img-logo .goods-img {
		width: 200upx;
		height: 200upx;
		border-radius: 6upx;
		margin-right: 28upx;
	}

	// .bargin-goods .goods-list .img-logo .bargin-num{
	// 	position: absolute;
	// 	top: 0;
	// 	left: 0;
	// 	font-size: 24upx;
	// 	line-height: 38upx;
	// 	color: #FFFFFF;
	// 	width:76upx;
	// 	height:38upx;
	// 	background:linear-gradient(90deg,rgba(254,80,79,1),rgba(254,133,79,1));
	// 	/* box-shadow:0 2upx 10upx 0 rgba(254,80,79,0.54); */
	// 	border-radius:6upx 0 6upx 0;
	// 	z-index: 2;
	// 	text-align: center;
	// }
	.bargin-goods .goods-info .title {
		color: #000000;
		font-size: 28upx;
		height: 80upx;
		font-weight: 400;
		line-height: 40upx;
		margin-bottom: 20rpx;
	}

	.bargin-goods .goods-info .now {
		color: #FE504F;
	}

	.bargin-goods .goods-info .old {
		font-size: 24upx;
		color: #333333;
		align-self: flex-end;
	}


	.bargin-goods .goods-info .num {
		font-size: 24upx;
		color: #999999;
		width: 126upx;
		text-align: center;
		white-space: nowrap;
	}

	.bargin-goods .goods-info .go-bargin {
		width: 126upx;
		height: 50upx;
		text-align: center;
		line-height: 50upx;
		background: #FC5030;
		// box-shadow:0 2upx 10upx 0 rgba(254,80,79,0.54);
		border-radius: 25upx;
		color: rgba(255, 255, 255, 1);
		font-size: 24upx;
	}
</style>
