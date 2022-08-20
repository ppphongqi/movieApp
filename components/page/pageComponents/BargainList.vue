<template>
	<view v-if="filterItemData.length > 0" class="keep-start dis-flex flex-dir-column flex-x-center flex-y-center">
		<view class="bargin-goods list padding-box">
			<block v-for="(item,index) in filterItemData" :key="index">
				<view class="goods-list dis-flex flex-dir-row flex-x-between flex-y-center border-line" @click="toGoodsInfo(item.goods_id,item.bargain_id)">
					<view class="img-logo">
						<image class="goods-img" :src="item.image && item.image[0] ? item.image[0]['file_path'] : ''" mode=""></image>
					</view>
					<view class="goods-info" style="width: 0;flex-grow: 1;">
						<view class="title twolist-hidden">
							{{item.goods_name}}
						</view>
						<view class="desc">
							<view class="content">
								{{item.success_num}}人砍价成功
							</view>
							<view class="dis-flex flex-dir-row flex-y-center f-24" style="margin: 10upx 0 -10upx;color:#9E9B9D;">
								单买价<text class="col-3 f-24">{{settingData.currency}}{{item.goods_price}}</text>
							</view>
							<view class="price dis-flex flex-dir-row flex-x-between flex-y-line">
								<view class="now f-26">可砍至: {{settingData.currency}}<text class="price-font-family f-w">{{item.bargain_price}}</text></view>
								<view class="go-bargin help-bg-color"	>去砍价</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		props: {
			itemData: Array
		},
		data() {
			return {
				// filterData: []
			};
		},
		components: {

		},
		computed: {
			filterItemData() {
				let filterData = this.itemData.filter(item => {
					return item.is_use == 2;
				})
				return filterData;
			}
		},
		onLoad(e) {
			uni.setNavigationBarColor({
				 frontColor: '#6e70ff',
					backgroundColor: '#13ff36',
			})
		},
		onShow() {

		},
		mounted() {

		},
		methods: {
			toGoodsInfo(goods_id,bargain_id) {
				App.navigationTo({
					url: "pages/subPages/goods/index/index?goods_id=" + goods_id + '&bargain_id=' + bargain_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.keep-start{
		.padding-box.list {
			padding: 0 30upx;
			margin-left: 30upx;
			margin-right: 30upx;
			border-radius: 6upx;
			background: #FFFFFF;
			// margin-bottom: 8upx;
		}
		
		.bargin-goods.list {
			.line-gap {
				display: inline-block;
				width: calc(100%);
				margin: 30upx auto 15upx;
				height: 1px;
				background: rgba(238, 238, 238, 1);
			}
			
			position: relative;
			width: 100%;
			z-index:1;
			.goods-list{
				padding: 30upx 0;
				&:not(:first-child){
					border-top: 1px solid #eeeeee;
				}
			}
			.content {
				display: inline-block;
				padding: 0 15upx;
				height: 30upx;
				font-size: 20upx;
				color: #FC5030;
				line-height: 30upx;
				background: rgba(255, 236, 227, 1);
				border-radius: 15upx;
			}
		}
		
		.bargin-goods .goods-list .img-logo {
			position: relative;
			font-size: 0;
		}
		
		.bargin-goods .goods-list .img-logo .goods-img {
			width: 200upx;
			height: 200upx;
			border-radius: 6upx;
			margin-right: 28upx;
		}
		
		.bargin-goods .goods-info .title {
			color: #000000;
			font-size: 28upx;
			height: 80upx;
			font-weight: 400;
			line-height: 40upx;
			margin-bottom: -5upx;
		}
		
		.bargin-goods .now {
			color: #FE504F;
			align-self: flex-end;
		}
		
		.bargin-goods .goods-info .old {
			font-size: 24upx;
			color: #333333;
		}
		
		.bargin-goods .goods-info .num {
			font-size: 24upx;
			color: #999999;
			width: 126upx;
			text-align: center;
			white-space: nowrap;
		}
		
		.bargin-goods .goods-info .go-bargin {
			width: 126upx;
			height: 50upx;
			text-align: center;
			line-height: 50upx;
			background: #FC5030;
			// box-shadow:0 2upx 10upx 0 rgba(254,80,79,0.54);
			border-radius: 25upx;
			color: rgba(255, 255, 255, 1);
			font-size: 24upx;
		}
	}
</style>
