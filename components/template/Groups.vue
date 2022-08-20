<template>
	<view :style="{'padding': itemStyle.margincol+'px '+itemStyle.marginrow+'px'}">
		<view class="padding-box-all dis-flex flex-x-between padding-box top-box" :style="{'background': itemStyle.bgcolor}" @click="cut">
			<view style="width: 80%;">
				<block v-if="!!groupData.name">
					<view class="dis-flex flex-y-center" >
						<!-- <view class="groupsAvatar m-right20" :style="{'background-image':'url('+imageRoot+'2.png)'}"></view> -->
						<image class="groupsAvatar m-right20" :src="groupData.avatarUrl" ></image>
						<view class="f-28 col-3 onelist-hidden" style="width: 85%;">
						{{groupData.name}}
						<text>—</text>
						{{groupData.community}}
						</view>
					</view>
				</block>
				<block v-else>
					<view class="f-26 col-9 t-c">暂未选择团长！</view>
				</block>
			</view>
			<view class="dis-flex flex-y-center col-3">
				<view class="f-24 m-right12">切换</view>
				<view class="iconfont icon-wangfandijia"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data(){
			return {
				avatarUrl:'',
				community:'',
				name:'',
				data:[],
				groupData:{}
			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			leaderData:Object
		},
		onShow(){
		
		},
		computed:{
			
		},
		watch:{
			leaderData:{
				handler(data){
					console.log(data,'data===========')
					this.groupData = data
				},
				immediate:true,//立刻执行handler方法
				deep:true//深度监听引用类型
			}
		},
		onLoad(options){
			
		},
		mounted(){
			// console.log('mounted')
			// this.getBindReg();
		},
		methods:{
			// getBindReg(){
			// 	let _this=this;
			// 	App._post_form("cgp.Reg/getBindReg",{
			// 		no_login:1
			// 	},res =>{
			// 		console.log("+++++++++",res)
			// 		_this.data = res.data;
			// 		console.log('aaaa',!!_this.data)
			// 		_this.name = res.data.name;
			// 		_this.community = res.data.community;
			// 		_this.avatarUrl = res.data.avatarUrl;
			// 	})
			// },
			cut(){
				uni.navigateTo({
				    url: '/pages/subPages/cgp/address/address'
				});
			},
			
		}
	}
	
</script>

<style>
	.top-box{
		border: 1rpx solid #DDDDDD;
		border-radius: 10rpx;
		box-shadow:0px 2px 12px 0px rgba(221, 221, 221, 0.35);
		color: #dddddd;
	}
	.groupsAvatar{
		width: 50upx;
		height: 50upx;
		border-radius: 50upx;
		background-size: 50upx 50upx;
		background-repeat: no-repeat;
	}
</style>
