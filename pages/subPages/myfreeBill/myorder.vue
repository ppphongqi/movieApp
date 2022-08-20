<template>
	<view class="page-myorder">
			<view class="page-myorder-countdown">
				<view style="margin: 0 auto;">
					<!-- 倒计时 -->
					<view style="display: flex;align-items: center;">
						<view style="color: #333333;font-size: 24rpx;font-weight: 400;">
							距离活动结束：
						</view>
						<view>
							<CountDown color="#FFFFFF" background-color="#333333" :day="day" :hour="hours" :minute="minutes" :second="seconds" @timeup="timeup"></CountDown>
						</view>
					</view>
					<!-- 倒计时end -->
				</view>
			</view>
			<view class="page-myorder-content" v-for="(item,index) in goodsData" :key="index">
				<view class="page-myorder-content-top">
					<view style="font-size: 28rpx;display: flex;align-items:center;">
						<view style="color: #333333;">{{item.goods_sales}}</view>
						<view style="color: #999999;">人已购</view>
					</view>
					<view style="font-size: 28rpx;display: flex;align-items:center;">
						<view style="color: #333333;">2000</view>
						<view style="color: #999999;">人分分享</view>
					</view>
					<view style="font-size: 28rpx;display: flex;align-items:center;">
						<view style="color: #333333;">{{item.viewed}}</view>
						<view style="color: #999999;">人浏览</view>
					</view>
				</view>
				<view style=" " class="page-myorder-content-shop">
					{{item.goods_name}}
				</view>
				<view class="page-myorder-preferential">
					<view style="
					background: linear-gradient(180deg, #F99909 0%, #FD6A09 100%);
					display: inline-block;
					padding: 6rpx;
					border-top-left-radius:20rpx;
					border-top-right-radius:20rpx;
					border-bottom-right-radius:20rpx;
					">
						特惠价
					</view>
					<view style="display: flex;align-items: center;" class="m-btm40">
						<view style="margin: 0 auto;">
							<view style="display: flex;text-align: center;">
								<view class="page-goods-price" style="display: flex;align-items: center;">
									<view style="color: #CB2C2E;display:flex;align-items:flex-end;"> 
										<view style="font-size: 24rpx;margin-bottom: -8rpx;">￥</view>
										<view style="font-size: 48rpx;font-weight: bold;">{{item.goods_price}}</view>
									</view>
									<view class="page-goods-marking">
										<view>原价</view>
										<view >￥{{item.line_price}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<view style="padding: 20rpx;">
						<view class="" style="background: linear-gradient(180deg, #F99A09 0%, #FE6A09 100%);border-radius: 40px;box-shadow: 0rpx 4rpx 0rpx #DF4308;">
							<!-- @click="nowPurchase()" -->
								<view style="font-size: 32rpx;font-weight: bold;line-height: 39px;color: #FFFFFF;" >立即购买</view>
						</view>
					</view>
					<view style="padding: 20rpx;">
						<view class="" style="background: #FFFFFF;border-radius: 40px;border: 1px solid #707070;">
								<view style="font-size: 32rpx;font-weight: bold;line-height: 39px;color: #333333;">立即推广(赚￥{{item.dealer_money}})</view>
						</view>
					</view>
				</view>
				
			</view>
		
	</view>
	
</template>

<script>
	import CountDown from '@/components/template/newCount.vue';
	import App from '@/common/js/app.js'
	export default{
		components: {
			CountDown,
		},
		data(){
			return{
				free_id:'',
				goods_id:'',
				goodsData:[],
				day: '',
				hours: '',
				minutes: '',
				seconds: '',
			}
		},
		onLoad(e){
			this.free_id=e.free_id
			this.goods_id=e.goods_id
		},
		async onShow(){
			try{
				await Promise.all([
					this.getGoodsDetail({}).catch(() => {}),
				])
			}catch(e){
				
			}
		},
		methods:{
			async getGoodsDetail(){
				try {
					const res = await App._postP('free.Free/getGoodsDetail',{
						free_id:this.free_id,
						goods_id:this.goods_id,
					})
					console.log("fsdfdsfds",res)
					// // 处理时间
					var timestamp = (new Date()).getTime();
						
					var timeCa = res.data.free.activity_etime * 1000 - timestamp
						
					var day = parseInt(timeCa / (24 * 60 * 60 * 1000));
					
					var hour = parseInt((timeCa % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
					
					var minute = parseInt(((timeCa % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) / (60 * 1000));
					
					var second = parseInt((((timeCa % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000);
					this.day = day
					
					this.hours = hour
					
					this.minutes = minute
					
					this.seconds = second
					//处理商品信息
						this.goodsData.push({
							goods_name:res.data.goods.goods_name,
							goods_sales:res.data.goods.sku[0].goods_sales,//已购人数
							viewed:res.data.goods.viewed,//浏览次数
							//还差个分享人数
							
							goods_price:res.data.goods.sku[0].goods_price,//商品价格
							line_price:res.data.goods.sku[0].line_price,//划线价格
							dealer_money:res.data.dealer_money,
						})
					console.log("fdsjfdsf佛挡杀佛的",this.goodsData)
					
				}catch(e){
					conson.log("fsdfdsfds",res)
					return Promise.reject(e)
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	
	.page-myorder{
		padding: 30rpx;
		background:#A5C9D2 ;
		box-sizing: border-box;
	}
	.page-myorder-countdown{
		display: flex;
		align-items: center;
		background: #FFFFFF;
		    padding: 10px;
		   border-radius: 20px;
	}
	.page-myorder-content{
		margin-top: 20rpx;
		background: #F8F8F8;
		border-radius:20rpx;
		// height: 300rpx;
	}
	.page-myorder-content-top{
		display: flex;
		background: #DD524D;
		border-top-left-radius:20rpx;
		border-top-right-radius:20rpx;
		padding: 20rpx;
		justify-content:space-between
	}
	.page-myorder-content-shop{
		color: #333333;
		font-size: 24px;
		font-weight: bold;
		padding:0 20rpx 0 20rpx; 	
		margin: 20rpx 0 20rpx 0;
		overflow: hidden;
		text-overflow: ellipsis;
		display:-webkit-box; //作为弹性伸缩盒子模型显示。
		-webkit-box-orient:vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
		-webkit-line-clamp:2; //显示的行
	}
	.page-myorder-preferential{
		font-size: 24rpx;
		font-weight: bold;
		line-height: 44rpx;
		color: #FFFFFF;
		text-align: center;
		margin-top: 30rpx;
		
	}
	.page-goods-marking{
		color: #999999;
		font-size: 24rpx;
		font-weight: 500;
		display: flex;
		text-decoration:line-through;
		margin-left: 20rpx;
	}
</style>
