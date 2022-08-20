<template>
	<view class="view-content" :style="themeColor">
		<block v-if="data.length>0">
			<page-header class="page-header" :contentShow="false"></page-header>
			<view class="group-goods-box">
				<view class="group-goods padding-box" v-for="(item,index) in data" :key="index" @click="toGoodsInfo(item.goods_id, item.groups_id)">
					<block v-if="item.status&&item.status==1">
						<view class="goods-list dis-flex flex-dir-row flex-x-between flex-y-center border-line">
							<view class="img-logo">
								<view class="group-num">{{item.group_number}}人团</view>
								<image v-if="item.image" class="goods-img" :src="item.image['file_path']" mode=""></image>
							</view>
							<view class="goods-info" style="width: 0;flex-grow: 1;">
								<view class="title twolist-hidden">
									{{item.goods_name}}
								</view>
								<view class="desc dis-flex flex-dir-column">
									<view class="dis-flex flex-dir-row flex-x-between flex-y-center" style="margin: 10upx 0;">
										<text class="now">{{settingData.currency}}{{item.groups_price}}</text>
										<text class="num">已拼{{item.already_spell}}件</text>
									</view>
									<view class="price dis-flex flex-dir-row flex-x-between">
										<text class="old">单买价: {{item.original_price}}</text>
										<view class="go-group">去拼团</view>
									</view>
								</view>
							</view>
						</view>
					</block>
					<block v-else>
						<Abnor></Abnor>
					</block>
				</view>
			</view>
		</block>
		<block v-else>
			<Abnor></Abnor>
		</block>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import PageHeader from "@/components/template/PageHeader.vue"
	import Abnor from "@/components/template/Abnor.vue"
	export default {
		data() {
			return {
				data: []
			};
		},
		components: {
			PageHeader,
			Abnor
		},
		computed: {

		},
		onLoad(e) {

		},
		onShow() {
			this.getGroupsDetail()
		},
		mounted() {

		},
		methods: {
			getGroupsDetail(order_id) {
				let _this = this;
				App._get('groups.Groups/getGroupsGoodList', {
					
				}, function(result) {
					_this.setData(result.data || {});
				}, (err) => {
					if (err.data.code === 0) {
						uni.navigateBack({
							delta: 1
						});
					}
				});
			},
			toGoodsInfo(goods_id, group_id) {
				App.navigationTo({
					url: "pages/subPages/goods/index/index?goods_id=" + goods_id + (!!group_id ? '&group_id=' + group_id : '')
				})
			}
		},
		/**
		 * 显示/隐藏 返回顶部按钮
		 */
		onPageScroll(e) {

		}
	}
</script>

<style>
	.view-content {
		padding-bottom: 30rpx;
	}

	.page-header .pages-header {
		padding-top: 220upx;
	}

	.padding-box {
		padding: 30upx;
		margin-left: 30upx;
		margin-right: 30upx;
		border-radius: 6upx;
		background: #FFFFFF;
		margin-bottom: 30upx;
	}

	.group-goods-box {
		margin-top: -220rpx;
	}
	// #ifdef H5
	.group-goods-box{
		margin-top: 0 !important;
	}
	// #endif

	.group-goods {
		position: relative;
		z-index: 2;
	}

	.group-goods .goods-list .img-logo {
		position: relative;
		font-size: 0;
	}

	.group-goods .goods-list .img-logo .goods-img {
		width: 200upx;
		height: 200upx;
		border-radius: 6upx;
		margin-right: 28upx;
	}

	.group-goods .goods-list .img-logo .group-num {
		position: absolute;
		top: 0;
		left: 0;
		font-size: 24upx;
		line-height: 38upx;
		color: #FFFFFF;
		width: 76upx;
		height: 38upx;
		background: linear-gradient(90deg, rgba(254, 80, 79, 1), rgba(254, 133, 79, 1));
		/* box-shadow:0 2upx 10upx 0 rgba(254,80,79,0.54); */
		border-radius: 6upx 0 6upx 0;
		z-index: 2;
		text-align: center;
	}

	.group-goods .goods-info .title {
		color: #000000;
		font-size: 28upx;
		height: 80upx;
		font-weight: 400;
		line-height: 40upx;
	}

	.group-goods .goods-info .now {
		color: #FE504F;
		font-size: 34upx;
	}

	.group-goods .goods-info .old {
		font-size: 24upx;
		color: #999999;
		align-self: flex-end;
	}

	.group-goods .goods-info .num {
		font-size: 24upx;
		color: #999999;
		width: 126upx;
		text-align: center;
		white-space: nowrap;
	}

	.group-goods .goods-info .go-group {
		width: 126upx;
		height: 50upx;
		text-align: center;
		line-height: 50upx;
		background: linear-gradient(90deg, rgba(254, 80, 79, 1), rgba(254, 133, 79, 1));
		box-shadow: 0 2upx 10upx 0 rgba(254, 80, 79, 0.54);
		border-radius: 25upx;
		color: rgba(255, 255, 255, 1);
		font-size: 24upx;
	}
</style>
