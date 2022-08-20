<template>
	<!-- 秒杀卡片 -->
	<!--  display 1两列正方形 2两列长方形 3三列正方形 4单列 -->
	<!-- 两列/三列（横排） -->
	<view v-if="itemStyle.display==='1'||itemStyle.display==='2'||itemStyle.display==='3'" class="goods-cross-seckill-1 goods-row-2" :class="itemStyle.display==='3'?'goods-row-3':''">
		<view class="goods-list flex-y-center">
			<block v-for="(item,index) in itemDataList" :key="index">
				<view class="goods-items" @click="skip(item.goods_id,item.spike_id,itemData.end_time)">
					<view style="position: relative;">
						<view class="goods-image" :class="'goods-image-'+itemStyle.display" :style="{'background-image':'url('+item.file+')'}"></view>
						
						<view v-if="goodsStatus(item)==2" class="goods-v2-item__sale-out-wrapper">
							<image class="good-v2-item__img-sale-out" :src="getImageRoot('86.png')" mode="widthFix"></image>
						</view>
						<!-- 返 -->
						<view v-if="distributionPrice(item)" class="goods-v2-item__price-earn-v2 price-font-family">
							{{ distributionPrice(item) }}
						</view>
						<!-- 会员价 -->
						<text v-if="memberPrice(item)" class="f-24 goods-tip">
							{{ memberPrice(item) }}
						</text>
						
					</view>
					<view style="padding: 10rpx 10rpx 18rpx 10rpx;">
						<view class="goods-title f-28 col-3 num-height-2" :style="itemStyle.name==='1'?'':'visibility:hidden;'">
							<text v-if="goodsStatus(item)==0||goodsStatus(item)==1" class="goods-buy-btn f-20 goods-buy-status">
								{{ goodsStatus(item)==0 ?'即将开抢': '抢购中' }}
							</text>{{item.goods_name}}
						</view>
						<view class="ab goods-progress">
							<view class="goods-progress-in-box">
								<view class="goods-progress-in" :style="{'width':goodsInWidth(item, itemStyle.display==='3'?100:180 )}"></view>
							</view>
							<view style="width:80upx;text-align: right;" class="f-20 col-9 num-height-1">
								<!-- 已结束 -->
								<text v-if="goodsStatus(item)==2">{{ item.stk > 0 ? '下次再来' : '抢光了' }}</text>
								<!-- 未开始 -->
								<text v-else-if="goodsStatus(item)==0">抢<text class="price-font-family">{{item.stock}}</text>份</text>
								<!-- 进行中 -->
								<text v-else-if="goodsStatus(item)==1">剩<text class="price-font-family">{{item.stk}}</text>份</text>
							</view>
						</view>
						<view class="goods-price dis-flex flex-y-line ab">
							<view>
								<view 
								class="curren-price price-font-family" 
								:style="itemStyle.price==='1'?'':'visibility:hidden'" 
								v-if="itemStyle.price==='1'">
									{{settingData.currency}}<text class="f-36">{{item.price}}</text>
								</view>
								<view
								class="curren-old-price price-font-family22 f-20 col-9" 
								:style="itemStyle.oldprice==='1'?'':'visibility:hidden'" 
								v-if="itemStyle.oldprice==='1'">
									{{settingData.currency}}<text class="">{{item.old_price}}</text>
								</view>
							</view>
							<!-- 3列 -->
							<view v-if="itemStyle.display==='3'" class="goods-buy-btn f-24" :class="goodsStatus(item)==2?'goods-buy-btn-over':''">
								{{ goodsStatus(item)==2 ? '完' : '抢'  }}
							</view>
							<!-- 2列 -->
							<view v-else class="goods-buy-btn f-24" :class="goodsStatus(item)==2?'goods-buy-btn-over':''">
								{{ goodsStatus(item)==2 ? '已结束' : goodsStatus(item)==0 ? '未开始': '马上抢'  }}
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
	
	<!-- 单列（竖排） -->
	<view v-else-if="itemStyle.display==='4'" class="goods-cross-seckill-2">
		<view class="goods-list">
			<view class="goods-items dis-flex p-r" v-for="(item,index) in itemDataList" :key="index" @click="skip(item.goods_id,item.spike_id,itemData.end_time,item)">
				<view class="goods-image-box">
					<view class="goods-image" :style="{'background-image':'url('+item.file+')'}"></view>
					<view v-if="goodsStatus(item)==2" class="goods-v2-item__sale-out-wrapper">
						<image class="good-v2-item__img-sale-out" :src="getImageRoot('86.png')" mode="widthFix"></image>
					</view>
					
					
					<!-- 返 -->
					<view v-if="distributionPrice(item)" class="goods-v2-item__price-earn-v2 price-font-family">
						{{ distributionPrice(item) }}
					</view>
					<!-- 会员价 -->
					<text v-if="memberPrice(item)" class="f-24 goods-tip">
						{{ memberPrice(item) }}
					</text>
				
					
				</view>
				
				<view class="goods-content dis-flex flex-dir-column flex-x-between">
					<view class="goods-title f-28 col-3" :style="itemStyle.name==='1'?'':'visibility:hidden;'">
						<text v-if="goodsStatus(item)==0||goodsStatus(item)==1" class="goods-buy-btn f-20 goods-buy-status">
							{{ goodsStatus(item)==0 ?'即将开抢': '抢购中' }}
						</text>{{item.goods_name}}
					</view>
					<view class="ai goods-progress">
						<view class="goods-progress-in-box">
							<view class="goods-progress-in" :style="{'width':goodsInWidth(item, 180 )}"></view>
						</view>
						<view style="max-width:120upx;padding-left: 12rpx;" class="f-20 col-9 num-height-1">
							<!-- 已结束 -->
							<text v-if="goodsStatus(item)==2">{{ item.stk > 0 ? '下次再来' : '抢光了' }}</text>
							<!-- 未开始 -->
							<text v-else-if="goodsStatus(item)==0">抢<text class="price-font-family">{{item.stock}}</text>份</text>
							<!-- 进行中 -->
							<text v-else-if="goodsStatus(item)==1">剩<text class="price-font-family">{{item.stk}}</text>份</text>
						</view>
					</view>
					<view class="ab price-seckill-btn dis-flex flex-x-between">
						<view class="goods-price dis-flex flex-y-line">
							<view class="curren-price price-font-family" :style="itemStyle.price==='1'?'':'visibility:hidden;'">{{settingData.currency}}
								<text class="f-36">{{item.price}}</text>
							</view>
							<view class="origi-price f-24 col-9" :style="itemStyle.oldprice==='1'?'':'visibility:hidden;'">{{settingData.currency}}{{item.old_price}}</view>
						</view>
						<view class="goods-buy-btn f-24" :class="goodsStatus(item)==2?'goods-buy-btn-over':''">
							{{ goodsStatus(item)==2 ? '已结束' : goodsStatus(item)==0 ? '未开始': '马上抢'  }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
		
</template>

<script>
	import CountDown from "@/components/template/CountDownSeckill.vue"
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
			};
		},
		components: {
			CountDown
		},
		computed: {
			memberPrice(){
				return function(item){
					if( this.itemDatas && this.itemDatas.is_member === 1 && item.member_price > 0 ){
						return '会员价'+item.member_price
					}
					else{
						return false
					}
				}
			},
			distributionPrice(){
				return function(item){
					if( this.itemDatas && this.itemDatas.is_distribution === 1 && item.dealer_money > 0 ){
						return  (this.itemStyle.commission || '返') +':￥'+item.dealer_money
					}
					else{
						return false
					}
				}
			},
			
			itemDataList() {
				// activitytype  1普通  2整点秒杀
				// console.log(this.itemParams.activitytype,'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',this.itemData)
				return (this.itemParams.activitytype==='1' ? this.itemData.data : this.itemData) || [];
			},
			goodsInWidth(){
				return function(item,width){
					return (this.goodsStatus(item)===0?0:this.goodsStatus(item)===2?100:item.sales_volume)/100*width+'rpx'
				}
			},
			// 
			goodsStatus(){
				return function(item){
					if( this.activityStatus==0 ){
						// 未开始
						return 0
					}
					else{
						if( item.stk <= 0 || this.activityStatus==2 ){
							// 已结束
							return 2
						}
						else{
							// 进行中
							return 1
						}
					}
				}
			}
		},
		props: {
			itemStyle: Object,
			itemData: Object,
			itemDatas: Object,  //整点秒杀时 才有的参数
			activityStatus: Number,   //活动状态 0未开始 1进行中 2已结束
			itemParams: Object
		},
		beforeCreate() {
		
		},
		onLoad(options) {

		},

		onShow() {

		},	
		mounted() {
			// console.log(this.itemData,'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
			// console.log('...................................................=============',this.activityStatus)
		},
		methods: {
			skip(goods_id, spike_id, end_time,item) {
				// console.log(item,'item')
				
				if (this.activityStatus==1) {
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
	.goods-v2-item__price-earn-v2 {
		position: absolute;
		left: 0;
		top: 0;
		height: 34rpx;
		padding: 0 11rpx;
		line-height: 34rpx;
		font-size: 22rpx;
		color: #fff;
		white-space: nowrap;
		background: linear-gradient(-50deg, rgba(255, 68, 68, 0.9) 0%, rgba(253, 113, 55, 0.9) 100%);
		border-top-left-radius: 10rpx;
		border-bottom-right-radius: 14rpx;
		z-index: 5;
	}
	.goods-list{
		padding: 0 20rpx;
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
	// 竖排
	.goods-cross-seckill-2  {
		.goods-items{
			padding: 20rpx;
			box-shadow:0 4rpx 24rpx 0 rgba(221, 221, 221, 0.35);
			
			.goods-image-box {
				width: 200upx;
				height: 200upx;
				position: relative;
				border-radius: 6upx;
				margin-right: 30upx;
				overflow: hidden;
				
				.goods-image {
					width: 100%;
					height: 100%;
					background-size: 100% 100%;
					background-repeat: no-repeat;
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
			}
			
			.goods-buy-btn{
				box-sizing: border-box;
				height: 44rpx;
				line-height: 44rpx;
				padding: 0 12rpx;
				color: var(--auxiliary-color);
				background-color: var(--theme-color);
				border-radius: 4rpx;
				
				&-over{
					color: #999999;
					background:rgba(238,238,238,1);
				}
			}
			
			.goods-progress{
				margin: 8upx 0;
			}
			.goods-progress-in-box{
				width: 180upx;
				height:14upx;
				position: relative;
				border-radius: 7upx;
				border: 1upx solid var(--theme-color);
				
				.goods-progress-in{
					height: 14upx;
					background: var(--theme-color);
					display:inline-block;
					position: absolute;
					left: 0;
					top: 0;
				}
			}
		}
		.goods-content {
			flex: 1;
			width: 0;
		}
		.goods-title {
			height: 3em;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.progress {
			position: relative;
			width: 260upx;
			height: 30upx;
			background-color: #f7cfcd;
			border-radius: 15upx;
			
			.count {
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
				color: #FFFFFF;
				z-index: 2;
				line-height: 30upx;
			}
			
			.progress-ing {
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
		}
		.curren-price {
			color: #FE504F;
			font-size: 24upx;
			margin-right: 8upx;
		}
		.origi-price {
			text-decoration: line-through;
			margin-top: 2upx;
			padding-left: 4rpx;
		}
	}
	// 竖排 end
	
	// 横排
	.goods-cross-seckill-1{
		&.goods-row-2, &.goods-row-3  {
			.goods-items {
				width: 315rpx;
				display: inline-block;
				margin-top: 20rpx;
				border-top-left-radius: 6upx;
				border-top-right-radius: 6upx;
				overflow: hidden;
				box-shadow:0 4rpx 24rpx 0 rgba(221, 221, 221, 0.35);

				.goods-image {
					width: 100%;
					// padding-top: 100%;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					overflow: hidden;
					
					// 商品图片正方形
					&.goods-image-1{
						height: 315rpx;
					}
					// 商品图片长方形
					&.goods-image-2{
						height: 177rpx;
					}
					// 三列正方形
					&.goods-image-3{
						height: 203.33upx;
					}
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
						position:relative;
						top: 8rpx;
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
				line-height: 40rpx;
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
		&.goods-row-2 .goods-items:nth-of-type(2n+1){
			margin-right: 20rpx;
		}
		&.goods-row-3{
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
	}
	
	
	.goods-buy-btn.goods-buy-status{
		height: 24rpx !important;
		line-height: 24rpx !important;
		padding: 0 7rpx !important;
		max-width: 100rpx;
		margin-right: 8rpx;
	}
</style>
