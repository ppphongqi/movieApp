<template>
	<view class="container" :style="themeColor">
		<view class="main">
			<view class="header col-f main-bg-color auxiliary-color" v-if="info.audit_status == 1">
				<view class="f-28 f-w dis-flex flex-x-between flex-y-center">
					<view class="">预约成功</view>
					<view class="cancel" @click="cancel" v-if="isDisplayCancel">取消预约</view>

				</view>
				<view class="f-24 m-top20">已经预约成功咯，请按照约定时间到店哦~</view>
			</view>
			<view class="header col-f main-bg-color auxiliary-color" v-if="info.audit_status == 2">
				<view class="f-28 f-w dis-flex flex-x-between flex-y-center">
					<view class="">预约审核中</view>
					<view class="cancel" @click="cancel" v-if="isDisplayCancel">取消预约</view>
				
				</view>
				<view class="f-24 m-top20">正在预约中，请耐心等待哦~</view>
			</view>
			<view class="header col-f main-bg-color auxiliary-color" v-if="info.audit_status == 3">
				<view class="f-28 f-w dis-flex flex-x-between flex-y-center">
					<view class="">预约失败</view>
					<view class="cancel" @click="navigationTo('pages/subPages/subscribe/confirm?goods_id='+options.goods_id+'&bus_id='+options.bus_id+'&goods_sku_id='+options.goods_sku_id+'&order_id='+options.order_id)">再次预约</view>
				
				</view>
				<view class="f-24 m-top20">原因：{{info.refuse_cause?info.refuse_cause:''}}</view>
			</view>

			<view class="col-3 f-24 info">
				<view class="f-28 f-w">预约信息</view>
				<view class="store-address dis-flex  flex-y-center flex-x-between border-line border-bottom" v-for="(store,storeIndex) in info.store"
				 :key='storeIndex' style="padding-bottom: 30rpx;">
					<view class="store-address-info">
						<view class="col-3 f-30 ">{{store.name}}</view>
						<!-- 店铺电话 -->
						<view class="store-addres-text col-9 twolist-hidden f-24">商家电话:{{store.mobile}}</view>
						<!-- 店铺地址 -->
						<view class="f-24 col-9 m-top10 dis-flex flex-y-center">
							<view class="onelist-hidden" style="width:220px;"> {{store.detailed_address}}</view>
						</view>
					</view>
					<store-nav :mobile="store.mobile" :address="store"></store-nav>

				</view>
				<view class="m-top20">
					<text class="col-6">商品信息：</text>
					<text v-if="info.order_goods && info.order_goods.length && info.order_goods[0].goods_name">{{info.order_goods[0].goods_name}} </text> 
					<view class="" v-if="info.order_goods && info.order_goods.length && info.order_goods[0].goods_attr">({{info.order_goods[0].goods_attr}})</view>
				</view>
				<view class="m-top40">
					<text class="col-6">预约时间：</text>
					<text>{{info.reserve_time*1000 | time}}</text>
				</view>
				<view class="m-top40">
					<text class="col-6">备注信息：</text>
					<text>{{info.remark}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import StoreNav from "@/components/template/StoreNav.vue"

	export default {
		data() {
			return {
				info: {},
				options:{}

			}
		},
		components: {
			StoreNav
		},
		computed:{
			isDisplayCancel(){
				return new Date().getTime() < this.info.reserve_time*1000 
			}
		},
		filters: {
			time(time) {
				time = new Date(time)
				time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
				return time
			}
		},
		methods: {
			// 获取预约信息的数据
			getData() {
				App._post_form('user.Order/getReserveInfo', {
					order_id: this.options.order_id
				}, res => {
					this.info = res.data

				})

			},
			// 取消预约
			cancel(){
				App._post_form('Goods/cancelReserve', {
					apply_id: this.info.apply_id
				}, res => {
					let {code,msg} = res
					if(code ==1 ){
						App.showSuccess('取消成功')
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},1000)
						
					} else {
						App.showError('取消失败')
					}
				
				})
				
			}


		},
		onShow() {
			this.getData()

		},
		onLoad(option) {
			this.options = option
			console.log(option,'=============')
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20rpx;
		height: 100%;
		box-sizing: border-box;

		.main {
			width: 100%;
			height: 100%;
			background-color: #FFFFFF;

			.header {
				border-radius: 10rpx 10rpx 0 0;
				height: 100rpx;
				padding: 40rpx 20rpx 30rpx;
			}

			.info {
				padding: 20rpx;
				box-sizing: border-box;
			}
			
			.cancel {
				border: 1rpx solid #333333;
				padding: 10rpx 20rpx;
				border-radius: 50rpx;
				font-weight: lighter;
			}
		}
	}
</style>
