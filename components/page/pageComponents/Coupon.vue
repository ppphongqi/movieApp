<template>
	<view class="b-f">
		<scroll-view scroll-x="true" v-if="couponList.length">
			<view class="coupon-box dis-flex" :style="{'padding':itemStyle.margincol+'px 7px'}">
				<block v-for="(item,index) in couponList" :key="index">
					<view class="coupon-items" @click="receiveCoupon(item,index,item.is_receive)">
						<view class="coupon-style">
							<image :src="item.is_receive === 1 || item.status !== 1?'/static/images/ady-coupon.png':'/static/images/not-coupon.png'"
							 mode="" class="coupon-br"></image>
							<image v-if="item.is_receive === 1" src="/static/images/ady-couponlg.png" mode="" class="coupon-lg"></image>
							<view class="coupon-content t-c dis-flex flex-dir-column flex-x-center" :class="{'isReceive':item.is_receive === 1  || item.status !== 1}">
								<view class="coupon-title f-24 f-w">{{item.name}}</view>
								<view class="coupon-price f-30 f-w">{{item.coupon_type === 20?"折":settingData.currency}}{{item.coupon_type === 40 ? (item.min+"-"+item.max) : item.coupon_type === 20 ? item.discount : item.reduce_price}}</view>
								<view class="coupon-label f-24">{{item.rule === 0 ? coupon_price[item.coupon_type]['textRule']+item.rule_min_money:''}}{{coupon_price[item.coupon_type]['textPrev']}}{{item.coupon_type === 40 ? (item.min+"-"+item.max) : item.coupon_type === 20 ? item.discount : item.reduce_price}}{{coupon_price[item.coupon_type]['textLast']}}</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				coupon_price: {
					10: {
						textRule: '满',
						textPrev: '减免',
						textLast: '元'
					},
					20: {
						textRule: '满',
						textPrev: '打',
						textLast: '折'
					},
					30: {
						textRule: '满',
						textPrev: '减免',
						textLast: '元'
					},
					40: {
						textRule: '满',
						textPrev: '随机减',
						textLast: '元'
					}
				},
				couponList: [],
			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemData: Array
		},
		mounted() {
			if (this.itemData.length > 0) {
				this.couponList.splice(0, this.itemData.length, ...this.itemData);
			}
		},
		watch: {
			itemData(newValue, oldValue) {
				this.couponList.splice(0, this.itemData.length, ...this.itemData);
			}
		},
		methods: {
			async receiveCoupon(coupon, index, is_receive) {
				if (is_receive === 1) return;
				if (coupon.status !== 1) {
					uni.showToast({
						icon: "none",
						title: `该${this.appCoupon.coupon_title}暂时无法领取~`
					})
					return;
				}
				uni.showLoading();
				let _this = this;
				let location = {}
				if([1,2].includes(coupon.area_restrictions)) {
					location = await App.getLocation() || {}
				}
				App._post_form('user.coupon/receive', {
					coupon_id: coupon.coupon_id,
					lat: location.latitude || '',
					lng: location.longitude || ''
				}, (result) => {
					_this.couponList[index].is_receive = 1;
					if (coupon.suit_goods_type === 1) {
						uni.showModal({
							title: "领取成功!",
							content: `快去使用您的${this.appCoupon.coupon_title}吧`,
							cancelText: "以后再说",
							confirmText: "立即使用",
							success(res) {
								if (res.confirm) {
									App.navigationTo({
										url: `pages/subPages/coupon/goods?coupon_id=${coupon.coupon_id}`
									})
								}
							}
						})
					} else {
						App.showSuccess(result.msg);
					}
				}, null, () => {
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style>
	.coupon-box {
		background: #FFFFFF;
		flex-wrap: nowrap;
	}

	.coupon-items {
		width: 320upx;
		height: 150upx;
		margin-right: 20upx;
	}

	.coupon-items .coupon-style {
		position: relative;
		width: 320upx;
		height: 150upx;
	}

	.coupon-items .coupon-style .coupon-br {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
	}

	.coupon-items .coupon-style .coupon-lg {
		position: absolute;
		right: 10%;
		top: 35%;
		width: 56upx;
		height: 52upx;
	}

	.coupon-style .coupon-content {
		width: 100%;
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		transform: translateX(-50%);
		z-index: 2;
	}

	.coupon-title {
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.coupon-price {
		color: rgb(253, 79, 77);
		/* margin: 4rpx 0; */
	}

	.isReceive .coupon-title,
	.isReceive .coupon-price {
		color: rgb(207, 207, 207) !important;
	}

	.isReceive {
		color: rgb(207, 207, 207) !important;
	}
</style>
