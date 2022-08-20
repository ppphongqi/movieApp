<template>
	<view class="b-f">
		<block v-if="itemStyle.display==='1'">
			<view class="seckillGoods-box b-f">
				<!-- 头部 -->
				<view class="seckill-logo-time  display-1 dis-flex flex-y-center flex-x-between m-btm20">
					<view class="content-title-main f-40 col-3" :style="{'color':itemStyle.maincolor}">{{itemStyle.text}}
						<view class="title-icon"></view>
					</view>
					<view class="time dis-flex" v-if="itemStyle.countdown==='1'" :style="isover.status?'border-color:#999999':'border-color:rgb(254, 80, 79)'">
						<view class="time-title f-22" :style="isover.status?'background-color:#999999;color:#FFFFFF':'background-color:rgb(254, 80, 79);color:#FFFFFF'">{{isover.title}}</view>
						<!-- <view class="f-22" v-if="skipStatus !=='end'" :style="isover.status?'color:':'color:'">{{hh}}:{{mm}}:{{ss}}</view> -->
						<block v-if="skipStatus !=='end'">
							<CountDown :leftTime="leftTime" :color="isover.status?'#999999':'#666666'" @timeEnd="cutDownEnd"></CountDown>
						</block>
					</view>
				</view>
				<!-- 商品列表-横排样式 -->
				<view class="goods-cross-1">
					<scroll-view class="goods-list dis-flex flex-y-center" scroll-x="true">
						<block v-for="(item,index) in itemDataList" :key="index">
							<view class="goods-items" @click="skip(item.goods_id,item.spike_id,itemData.end_time)">
								<view class="goods-image" :style="{'background-image':'url('+item.file+')'}"></view>
								<view class="goods-title f-28 col-3" :style="itemStyle.name==='1'?'':'visibility:hidden;'">{{item.goods_name}}</view>
								<view class="goods-price dis-flex flex-y-line">
									<view class="curren-price price-font-family" :style="itemStyle.price==='1'?'':'visibility:hidden'" v-if="itemStyle.price==='1'">{{settingData.currency}}
										<text class="f-42">{{item.price}}</text>
									</view>
									<view class="goods-count-seckill dis-flex flex-x-between flex-y-end">
										<view class="count" :style="itemStyle.progress==='1'?'':'visibility:hidden;'">
											<view class="count-num f-22 col-9">仅剩{{item.stk}}件</view>
											<!-- <view class="progress">
												<view class="progress-ing" :style="{'width':item.sales_volume+'%'}"></view>
											</view> -->
										</view>
										<!-- <view class="seckill-btn f-24" v-if="!isover.status">马上秒</view> -->
									</view>
									<!-- <view class="origi-price f-24 col-9" :style="itemStyle.oldprice==='1'?'':'visibility:hidden;'">{{settingData.currency}}{{item.old_price}}</view> -->
								</view>
								<!-- <view class="goods-count-seckill dis-flex flex-x-between flex-y-end">
									<view class="count" :style="itemStyle.progress==='1'?'':'visibility:hidden;'">
										<view class="count-num f-24 col-9">还剩{{item.stk}}件</view>
										<view class="progress">
											<view class="progress-ing" :style="{'width':item.sales_volume+'%'}"></view>
										</view>
									</view>
									<view class="seckill-btn f-24" v-if="!isover.status">马上秒</view>
								</view> -->
							</view>
						</block>
					</scroll-view>
				</view>
			</view>
		</block>
		<block v-if="itemStyle.display==='2'">
			<view class="seckillGoods-box b-f">
				<!-- 头部 -->
				<view class="seckill-logo-time display-2 dis-flex flex-y-center flex-x-between">
					<view class="f-38 col-f f-w">{{itemStyle.text}}</view>
					<view class="time dis-flex" v-if="itemStyle.countdown==='1'">
						<view class="time-title f-22" :style="isover.status?'color:#EEEEEE':'color:#FFFFFF'">{{isover.title}}</view>
						<view class="countdown" v-if="skipStatus !=='end'" :style="isover.status?'color:#EEEEEE !important;':'color:#FFFFFF !important;'">
							<CountDown :leftTime="leftTime" color="#000000" backgroundColor="#FFFFFF" splitorColor="#FFFFFF" :showColon="false"
							 @timeEnd="cutDownEnd"></CountDown>
						</view>
					</view>
				</view>
				<!-- 商品列表-竖排样式 -->
				<view class="goods-cross-2">
					<view class="goods-list">
						<view class="goods-items dis-flex p-r" v-for="(item,index) in itemDataList" :key="index" @click="skip(item.goods_id,item.spike_id,itemData.end_time,item)">
							<view class="goods-image" :style="{'background-image':'url('+item.file+')'}"></view>
							<view class="goods-content dis-flex flex-dir-column flex-x-between">
								<view class="goods-title f-28 col-3" :style="itemStyle.name==='1'?'':'visibility:hidden;'">{{item.goods_name}}</view>
								<view class="goods-count-seckill">
									<view class="progress" :style="itemStyle.progress==='1'?'':'visibility:hidden;'" v-if="itemStyle.price==='1'">
										<view class="count f-22">还剩{{item.stk}}</view>
										<view class="progress-ing" :style="{'width':item.sales_volume+'%'}"></view>
									</view>
								</view>
								<view class="price-seckill-btn dis-flex flex-x-between">
									<view class="goods-price dis-flex flex-y-line">
										<view class="curren-price price-font-family" :style="itemStyle.price==='1'?'':'visibility:hidden;'">{{settingData.currency}}
											<text class="f-42">{{item.price}}</text>
										</view>
										<view class="origi-price f-24 col-9" :style="itemStyle.oldprice==='1'?'':'visibility:hidden;'">{{settingData.currency}}{{item.old_price}}</view>
									</view>
									<view class="seckill-btn f-24" v-if="!isover.status">马上抢</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import CountDown from "@/components/template/CountDown.vue"
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				isover: {},
				leftTime: 0,
				skipStatus: ""
			};
		},
		components: {
			CountDown
		},
		computed: {
			itemDataList() {
                 console.log(this.itemData,'this.itemData-----------')
				return this.itemData.data || [];
			},
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemData: Object
		},
		beforeCreate() {

		},
		onLoad(options) {

		},

		onShow() {

		},
		mounted() {
			this.setEndTime();
		},
		methods: {
			setEndTime() {
				let {
					itemData: {
						start_time,
						end_time
					}
				} = this,
				activityStatus = App.getActivityStatus(start_time, end_time), {
						status,
						leftTime
					} = activityStatus,
					skipStatus = status === 0 ? "waiting" : status === 1 ? "conduct" : "end";
				this.isover = {
					title: status === 0 ? "距离活动开始" : status === 1 ? "距离活动结束" : "活动已结束",
					status: status !== 1
				};
				this.skipStatus = skipStatus;
				this.leftTime = leftTime;
			},
			//倒计时结束
			cutDownEnd() {
				this.setEndTime();
			},
			skip(goods_id, spike_id, end_time,item) {
				console.log(item,'item')
				
				if (this.isover['status']) {
					let start_time = this.itemData.start_time * 1000;
					let end_time = this.itemData.end_time * 1000;
					if(end_time < new Date().getTime() ) {
						App.showError('该秒杀活动已结束！' )
						return false
					}
					
				}
				App.navigationTo({
					url: `pages/subPages/goods/index/index?goods_id=${goods_id}&spike_id=${spike_id}`
				})
			},

		}
	}
