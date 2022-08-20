<template>
	<view :style="themeColor">
		<view class="header-bg p-r" :style="{'background-image':getImageRoot('34.png','url')}">
			<!-- <view class="return-btn iconfont icon-back" @click="pageback"></view> -->
		</view>
		<view class="record-content">
			<view class="record-title f-40 col-3 t-c f-w">已有{{data['number']}}人参与抽奖</view>
			<view scroll-y="true" class="scrollview">
				<view class="record-list bor-radius-10upx b-f m-left-right-30">
					<block v-for="(item,index) in data.data" :key="index">
						<view class="list-item m-left-right-30 p-top-bom-40 border-line border-bottom dis-flex flex-y-center flex-x-between">
							<view class="list-left dis-flex flex-y-center">
								<view class="avatar" :style="{'background-image':'url('+item.avatarUrl+')'}"></view>
								<view class="userInfo">
									<view class="nickname col-3 f-28">{{item.nickName}}</view>
									<view class="date col-9 f-24">{{item.create_time}}</view>
								</view>
							</view>
							<view class="list-right f-24 ">{{item.luck_code}}</view>
						</view>
					</block>
					<load-more :showLoadmore="!showLoadmore"></load-more>
				</view>
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import LoadMore from "@/components/template/Loadmore.vue";
	export default {
		data() {
			return {
				data: null,
				page:1,
				luck_id:0,
				period_id:0,
				showLoadmore: false, //是否显示加载状态
			};
		},
		onLoad(e) {
			App.showLoading()
			this.luck_id=e.luck_id;
			this.period_id=e.period_id;
			this.getWinnum(e.luck_id,e.period_id)
		},
		onShow() {

		},
		components: {
			LoadMore
		},
		mounted() {

		},
		methods: {
			getWinnum(luck_id,period_id,page=1,isPage = false) {
				let _this = this;
				App._post_form('luck.luck/getCodeList', {
					page,
					luck_id,
					period_id
				}, res => {
					if (isPage === true) {
						_this.data.data.push(...res.data.data);
						_this.setData({
							showLoadmore: res.data.data.length == res.data.per_page
						});
					}else{
						_this.setData(res)
					}
				},false,()=>{
					App.hideLoading()
				})
				
			},
			pageback() {
				uni.navigateBack({
					delta: 1,
				})
			}
		},
		onReachBottom() {
			// 已经是最后一页
			if (this.page >= this.data.last_page) {
				// this.no_more = true;
				return false;
			}
			// 加载下一页列表
			this.getWinnum(this.luck_id,this.period_id, ++this.page, true);
		},
	}
</script>

<style>
	.header-bg {
		width: 100%;
		height: 486upx;
		background-size: 100%, 486upx;
		background-repeat: no-repeat;
	}

	.return-btn {
		position: absolute;
		left: 30upx;
		top: 60upx;
		font-size: 42upx;
	}

	.record-content {
		position: relative;
		margin-top: -300upx;
	}

/* 	.record-list {
		height: 75vh;
	} */
	.scrollview{
		height: 75vh;
	}
	.record-content .record-title {
		margin-bottom: 60upx;
	}

	.list-left .avatar {
		width: 60upx;
		height: 60upx;
		background-size: 60upx 60upx;
		border-radius: 50%;
		margin-right: 12upx;
	}

	.list-right {
		color: #FE504F;
	}
</style>
