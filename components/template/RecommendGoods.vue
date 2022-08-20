<!-- 
	推荐商品组件 by 杨智源
 -->
<template>
	<view v-if="goodsListData">
		<view class="recommend-container">
			<view v-if="isShowTitle" class="module-title-w">{{titleType===1?'猜你喜欢':'推荐购买'}}
				<view class="select-nav-items">
					<image src="/static/images/br1.png"  class="main-bg-color" mode=""></image>
				</view>
			</view>
			<view :class="recommendclass===1?'recommend-bg':'module-content'">
				<GoodsList :item-data="goodsListData" :item-style="itemStyle"></GoodsList>
			</view>
		</view>
		<Copyright v-if="soldoutype!==1 && isShowCopyRight"></Copyright>
	</view>
</template>

<script>
	import GoodsList from "@/components/page/pageComponents/Goods.vue"
	import Copyright from "@/components/template/Copyright.vue"
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				goodsListData: null
			};
		},
		props: {
			isShowTitle: {
				type: Boolean,
				default: true
			},
			bargainId: {
				type: Number,
				default: -1
			},
			goodsId: {
				type: Number,
				default: -1
			},
			activeId: {
				type: Object,
				default () {
					return null
				}
			},
			couponId: {
				type: String,
				default: ""
			},
			recommendclass: {
				type: Number,
				default: 0
			},
			params: {
				type: Object,
				default () {
					return {}
				}
			},
			titleType: {
				type: Number,
				default: 0
			},
			soldoutype: {
				type: Number,
				default: 0
			},
			isShowCopyRight: {
				type: Boolean,
				default: true
			}
		},
		components: {
			GoodsList,
			Copyright
		},
		computed: {
			itemStyle() {
				let itemStyle = {
						display: "3",
						margincol: "10",
						marginrow: "15"
					},
					is_goods_long = this.settingData.is_goods_long;
				// 判断推荐商品列表是否存在，使用长方形样式
				if (is_goods_long && Array.isArray(is_goods_long) && is_goods_long.indexOf("1") != "-1") {
					itemStyle.display = "1-2"
				}
				return itemStyle
			}
		},
		onLoad() {

		},
		mounted() {
			this.getGoodsList(this.goodsId, this.couponId,this.bargainId);
		},
		methods: {
			getGoodsList(goods_id, coupon_id,bargain_id) {
				let _this = this,
					activeId = _this.activeId,
					params = activeId ? activeId : Object.assign({
						goods_id,
						coupon_id,
						bargain_id
					}, _this.params),
					url = activeId ? "redenvelopes.Redenvelopes/getRecommendGoods" : "goods/recommendGoods";
				App._post_form(url, {
					...params,
					no_login: 1
				}, res => {
					let data = res.data;
					if (data.length > 0) {
						if (_this.soldoutype === 1) {
							data = data.splice(0, 2);
						}
						_this.goodsListData = data.map(val => {
							val.goods_image = val.image[0].file_path;
							val.goods_price = val.spec_type === 20 ? val.goods_min_price : (val.sku[0] ? val.sku[0].goods_price : "");
							val.line_price = val.sku[0].line_price;
							return val
						})
						_this.goods_id = goods_id;
						_this.$nextTick(function() {
							_this.$emit("onReady")
						})
					}
				});
			}
		}
	}
</script>

<style>
	.recommend-bg {
		background: #FFFFFF;
	}

	.select-nav-items {
		position: absolute;
		left: 50%;
		top: 27%;
		width: 56upx;
		height: 10upx;
		transform: translate(-50%);
	}

	.select-nav-items image {
		width: 100%;
		height: 100%;
	}
</style>
