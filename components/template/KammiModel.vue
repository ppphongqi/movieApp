<template>
	<view class="modelBox">
		
	
	<view class="kami">
		<view class="modelHead">
			<text>您的卡密</text>
		</view>
		<scroll-view class="kamiContent" scroll-y="true" >
			
		<view class="">
			<view class="main" v-for="(item,index) in orderKami" :key="index">
				<view class="" style="padding: 8rpx;display: flex;justify-content: space-between;" v-for="(im,ix) in item" :key="ix">
					<view style="padding: 8rpx;" >
						<text>{{im.key}} : </text><text style="color: #999999;"> {{im.value}}</text>
					</view>
					<view style="padding: 8rpx 16rpx; color: #999999;min-width: 100rpx;" @click="copyContent(im.value,'text')">
						<text>复制</text>
					</view>
				</view>
			</view>
			
		</view>
			
			
		</scroll-view>
		<view class="foot" @click="closeModel">
			<text>关闭</text>
		</view>
	</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		props:{
			orderKami:Array
		},
		data(){
			return{
				
			}
		},
		mounted() {
			
		},
		methods:{
			copyContent(content, copyType) {
				if (copyType === "content") {
					content = content.map(val => `${val.key}:${val.value}`).join("\n");
				}
				console.log(content);
				App.copyTextHandle(content);
			},
			closeModel(){
				this.$emit("closeKami")
			}
		}
	}
</script>

<style lang="less" scoped>
	text{
		font-size: 14px;
	}
	.modelBox{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0,0,0,0.4);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
	.kami{
		width: 600rpx;
		border-radius: 14rpx;
		background-color: #FFFFFF;
	}
	.kamiContent{
		min-height: 200rpx;
		max-height: 600rpx;
	}
	.modelHead{
		text-align: center;
		padding: 16rpx;
		border-bottom: 1px solid #F7F7F7;
	}
	.main{
		margin: 16rpx;
		padding-bottom: 32rpx;
		border: 1px #F7F7F7 solid;
		border-radius: 14rpx;
		box-shadow: 10rpx 10rpx 5rpx #F7F7F7;
		// background-color:#F2F2F2;
		// border-radius: 8rpx;
	}
	.foot{
		border-top: 1px solid #F7F7F7;
		text-align: center;
		padding: 16rpx;
		
		
	}
</style>
