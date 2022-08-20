<template>
	<view class="">
		<!-- #ifdef MP-WEIXIN -->
		<view class="container" :style="themeColor">
			<block v-if="loadlogo">
				<block v-if="!!liveList&&liveList.length>0">
					<live-componets :liveList="liveList"></live-componets>
					<view style="padding-bottom: 10px; background-color: #F8F8F8;">
						<load-more :isMore="loadingMore"></load-more>
					</view>
				</block>
				<block v-else>
					<Abnor v-if="liveList.length===0" :title="'亲，还没有直播哦！'"></Abnor>
				</block>
			</block>
			<!-- 推荐购买 -->
			<view class="recommend-goods m-top20" style="padding: 40upx 0 96upx;">
				<recommend-goods :recommendclass="RecommendClass" :isShowCopyRight="false" :goods-id="detail.goods_id"></recommend-goods>
			</view>
			<!-- 加载等待 -->
			<page-loading ref="loading"></page-loading>
			<!-- 底部菜单 -->
			<DiyTab></DiyTab>
		</view>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<popup-view :show="showTip" type="center" @clickmask="showTip = false">
			<view class="t-c col-f ">
				<view class="detail t-c col-f m-btm30" >
					<image :src="image.length && image[0].file_path?image[0].file_path:''" ></image>
				  <view class="word col-3 f-28 padding-all-box36">
					  <view class="">
					  	提示
					  </view>
					  <view class="m-top-btm20">
					  	{{prompt_copy}}
					  </view>
				  	
				  </view>
				 
				</view>
				<text class="iconfont icon-round_close_light " style="font-size:24px;" @click="close">
					
				</text>
			</view>
			
			
		</popup-view>
		<!-- #endif -->
		
	</view>
	
</template>

<script>
	import App from "@/common/js/app.js";
	import liveComponets from "@/components/template/live.vue";
	import Abnor from "@/components/template/Abnor.vue";
	import RecommendGoods from "@/components/template/RecommendGoods.vue";
	import DiyTab from "@/components/template/TabBar.vue";
	import pageShare from "@/common/js/pageShareMixin.js";
	import PopupView from "@/components/template/PopManager.vue"

	export default {
		mixins: [pageShare],
		data() {
			return {
				curpage: 1,
				liveList: [],
				loadingMore: false,
				loadlogo: false,
				room_id: 0,
				prompt_copy:'',
				image:[],
				showTip:false
			}
		},
		props: {

		},
		components: {
			liveComponets,
			Abnor,
			RecommendGoods,
			DiyTab,
			PopupView
		},
		computed: {

		},
		methods: {
			close(){
				this.showTip=false
				App.navigationTo({
					url: "pages/mainPages/index/index"
				})
			},
			getShare() {
				let _this = this
				App._get('live.Live/liveSet', {}, res => {
					let source = App.getClientType()
					uni.setNavigationBarTitle({
						title:res.data.live_title?res.data.live_title:''
					})
					_this.shareData = _this.getPageShareData("live/index", {
						cover_image: source = 2 ?  res.data.live_sapp_img :res.data.live_wechat_img ,
						describe: res.data.live_text,
						title: res.data.live_title
					});

				})
			},
			getLivelist(page = 1, isload = false) {
				let _this = this,
					requestData = {
						page
					};
				App._post_form('live.Live/liveList', requestData, res => {
					let wxliveList = res.data.data;
					if (isload) {
						if (wxliveList.length > 0) {
							_this["liveList"].push(...wxliveList);
						} else {
							_this.loadingMore = true;
						}
					} else {
						_this["liveList"] = wxliveList;
						_this.loadingMore = wxliveList.length === 0 || wxliveList.length <= 10;
						_this.loadlogo = true;
					}
				})
				setInterval(() => {
					App.hideLoading();
				}, 1000)
			}
		},
		onPullDownRefresh() {
			this.getLivelist();
			setTimeout(function() {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
			}, 1000);
		},
		onLoad() {
			let isShowModal = false;
			this.getShare()
			// #ifdef MP-WEIXIN
			this.getLivelist()
			isShowModal = true;
			// #endif
			if (!isShowModal) {
				
				console.log(this.settingData,'设置信息')
			   const {live:{image:image=[],prompt_copy}} = this.settingData;
			   this.image = image
			   this.prompt_copy = prompt_copy
			   if(image.length==0 && !prompt_copy) {
				  uni.showModal({
				  	title: '提示',
				  	content: '此平台暂无直播！',
				  	showCancel: false,
				  	success: function(res) {
				  		if (res.confirm) {
				  			App.navigationTo({
				  				url: "pages/mainPages/index/index"
				  			})
				  		}
				  	}
				  }); 
			   }else {
				   console.log('this.showTip ')
				   this.showTip  = true
				    console.log( this.showTip,'this.showTip ')
				   
			   }
				
			}
		},
		onShow() {
			App.customDefaultShare(this.globalSaveRefereeId,`${App.siteInfo.siteroot}h5/#/pages/subPages/live/index`)
		}
		// onR{}eachBottom() {
		// 	let _this = this;
		// 	_this.getLivelist(++_this.curpage, true);
		// }
	}
</script>

<style lang="scss">
	page {
		background-color: #F8F8F8;
	}
    .detail {
		width: 70vw;
		height: 30vh;
		position: relative;
		image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.word {
			width: 50%;
			box-sizing: border-box;
			background-color: rgba(255,255,255,0.4);
			position: absolute;
			top:10vh ;
			border-radius: 20rpx;
			left: 17.5vw;
		}
	}
	.container {
		margin-top: 20rpx;
	}
</style>
