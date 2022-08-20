<template>
	<view class="">
		<!-- <text>直播组件</text> -->
		<view class="" style="margin: 16rpx 28rpx;">
			<text :class="{'commonTitle':true,'activeLive':chTitle==1}" style="margin-right: 30rpx;" @click="changeTitle(1)">直播中/预告</text>
			<text :class="{'commonTitle':true,'activeLive':chTitle==2}" @click="changeTitle(2)">精彩回放</text>
		</view>
		<view class="liveList">
			<view class="liveOne" v-for="(item,index) in showList" :key="index" @click="toLiveRoom(item.roomid,item.room_id)">
				<view class="liveImg">
					<view class="imgTip" v-if="item.status==1">
						<view class="tipBack" style="background: linear-gradient(90deg, rgba(255, 67, 67, 1) 0%, rgba(253, 113, 55, 1) 100%);">
							<image class="tipImg" src="@/static/images/live/live3.png" mode=""></image>
						</view>
						<text style="font-size: 10px;line-height: 42rpx;">{{item.pv}}人观看</text>
					</view>
					<view class="imgTip"  v-if="item.status==2">
						<view class="tipBack" style="background:linear-gradient(90deg,rgba(21,203,21,1) 0%,rgba(86,239,82,1) 100%);">
							<image class="tipImg" src="@/static/images/live/live2.png" mode=""></image>
						</view>
						<text style="font-size: 10px;line-height: 42rpx;">{{item.start_time}} 开播</text>
					</view>
					<view class="imgTip"  v-if="item.status==3">
						<view class="tipBack" style="background:linear-gradient(90deg,rgba(158,158,158,1) 0%,rgba(217,217,217,1) 100%);">
							<image class="tipImg" src="@/static/images/live/live1.png" mode=""></image>
						</view>
						<text style="font-size: 10px;line-height: 42rpx;">回放 {{item.pv}}人观看</text>
					</view>
					<image class="shareImg" :src="item.share_img" mode=""></image>
				</view>
				<view class="liveRight">
					<view class="titleText">
						<text>{{item.name}}</text>
						<!-- <text>这是标题！这是标题！这是标题！这是标题！这是标题！这是标题！这是标题！这是标题！这是标题！这是标题！</text> -->
					</view>
					<view class="">
						<view class="allTips">
							<view class="" v-if="item.status==1">
								<text   class="startTag" style="background:linear-gradient(90deg,rgba(255,67,67,1) 0%,rgba(253,113,55,1) 100%);">已开播</text>
							</view>
							<view class="" v-else-if="item.status==2">
								<text   class="startTag" style="background:linear-gradient(90deg,rgba(21,203,21,1) 0%,rgba(86,239,82,1) 100%);" >未开播</text>
							</view>
							<view class=""  v-else>
								<text  class="startTag" style="background:linear-gradient(90deg,rgba(158,158,158,1) 0%,rgba(217,217,217,1) 100%);">已结束</text>
							</view>
							
							<view class="tips" v-for="(ite,ind) in item.labels" :key="ind">
								<text  class="mytips">{{ite}}</text>
							</view>
							<!-- <view class="tips">
								<text  class="mytips">标签标签标签</text>
							</view>
							<view class="tips">
								<text  class="mytips">标签标签标签</text>
							</view> -->
							
							
						</view>
						<view class="storeImg">
							<view class="storeLogo" style="margin-right: 8rpx;">
								<image :src="item.logo" mode=""></image>
							</view>
							<view class="">
								<view class="storeName">
									<text class="" v-if="item.shop_name==null"></text>
									<text class="" v-else>{{item.shop_name}}</text>
								</view>
								<view  style=" margin-top: -12rpx">
									<text style="color: #999999;font-size: 12px;" v-if="item.sub_title==null"></text>
									<text style="color: #999999; font-size: 12px;" v-else>{{item.sub_title}}</text>
								</view>
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		props:{
			liveData:Array,
			backLiveData:Array,
			liveShow: Boolean
		},
		data() {
			return {
				chTitle: 1,
				showList: [],
				roomIds:[],
				result:[]
			}

		},
		watch: {
			liveShow:{
				handler(val) {
					console.log('liveShow watch',val)
					this.changeTitle(val ? 1 : 2)
					this.chTitle = val ? 1 : 2
				},
				immediate: true
			}
		},
		mounted() {
			this.liveData.map(item=>{
				this.roomIds.push(item.room_id)
			});
			this.backLiveData.map(item=>{
				this.roomIds.push(item.room_id)
			})
			this.getLiveList()
			console.log("---------------------------------------");
			console.log(this.roomIds);
		},
		methods: {
			changeTitle(val) {
				console.log('changeTitle',val)
				this.chTitle = val;
				if(this.chTitle==1){
					this.showList=this.result.living;
				}else{
					this.showList=this.result.replay;
				}
				// this.getLiveList()
			},
			getLiveList() {
				App._postP("live.live/getIndexLiveRoom", {id: this.roomIds}).then(res => {
					//console.log("请求回来的数据");
					console.log(res);
					
					this.showList= res.data.data.living;
					this.result=res.data.data;
					this.changeTitle(this.chTitle)
				})
			},
			toLiveRoom(id,room_id){	
			//	console.log(id,room_id);
			App._postP("live.live/addLivePV",{id:room_id})	
			// #ifdef H5
			App.navigationTo({
				url:"pages/subPages/live/index"
			})
			//#endif
			// #ifdef MP-WEIXIN											
						let goodsParams={id};
						// goodsParams = this.$util.removeEmpty(goodsParams);						
			App.navigationTo({
				url:"pages/subPages/livePlayer/livePlayer?" + App.urlEncode(goodsParams),										 					
			})
			// #endif
			
			}
		}
	}
