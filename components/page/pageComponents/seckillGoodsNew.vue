<template>
	<view v-if="itemData && itemData.data.length>0" class="b-f" style="padding: 30rpx;background: #f5f5f5;">
		<!-- 限时抢购 itemStyle.display==='1'-->
		<block v-if="params.activitytype==='1'">
			<view class="seckillGoods-box b-f">
				<view class="seckill-logo-time  display-1 dis-flex flex-y-center flex-x-between">
					<view class="content-title-main f-40 col-3 ai" :style="{'color':itemStyle.maincolor}">
						<view class="content-title-icon">
							<i class="iconfont icon-countdown"></i>
						</view>
						{{itemStyle.text}}
					</view>
					<view class="time dis-flex" v-if="itemStyle.countdown==='1'">
						<view class="time-title f-22" style="color:#999999;">{{isover.title}}</view>
						
						<block>
							<CountDown :statusNew="isover.statusNew" :leftTime="leftTime" @timeEnd="cutDownEnd"></CountDown>
						</block>
					</view>
				</view>
				<!-- 秒杀商品卡片 -->
				<GoodsCardSeckill 
				:item-style="itemStyle" 
				:item-data="itemData" 
				:item-params="params"  
				:activity-status="isover.statusNew"  />
			</view>
		</block>
		
		<!-- 整点秒杀 -->
		<block v-else-if="params.activitytype==='2'">
			<!-- 秒杀商品卡片 -->
			<view class="seckillGoods-box b-f seckill-int">
				<view class="seckill-logo-time  display-1 dis-flex flex-y-center flex-x-between">
					<view class="content-title-main f-40 col-3 ai" :style="{'color':itemStyle.maincolor}">
						<view class="content-title-icon">
							<i class="iconfont icon-naozhong"></i>
						</view>
						{{itemStyle.text}}
					</view>
					<view class="time dis-flex f-24">
						<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO -->
						<button open-type="share" class="share-submit time-title col-9 ai" id="seckill">
							邀请好友一起抢
							<image class="time-title-share" src="/static/images/fx.png"></image>
							<!-- <i class="iconfont icon-share" style="font-size:26rpx;padding-left:2rpx;"></i> -->
						</button>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view @click="showSeckillShareBtn" class="time-title col-9 ai">
							邀请好友一起抢
							<image class="time-title-share" src="/static/images/fx.png"></image>
							<!-- <i class="iconfont icon-share" style="font-size:26rpx;padding-left:2rpx;"></i> -->
							</view>
						<!-- #endif -->
					</view>
				</view>
				
				<view class="uni-swiper-tab">
					<scroll-view style="width:650rpx" scroll-x :scroll-into-view="intoindex" scroll-with-animation="true">
						<block v-for="(item,index) in tabBars" :key="index">
							<view 
							:id='"seckillItem-"+index' 
							class="swiper-tab-list f-24 col-9" 
							:class="{'active': tabIndex==index}" 
							@tap="toggleTab(index)">
								<view class="price-font-family">{{ spikeTime(item.spike_time) }}</view>
								<view>{{ spikeStatus(index,item) }}</view>
							</view>
						</block>
					</scroll-view>
				</view>
				<view class="uni-tab-bar">
					<GoodsCardSeckill
					:item-style="itemStyle" 
					:item-data="tabBars[tabIndex].spikeList" 
					:item-datas="tabBars[tabIndex]" 
					:item-params="params"
					:activity-status="tabBars[tabIndex].activityStatus" />
				</view>
			</view>
		</block>
		
		
		<!-- #ifdef H5 -->
		<view class="to-share" v-show="shareImg" @click="shareImg=false">
			<image src="/static/h5/share.png" class="to-share-img" mode="widthFix"></image>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	// 倒计时时分秒
	import CountDown from "@/components/template/CountDownSeckill.vue"
	import GoodsCardSeckill from "@/components/page/pageComponents/GoodsCardSeckill.vue"
	import App from "@/common/js/app.js";
	import utils from '@/common/js/util.js';
	
	export default {
		data() {
			return {
				shareImg: false,
				isover: {},
				leftTime: 0,
				
				tabIndex: 0,	//选中标签栏的序列
				tabBars:[],
				intoindex: '',
				intTimer: null,  //整点秒杀
				intSeconds: 0,  //
				Data: {},
			}
		},
		
		beforeDestroy() {
			clearInterval(this.intTimer)
		},
		
		methods: {
			// 活动下标定位
			recombinationData(){
				// endTime 整个活动结束时间 spikeTime 单独活动开始时间 spikeEndTime 单独秒杀持续时间
				this.tabBars = this.itemData.data
				// console.log(this.tabBars,'-********************************************')
				let times = [],
					nowTime = Date.parse(new Date()) / 1000,
					idx = 0;
				this.tabBars.map(item=>{
					item.idx = idx;
					idx ++;
					if( item.spike_time+item.spike_end_time >= nowTime || item.spike_time-nowTime>=0 ){
						times.push(item)
					}
				})
				
				if( times.length === 0 ){
					this.tabIndex = this.tabBars.length - 1
					this.Data = undefined
				}
				else{
					// 定位到离现在最近的活动下标
					this.tabIndex = times[0].idx
					this.Data = times[0]
				}
				
				this.swiperIdxFixed()
				this.intTimeMeter(nowTime)
			},
			// 倒计时计算
			intTimeMeter(nowTime){
				let Data = this.Data
				
				if(Data){
					// 未开始
					if( nowTime < Data.spike_time ){
						this.intSeconds = Data.spike_time-nowTime
					}
					else{
						// 已结束
						if( Data.spike_time+Data.spike_en_time < nowTime ){
							this.tabIndex ++
							this.Data.activity_status = 2
						}
						// 抢购中
						else{
							this.intSeconds = Data.spike_end_time+Data.spike_time-nowTime
						}
					}
					this.intTimer = setInterval(() => {
						this.intSeconds--
						if (this.intSeconds < 0 ) {
							// console.log('结束--')
							this.intTimeUp()
							return
						}
						// console.log('-------',this.intSeconds)
					}, 1000)
				}
			},
			intTimeUp(){
				clearInterval(this.intTimer)
				if(this.Data){
					this.recombinationData()
				}
				// console.log('倒计时结束-复位',this.Data)
			},
			
			swiperIdxFixed(){
				this.intoindex = "seckillItem-" + this.tabIndex
			},
			
			toggleTab(index){
				this.tabIndex = index
			},
			// 点击分享
			showSeckillShareBtn() {
				if (this.appClientType === "3") {
					uni.showToast({
						icon: "none",
						title: "请使用自带浏览器分享~"
					})
				} else if (this.appClientType === "4") {
					this.shareImg = true;
				}
			},
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
					} = activityStatus
				
				this.isover = {
					title: status === 0 ? "距本场开始" : status === 1 ? "距本场结束" : "本场已结束",
					statusNew: status
				};
				this.leftTime = leftTime;
			},
			//倒计时结束（限时抢购）
			cutDownEnd() {
				this.setEndTime();
			}
		},
		
		components: {
			CountDown,
			GoodsCardSeckill
		},
		computed: {
		
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemData: Object
		},
		computed:{
			spikeTime(){
				return function (datetime){
					let nowDate = new Date(new Date().setHours(0, 0, 0, 0)) / 1000, //当日凌晨0:0:0的时间戳
						md = utils.formatTime(datetime, 'normal', '月');
					if(datetime >= nowDate && datetime < nowDate+24*60*60){
						return md.split(' ')[1]
					}
					else if( datetime >= nowDate+24*60*60 && datetime < nowDate+24*60*60*2 ){
						return '明日 '+md.split(' ')[1]
					}
					else{
						return md.split(' ')[1]
					}
				}
			},
			spikeStatus(){
				// endTime 整个活动结束时间 spikeTime 单独活动开始时间 spikeEndTime 单独秒杀持续时间
				return function(index,item){
					let nowDate = new Date(new Date().setHours(0, 0, 0, 0)) / 1000,
						nowTime = Date.parse(new Date()) / 1000,
						status={},
						md = utils.formatTime(item.spike_time, 'normal', '月');
					// console.log('开始-'+spikeTime,'当前-'+nowTime,'持续-'+spikeEndTime,spikeTime<nowTime?'小':'大')
					if( nowTime < item.spike_time ){
						status = {
							nums: 0,
							text: '未开始'
						}
					}
					else{
						if( item.spike_time+item.spike_end_time < nowTime || (!!item.activity_status && item.activity_status === 2 )){
							status = {
								nums: 2,
								text: '已结束'
							}
						}
						else{
							status = {
								nums: 1,
								text: '抢购中'
							}
						}
					}
					// status.nums !== 1 && 
					if( !(item.spike_time >= nowDate && item.spike_time < nowDate+24*60*60 || (item.spike_time >= nowDate+24*60*60 && item.spike_time < nowDate+24*60*60*2)) ){
						status['text'] = md.split(' ')[0]+'日'
					}
					this.tabBars[index].activityStatus = status.nums
					return status.text
				}
			},
		},
		
		mounted() {
			console.log('秒杀*** start *************')
			// console.log('itemIndex =>'+this.itemIndex,this.itemStyle,this.params,this.itemData)
			console.log(this.itemStyle)
			console.log(this.params)
			// console.log(this.itemData)
			console.log('秒杀*** e n d *************',this.itemData)
			
			
			
			if( !this.itemData.data || this.itemData.data.length===0){return false}
			
			// 限时抢购
			if(this.params.activitytype==='1'){
				this.setEndTime();
			}
			// 整点秒杀
			else if(this.params.activitytype==='2'){
				this.recombinationData()
			}
		},
	}
