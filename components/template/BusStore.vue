<template>
	<view class="">
		<scroll-view scroll-y="true"  v-if="storeData.length">
			<view class=" goods-item-box dis-flex m-top-btm20" @click="navigationTo('pages/subPages/shopDetail/shopDetail?store_id='+item.id+'&bus_id='+item.bus_id)"
			 v-for="(item,index) in storeData" :style="index==0?'margin-top:0;':''" :key='index'>
				<!-- 图片部分 -->
				<view class="goods-image">
					<image :src="item.quaimg && item.quaimg.length && item.quaimg[0].file_path?item.quaimg[0].file_path:''" mode="" style="border-radius: 20rpx;"> </image>
					<view class="f-18 dis-flex flex-x-center flex-y-center" v-if="item.store_label">
						{{item.store_label}}
					</view>
				</view>
		
				<!-- 描述部分 -->
				<view class="m-left20" style="width: 74%;">
					<view class="col-3 f-28 f-w">
						<text>{{item.business_name}}</text>
						<text class="m-left20 f-22">{{item.name}}</text>
					</view>
					<view class="dis-flex flex-x-between  m-top-18">
						<view class=" dis-flex ">
					
							<view class=" dis-flex  f-24">
								<view class="" style="position: relative;width: 16px;height: 16px;" v-for="(items,itemsdex) in [1,2,3,4,5]" :key="itemsdex">
									 <image src="../../static/images/goods/half.png" mode="" v-if="((itemsdex+1+itemsdex)/2)==item.store_score" :style="((itemsdex+1+itemsdex)/2)==item.store_score?'z-index:2':''" style="position: absolute;top: 2rpx;left: 2rpx;width: 12px;height: 12px;"></image>
									<view v-if="((itemsdex+1+itemsdex)/2)!=item.store_score" style="position: absolute;top: 0;left: 0;" class="iconfont icon-shoucangxiao select " 
									 :style="items<=Math.round(item.store_score)?'color:#F28243;font-size:12px;':'color:#F4F4F4;font-size:12px;'"></view>
									
								</view>
								<!-- <view class="iconfont icon-shoucangxiao select m-right12" v-for="(items,index) in [1,2,3,4,5]" :key="index"
								 :style="items<item.store_score?'color:#F28243;font-size:12px;':'color:#F4F4F4;font-size:12px;'"></view> -->
							</view>
							<view class="f-22 col-6 m-left12" v-if="item.store_score>0">{{item.store_score}}分</view>
							<text class="f-22 col-6 m-left20" v-if="item.per_capita>0">￥{{item.per_capita?item.per_capita:0}}/人 </text>
						</view>
						
						<text class="f-22 col-6">{{item.width?item.width:0}}km </text>
					</view>
					<view class="f-22 col-6 dis-flex flex-x-between  m-top-18">
		
						<view class="">
							<text>{{item.sort_name}}</text>
							<text :style="item.sort_name?'margin-left:20rpx':''">{{item.circle_name}}</text>
						</view>
						<text :style="item.week==1?'color: #F28243;':'color: #666;'" class="f-w">{{item.week==1?'今日营业':'暂停营业'}}</text>
		
		
					</view>
					<view class="comment onelist-hidden m-top-18 dis-il-block" v-if="item.store_introduce || item.describe">{{item.store_introduce?item.store_introduce:item.describe}}</view>
					<view class="dis-flex m-top-18 flex-y-center" v-if="item.dis_info">
						<view class="word col-f f-20">惠</view>
						<view class="col-6 f-22 m-left12">{{item.dis_info}}</view>
					</view>
					<!-- <view class="dis-flex m-top-18 flex-y-center" v-if="item.dis_info">
						<view class="word col-f f-20" style="background:rgba(243,162,57,1);">劵</view>
						<view class="col-6 f-22 m-left12">双人餐86.9元起，4人餐269元...</view>
					</view> -->
		
		
				</view>
		
		
		
			</view>
		</scroll-view>
	</view>
</template>

<script>
	
	export default {
		components:{
	
		},
		data(){
			return {
	
			}
		},
		props:{
			storeData:{
				default:[]
			}
		},
		methods:{
	
		},
		mounted() {
	
		}
	}
</script>

<style lang="scss">
	.goods-item-box {
	
		background-color: #fff;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		.goods-image{
			width: 150rpx;
			height: 150rpx;
			border-radius: 10rpx;
			overflow: hidden;
			position: relative;
			image{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			view{
				position: absolute;
				top: 0;
				right: 0;
				width:50rpx;
				height:30rpx;
				z-index: 2;
				background:rgba(255,217,64,1);
				border-radius:0rpx 10rpx 0rpx 10rpx;
			}
			
		}
	
		
	
		.m-top-18 {
			margin-top: 18rpx;
		}
	
		.comment {
			max-width: 94%;
			color: rgba(242, 130, 67, 1);
			font-size: 20rpx;
			padding: 2rpx 15rpx;
			border: 1rpx solid rgba(242, 130, 67, 1);
			border-radius: 18rpx 15rpx 15rpx 0rpx;
		}
	
		.word {
			width: 30rpx;
			height: 30rpx;
			text-align: center;
			line-height: 30rpx;
			background: rgba(242, 130, 67, 1);
			border-radius: 4rpx;
		}
	}
</style>