</script>

<style lang="less" scoped>
	text {
		font-size: 14px;
	}

	.commonTitle {
		color: #999999;
	}

	.activeLive {
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #333333 !important;

	}

	.liveList {
		margin: 16rpx 28rpx;

		.liveOne {
			background-color: #FFFFFF;
			display: flex;
			border-radius: 6rpx;
			padding: 8rpx;
			margin-top: 20rpx;

			.liveImg {
				margin-right: 20rpx;
				position: relative;

				.shareImg {
					width: 266rpx;
					height: 200rpx;
					border-radius: 6px;
				}
			}

			.storeImg {
				display: flex;
				margin-right: 15rpx;

				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					margin-top: 12rpx;

				}
			}

			.titleText {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				line-height: 36rpx;
			}

			.tips {	
				     max-width: 140rpx;
				     white-space: nowrap;
				     overflow: hidden;
				     text-overflow: ellipsis;
				
				
			}
			.mytips{
				background-color: #FFD93F;
				color: #8E7307;
				padding: 2rpx 10rpx;
				border-radius: 8rpx;
				
			}

			.allTips {
				display: flex;
				padding-bottom: 16rpx;
				view {
					margin-right: 12rpx;
					
				}
				text{
					font-size: 12px;
				}
			}

			.liveRight {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}

			.imgTip {
				margin: 10rpx;
				position: absolute;
				z-index: 2;
				top: 0;
				left: 0;
				background: rgba(0, 0, 0, 0.4);
				color: #FFFFFF;
				border-radius: 16rpx;
				display: flex;
                padding-right:  10rpx;
				.tipBack {
					margin-right: 10rpx;
					border-radius: 16rpx 0rpx 17rpx 16rpx;
					width: 42rpx;
					text-align: center;
				}

				.tipImg {
					width: 24rpx;
					height: 24rpx;
				}
			}

			.storeName {
				width: 250rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-top: 4rpx;
			}
			.startTag{
				padding: 2rpx 10rpx;
				border-radius: 8rpx;
				color:#FFFFFF;
				
			}
			.storeLogo{
			
				
			}
			.footLive{
				&>text{
					margin: 0;
				}
			}
		}
	}
</style>