</script>

<style lang="scss">
	.seckill-int{
		.seckill-int-swiper{
			flex: 1;
		}
		.swiper-tab-list{
			display: inline-block;
			text-align: center;
			background: #F5F5F5;
			padding: 14rpx 26rpx;
			margin-right:20rpx;
			margin-bottom: 20rpx;
			border-radius: 6rpx;
			position: relative;
			
			&:last-child{
				margin-right: 0;
			}
			&.active{
				background: var(--theme-color, #FFD940);
				color: var(--auxiliary-color, #333333);
			}
			&.active:after {
				content:"";
				width:0;
				height:0;
				position:absolute;
				margin-left: -16rpx;
				left: 50%;
				bottom: -15rpx;
				z-index: 1;
				border-left:solid 16rpx transparent;
				border-top:solid 16rpx var(--theme-color, #FFD940);
				border-right:solid 16rpx transparent;
			}
		}
		.uni-tab-bar .active{
			color: #f00;
		}
		
		.active .swiper-tab-line{
			border-bottom: 6upx solid #FEDE33;
			width: 70upx;
			margin: auto;
			border-top: 6upx solid #FEDE33;
			border-radius: 20upx;
		}
		.uni-swiper-tab{
			padding: 0 20rpx;
			margin: 20rpx 0 10rpx;
			white-space: nowrap;
		}
	}
	
	
	.goods-v2-item__sale-out-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,.5);
		z-index: 9;
	}
	.good-v2-item__img-sale-out {
		width: 121rpx;
		height: 103rpx;
	}
	
	.seckillGoods-box {
		padding: 20upx 0;
		border-radius: 6rpx;

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
		// border: 1px solid;
		// opacity: 0.9;
		border-radius: 4upx;
		height: 34rpx;
		line-height: 34rpx;
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
	.time-title-share{
		width: 28rpx;
		height: 28rpx;
		margin-left: 4rpx;
	}

	.goods-list .goods-items .goods-price .curren-price text {
		padding-left: 8upx;
	}
	
	.share-submit{
		background: transparent;
		font-size: 24rpx;
	}
	.to-share {
		position: fixed !important;
		z-index: 1009;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-color: rgba(0,0,0,.5);
		overflow: auto;
		
		.to-share-img{
			position: absolute;
			right: 10upx;
			width: 500upx;
			height: 380upx;
		}
	}

	/* 商品横排 */
	.content-title-icon{
		width: 50rpx;
		height: 50rpx;
		position: relative;
		top: 2rpx;
		z-index: 1;
		overflow: visible;
		&::before {
			position: absolute;
			right: 10rpx;
			top: 10rpx;
			display: block;
			content: "\20";
			width: 25rpx;
			height: 25rpx;
			border-radius: 25rpx;
			background-color: var(--theme-color, #FFD940);
			z-index: -1;
		}
		i{
			font-size: 40rpx;
		}
		view{
			font-size: 36rpx;
		}
	}
	.goods-row-2, .goods-row-3  {
		.goods-items {
			width: 315rpx;
			display: inline-block;
			margin-top: 20rpx;
			.goods-image {
				width: 100%;
				padding-top: 100%;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				border-top-left-radius: 6upx;
				border-top-right-radius: 6upx;
			}
			
			.goods-tip{
				position: absolute;
				bottom: 0;
				right: 0;
				height: 40rpx;
				line-height: 40rpx;
				color:rgba(255,255,255,.5);
				background: rgba(0,0,0,.1);
				padding:0 20rpx
			}
			
			.goods-title {
				margin: 4upx 0;
				height: 2.8em;
			}
			.goods-price {
				line-height: 40upx;
				.curren-price {
					color: #FE504F;
					font-size: 24upx;
					margin-right: 8upx;
				}
				.curren-old-price {
					text-decoration: line-through;
				}
				.origi-price {
					text-decoration: line-through;
					margin-top: 2upx;
				}
			}
		}
		.progress {
			position: relative;
			width: 94upx;
			height: 16upx;
			background: rgba(242, 242, 242, 1);
			border-radius: 8upx;
		}
		.progress-ing {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 1;
			background-color: #FE504F;
			border-radius: 8upx;
		}
		.seckill-btn {
			width: 120upx;
			height: 44upx;
			line-height: 44upx;
			text-align: center;
			border: 1px solid rgba(254, 80, 79, 1);
			border-radius: 24upx;
			color: #FE504F;
		}
		.goods-progress{
			margin: 8upx 0;
		}
		.goods-progress-in-box{
			width: 180upx;
			height:12upx;
			position: relative;
			border-radius: 6upx;
			border: 1upx solid var(--theme-color);
			
			.goods-progress-in{
				height: 12upx;
				background: var(--theme-color);
				display:inline-block;
				position: absolute;
				left: 0;
				top: 0;
			}
		}
		.goods-buy-btn{
			box-sizing: border-box;
			height: 40rpx;
			padding: 0 8rpx;
			color: var(--auxiliary-color);
			background-color: var(--theme-color);
			border-radius: 4rpx;
			
			&-over{
				color: #999999;
				background:rgba(238,238,238,1);
			}
		}
	}
	.goods-row-2 .goods-items:nth-of-type(2n+1){
		margin-right: 20rpx;
	}
	
	.goods-row-3{
		.goods-items{
			width: 203.33upx;
			margin-right: 20rpx !important;
			
			&:nth-of-type(3n+3){
				margin-right: 0 !important;
			}
		}
		.goods-progress-in-box{
			width: 100upx;
		}
	}

	/* 商品竖排 */
	.goods-cross-2 .goods-list .goods-items {
		// padding: 30upx;
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
