<template>
	<view class="contianer" :style="themeColor">
		<view class="header b-f">
			<input type="text" placeholder="搜索店铺" @confirm="search" class="f-24 col-3" v-model="name" placeholder-class="f-24 col-9" />
		</view>
		<view style="padding-bottom: 100rpx;">
			<block v-if="busData.length">
				<view @click="select(item,index)" class="item dis-flex flex-x-between flex-y-center" v-for="(item,index) in busData" :key='index' :class="{'item-click':bus_id == item.bus_id}">
					<view class="dis-flex  flex-y-center">
						<image :src="item.business && item.business.logo && item.business.logo.file_path?item.business.logo.file_path:''" mode=""></image>
						<view class="f-30 col-3 onelist-hidden m-left-right-30" style="width: 250rpx;">
							{{item.business&&item.business.name?item.business.name:''}}
						</view>
						
					</view>
					
					<view class="f-24 col-3" v-if="item.bus_id == bus_id">
						当前店铺 >
					</view>
					
				</view>
			</block>
			<block v-else>
				<Abnor abnor="GOODS"></Abnor>
			</block>
			
		<view class="btn main-bg-color auxiliary-color t-c f-28 col-3" @click="back">返回当前所在店铺</view>
		</view>
		
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import Abnor from "@/components/template/Abnor.vue"
	import App from "@/common/js/app.js"
	export default {
		components:{
			Abnor
		},
		data(){
			return {
				busData:[],//商家列表
				current:-1,//当前选中的index
				bus_id:'',
				name:'',
			}
		},
		onLoad(options) {
			this.bus_id = options.bus_id
			this.options = options
		},
		onShow() {
			App.showLoading()
			this.getBusData()
		},
		methods:{
			back(){
				uni.navigateBack()
			},
			// 根据商家名字进行查询
			search(){
				uni.showLoading({
					title: "查询中..."
				})
				this.getBusData()
			},
			// 获取商家列表
			getBusData(){
				App._post_form('merchant.index/switchBusiness',{name:this.name},res=> {
					const {code,msg,data:data=[]} = res;
					this.busData = data
					
				},()=>{},()=> {
                  App.hideLoading()
				  uni.hideLoading()
				})
				
			},
			// 选择商家且切换到该商家
			//切换商家时进行一个友好提示
			select(item,index) {
				let _this = this
				this.current = index
				_this.bus_id = item.bus_id
				uni.showModal({
					title:"提示",
					content:"确定切换到该商家？",
					success(res){
						console.log(res,'res')
						const {confirm,cancel,errMsg} = res
						if(confirm) {
							App.navigationTo({
								url: `pages/subPages/business/index?bus_id=${_this.bus_id}`
							});
							
						}
						cancel && (_this.bus_id = _this.options.bus_id)
						
						
						
					},

					
				})
				
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	.contianer {
		padding: 30rpx;
		box-sizing: border-box;
		.header{
			input {
				width: 100%;
				height:70rpx;
				padding:0 20rpx;
				box-sizing: border-box;
				background:rgba(244,244,244,1);
				border-radius:35rpx;
				margin-bottom: 50rpx;
				font-size: 24rpx;
				
			}
			
			// input {
			// 	padding:0 10rpx;
			// 	line-height: 70rpx;
			// 	box-sizing: border-box;
			// }
		}
		
		.item {
			height: 150rpx;
			box-shadow:0px 0px 12px 0px rgba(0, 0, 0, 0.1);
			border-radius:10rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			margin-top: 30rpx;
			image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}
		}
		.item-click{
			border: 1rpx solid var(--theme-color);
		}
		.btn {
			padding: 27rpx 89rpx;
			border-radius: 45rpx;
			position: fixed;
			bottom: 30rpx;
			left:24%;
			
			
			
		}
	}
	
</style>