</script>

<style lang="scss">
	.seckillGoods-box {
		padding: 20upx 0 30upx;
		/* padding: 26upx 36upx 18upx;
		box-shadow: 0upx 2upx 6upx 0upx rgba(128, 128, 128, 0.35);
		border-radius: 6upx; */

	}

	.seckill-logo-time {
		/* margin: 0 30upx; */
		height: 80upx;
		/* width: 132upx;
		height: 34upx; */
	}

	.seckill-logo-time.display-2 {
		background-image: url("~@/static/images/diypage/miaosha.png");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		/* background: #FE504F; */
		border-radius: 10upx 10upx 0 0;
		padding: 0 20upx;
	}

	.countdown {
		color: #FFFFFF;
		font-size: 22upx;
		height: 40rpx;
		line-height: 40rpx;
	}

	.countdown .text {
		font-size: 24upx;
		display: inline-block;
		background: #FFFFFF;
		color: #000000;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		letter-spacing: 2upx;
		border-radius: 8upx;
		margin: 0 8upx;
		padding: 0 6upx;
	}

	.seckill-logo-time .logo image {
		width: 100%;
		height: 100%;
	}

	.seckill-logo-time .time {
		border: 1px solid;
		opacity: 0.9;
		border-radius: 6upx;
		height: 40rpx;
		line-height: 40rpx;
		/* box-sizing: border-box; */
	}

	.seckill-logo-time.display-2 .time {
		border: 0;
		opacity: 1;
		border-radius: 0;
	}

	.seckill-logo-time.display-1 {
		padding: 0 30upx;
	}

	.seckill-logo-time.display-1 .time .time-title {
		padding: 0 12upx;

	}

	.seckill-logo-time.display-2 .time .time-title {
		font-size: 24upx;
	}

	.goods-list .goods-items .goods-price .curren-price text {
		padding-left: 8upx;
	}

	/* 商品横排 */
	.goods-cross-1 .goods-list {
		/* flex-wrap: wrap; */
		height: 380upx;
		white-space: nowrap;
	}

	.goods-cross-1 .goods-list .goods-items {
		width: 35%;
		padding-right: 30upx;
		display: inline-block;
		/* width: 260upx; */
		/* flex: 1; */
		/* margin-right: 40upx; */
	}

	.goods-cross-1 .goods-list .goods-items:first-child {
		padding-left: 30upx;
	}

	.goods-cross-1 .goods-list .goods-items .goods-image {
		width: 100%;
		padding-top: 100%;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		border-radius: 6upx;
	}

	.goods-cross-1 .goods-list .goods-items .goods-title {
		margin: 20upx 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 36upx;
	}

	.goods-cross-1 .goods-list .goods-items .goods-price {
		line-height: 40upx;
	}

	.goods-cross-1 .goods-list .goods-items .goods-price .curren-price {
		color: #FE504F;
		font-size: 24upx;
		margin-right: 8upx;
	}

	.goods-cross-1 .goods-list .goods-items .goods-price .origi-price {
		text-decoration: line-through;
		margin-top: 2upx;
	}

	.goods-cross-1 .goods-list .goods-items .goods-count-seckill .count .count-num {
		/* margin-bottom: 6upx; */
	}

	.goods-cross-1 .goods-list .goods-items .goods-count-seckill .count .progress {
		position: relative;
		width: 94upx;
		height: 16upx;
		background: rgba(242, 242, 242, 1);
		border-radius: 8upx;
	}

	.goods-cross-1 .goods-list .goods-items .goods-count-seckill .count .progress-ing {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1;
		/* width: 40%; */
		background-color: #FE504F;
		border-radius: 8upx;
	}

	.goods-cross-1 .goods-list .goods-items .goods-count-seckill .seckill-btn {
		width: 120upx;
		height: 44upx;
		line-height: 44upx;
		text-align: center;
		border: 1px solid rgba(254, 80, 79, 1);
		border-radius: 24upx;
		color: #FE504F;
	}

	/* 商品竖排 */
	.goods-cross-2 .goods-list .goods-items {
		padding: 30upx;
	}

	.goods-cross-2 .goods-list .goods-items .goods-image {
		width: 200upx;
		height: 200upx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		border-radius: 6upx;
		margin-right: 30upx;
	}

	.goods-cross-2 .goods-list .goods-items .goods-content {
		flex: 1;
		width: 0;
	}

	.goods-cross-2 .goods-list .goods-items .goods-title {
		height: 3em;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;

	}

	.goods-cross-2 .goods-list .goods-items .goods-count-seckill .progress {
		position: relative;
		width: 260upx;
		height: 30upx;
		background-color: #f7cfcd;
		border-radius: 15upx;
	}

	.goods-cross-2 .goods-list .goods-items .goods-count-seckill .progress .count {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		color: #FFFFFF;
		z-index: 2;
		line-height: 30upx;
	}

	.goods-cross-2 .goods-list .goods-items .goods-count-seckill .progress .progress-ing {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1;
		width: 40%;
		background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
		background-size: 60upx 60upx;
		background-color: #FE504F;
		border-radius: 15upx;
	}

	.goods-cross-2 .goods-list .goods-items .goods-price .curren-price {
		color: #FE504F;
		font-size: 24upx;
		margin-right: 8upx;
	}

	.goods-cross-2 .goods-list .goods-items .goods-price .origi-price {
		text-decoration: line-through;
		margin-top: 2upx;
	}

	.goods-cross-2 .goods-list .goods-items .price-seckill-btn .seckill-btn {
		position: relative;
		width: 120upx;
		height: 44upx;
		line-height: 44upx;
		text-align: center;
		border: 1px solid rgba(254, 80, 79, 1);
		border-radius: 24upx;
		color: #FE504F;
		bottom: 10upx;
	}

	.content-title-main {
		font-weight: 600;
	}

	.title-icon {
		display: inline-block;
		width: 0;
		height: 0;
		border: 10upx solid;
		border-color: transparent #FFD940 #FFD940 transparent;
		border-color: transparent var(--theme-color) var(--theme-color) transparent;
		margin-left: 12upx;
		vertical-align: bottom;
		position: relative;
		top: -12upx;
	}
</style>
