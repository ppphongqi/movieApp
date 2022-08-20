<template>
	<view class="tiered-page">
		<view v-for="(item,index) in tieredList" :key="index" class="tiered-list-item dis-flex flex-x-between" :class="{'underway':item.type === 1}">
			<view class="item-left">
				<view class="scope f-24 col-9">第{{item.lower_limit}}~{{item.upper_limit}}件优惠价</view>
				<view v-if="ismember" class="price f-24 col-9" :class="{'no-sell-out':item.type !== 2}">¥<text style="font-weight: bold;margin-left: 5rpx;">{{item.member_step_price}}</text></view>
				<view v-else class="price f-24 col-9" :class="{'no-sell-out':item.type !== 2}">¥<text style="font-weight: bold;margin-left: 5rpx;">{{item.step_price}}</text></view>
			</view>
			<view v-if="item.type === 1" class="underway-img">
				<image :src="getImageRoot('92.png')" ></image>
			</view>
			<view class="item-right">
				<view v-if="item.type === 2" class="sell-state f-26 col-9">已售完</view>
				<view v-else class="sell-state f-26 col-3">仅剩<text style="color: #FF4444;">{{item.number}}</text>件</view>
				<view v-if="item.type === 2" class="progress-box" style="background-color: #ccc;"></view>
				<!-- <view v-if="item.type === 1" class="progress-box">
					<progress :percent="percent(item)" border-radius="5" stroke-width="10rpx" activeColor="#FFDEDE" backgroundColor="#FF4444"/>
				</view> -->
				<view v-if="item.type === 1" class="progress-box dis-flex">
					<view style="background: #FFDEDE;" :style="{'width':surplusPercent(item) + 'rpx'}"></view>
					<view style="background: #FF4444;" :style="{'width':salePercent(item) + 'rpx'}"></view>
				</view>
				<view v-if="item.type === 3" class="progress-box" style="background-color: #FFDEDE;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			tieredList:{
				type:Array,
				default() {
					return []
				}
			},
			ismember: {
				type:Boolean,
				default:false
			}
		},
		computed: {
			surplusPercent() {
				return function(obj){
					let res = obj.number / (obj.upper_limit - obj.lower_limit + 1)
					return res.toFixed(2)*120
				}
			},
			salePercent() {
				return function(obj) {
					return 120 - this.surplusPercent(obj)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tiered-page {
		width: 690rpx;
		background: #fff;
		border-radius: 10rpx;
		box-shadow: 0px 2px 12px 0px rgba(221, 221, 221, 0.5);
		margin: auto;
	}
	.tiered-list-item {
		height: 124rpx;
		padding: 0 30rpx;
	}
	.underway {
		background: #FFFAE6;
		border: 1rpx solid #FFD940;
	}
	.scope {
		margin-top: 32rpx;
	}
	.price {
		margin-top: 10rpx;
	}
	.no-sell-out {
		color: #FF4444;
	}
	.sell-state {
		margin-top: 32rpx;
		text-align: right;
	}
	.underway-img {
		width: 150rpx;
		height: 124rpx;
		image { 
			width: 100%;
			height: 100%;
		}
	}
	.progress-box {
		width: 120rpx;
		height: 10rpx;
		margin-top: 25rpx;
		border-radius: 5rpx;
		overflow: hidden;
		z-index: 10;
	}
</style>
