<!-- 
  优惠券 by 缪启峙
  coupontype: "is_use"可用 "not_use""不可用
  couponList:优惠券列表[]
  iscouponChecked:是否打开优惠券选择 0不打开 1打开
  radioChange:如打开优惠券选择 父调用方法
 -->
<template>
	<view class="page">
		<view class="coupon-main">
			<block v-if="!!couponList&&couponList.length>0">
				<view class="coupon-list-able">
					<radio-group @change="radioChange">
						<label v-for="(item, index) in newCouponList" :key="index">
							<!-- 可用 -->
							<view class="coupon-items-able" v-if="coupontype==='is_use'" @click="showDetail">
								<block v-if="showType==='coupon' || iscouponChecked===1">
									<view class="coupon-top">
										<view class="price-title dis-flex">
											<view class="price-content f-36" v-if="item.coupon_type===10 || item.coupon_type===30 || item.coupon_type===40">{{settingData.currency}}{{item.reduce_price}}</view>
											<view class="price-content f-36" v-if="item.coupon_type===20">{{item.discount}}折</view>
											<view class="title-content dis-flex">
												<view class="full f-22" v-if="item.coupon_type===10">{{appCoupon.coupon_reduction}}</view>
												<view class="full f-22" v-if="item.coupon_type===20" :class="item.coupon_type===20?'discount':''">{{appCoupon.coupon_rebate}}</view>
												<view class="full f-22" v-if="item.coupon_type===30" :class="item.coupon_type===30?'freight':''">{{appCoupon.coupon_freight}}</view>
												<view class="full f-22" v-if="item.coupon_type===40" :class="item.coupon_type===40?'freight':''">{{appCoupon.coupon_random}}</view>
												<view class="title f-30">{{item.name}}</view>
											</view>
										</view>
										<view class="full-date dis-flex f-26">
											<view class="full-content">{{item.rule===1?'无门槛':'满'+item.rule_min_money+'可用'}}</view>
											<view class="date-content">有效期:{{item.expire_type===20?item.stime:(item.stime+'-'+item.etime)}}</view>
										</view>
									</view>
									<view class="coupon-btm f-22">
										{{!!item.use_desc?item.use_desc:'暂无使用说明'}}
										<view class="dot dot-left"></view>
										<view class="dot dot-right"></view>
									</view>
									<block v-if="iscouponChecked===1">
										<view class="ab-raido">
											<radio class="radio-style" :value="item.user_coupon_id+''" :checked="index === currentindex" />
										</view>
										<view class="iconfont zdyradio" :class="currentindex===index?'icon-roundcheck radio-check':'icon-round radio-nocheck'"></view>
									</block>
								</block>
								<!-- 红包列表 -->
								<block v-if="showType==='bonus' && iscouponChecked !== 1">
									<view class="coupon-item col-f dis-flex flex-x-between flex-y-center m-top12">
										<view class="coupon-price t-c">
											<view class="dis-flex flex-y-line flex-x-center">
												<view class="f-22" style="margin-right:4rpx">{{settingData.currency}}</view>
												<view class="f-40">{{item.reduce_price}}</view>
											</view>
											<view class="f-24 onelist-hidden">{{item.rule === 0?`满${$util.removePoint(item.rule_min_money)}元可用`:"无门槛"}}</view>
										</view>
										<view class="coupon-info t-l flex-box p">
											<view class="coupon-name f-28">{{item.name}}</view>
											<view class="coupon-time f-24">有效期:{{item.stime+'-'+item.etime}}</view>
										</view>
										<view class="coupon-receive f-22" @click="navigationTo(`pages/subPages/user/coupon/receive?bonus_id=${item.bonus_id}`)">立即使用</view>
									</view>
								</block>
							</view>
							<!-- 不可用 -->
							<view class="coupon-items-able not_use" v-if="coupontype==='not_use'">
								<block v-if="showType==='coupon'">
									<view class="coupon-top">
										<view class="price-title dis-flex">
											<view class="price-content f-36 not-coupon-c9" v-if="item.coupon_type===10 || item.coupon_type===30 || item.coupon_type===40">{{settingData.currency}}{{item.reduce_price}}</view>
											<view class="price-content not-coupon-c9 f-36" v-if="item.coupon_type===20">{{item.discount}}折</view>
											<view class="title-content dis-flex">
												<view class="full f-22" style="background-color: #CCCCCC;" v-if="item.coupon_type===10">{{appCoupon.coupon_reduction}}</view>
												<view class="full f-22" style="background-color: #CCCCCC;" v-if="item.coupon_type===20">{{appCoupon.coupon_rebate}}</view>
												<view class="full f-22" style="background-color: #CCCCCC;" v-if="item.coupon_type===30">{{appCoupon.coupon_freight}}</view>
												<view class="full f-22" style="background-color: #CCCCCC;" v-if="item.coupon_type===40">{{appCoupon.coupon_random}}</view>
												<view class="title f-30 not-coupon-c9 onelist-hidden">{{item.name}}</view>
											</view>
										</view>
										<view class="full-date dis-flex f-26">
											<view class="full-content">{{item.rule===1?'无门槛':'满'+item.rule_min_money+'可用'}}</view>
											<view class="date-content">有效期: {{item.expire_type===20?item.stime:(item.stime+'-'+item.etime)}}</view>
										</view>
									</view>
									<view class="coupon-btm  f-22">
										{{!!item.use_desc?item.use_desc:'暂无使用说明'}}
										<view class="dot dot-left"></view>
										<view class="dot dot-right"></view>
									</view>
									<view class="coupon-label" v-if="iscouponChecked === 0">
										<view class="labelstyle f-24" v-if="item.is_use===1">已使用</view>
										<view class="dis-flex flex-x-center flex-y-center labelstyle f-24" :class="item.state===2?'labelstyletop':''"
										 v-if="item.state===1 || item.state===2"><text class="tip-box">{{item.state===1?'已过期':'未到使用时间'}}</text></view>
									</view>
								</block>
								<!-- 红包列表 -->
								<block v-if="showType==='bonus'">
									<view class="coupon-item col-f dis-flex flex-x-between flex-y-center m-top12">
										<view class="coupon-price t-c">
											<view class="dis-flex flex-y-line flex-x-center">
												<view class="f-22" style="margin-right:4rpx">{{settingData.currency}}</view>
												<view class="f-40">{{item.reduce_price}}</view>
											</view>
											<view class="f-24 onelist-hidden">{{item.rule === 0?`满${$util.removePoint(item.rule_min_money)}元可用`:"无门槛"}}</view>
										</view>
										<view class="coupon-info t-l flex-box p">
											<view class="coupon-name f-28">{{item.name}}</view>
											<view class="coupon-time f-24">有效期:{{item.stime+'-'+item.etime}}</view>
										</view>
									</view>
								</block>
							</view>
						</label>
					</radio-group>
				</view>
			</block>
			<block v-else>
				<view class="no-data">
					<Abnor :abnor="showType==='coupon'?'COUNPONS':'BONUS'"></Abnor>
				</view>
			</block>
		</view>
	</view>
</template>
<script>
	import Abnor from "@/components/template/Abnor.vue"
	export default {
		data() {
			return {
				currentindex: -1
			}
		},
		computed: {
			newCouponList() {
				if (!!this.couponList && this.couponList.length > 0) {
					let couponList = this.couponList.map((val => {
						if (val.stime.indexOf("/") === -1) {
							val.stime = this.$util.formatTime(val.stime, 'date', '/');
							val.etime = this.$util.formatTime(val.etime, 'date', '/');
						}
						return val;
					}));
					return couponList;
				}
			}
		},
		methods: {
			radioChange(evt) {
				let indexId = evt.target.value,
					currentCoupon = this.couponList.filter(val => val.user_coupon_id === Number(indexId))[0];
				this.currentindex = this.couponList.findIndex(val => val.user_coupon_id === Number(indexId));
				this.$emit("radioChange", currentCoupon);
			},
			getBonusTime(item) {
				let _this = this,
					{
						available_type,
						available_time
					} = item;
				if (available_type === 10) {
					return `有效期:${available_time.map(val=>_this.$util.formatTime(val, "date", ".")).join("-")}`;
				} else {
					return `领取后${available_type === 20?"当":"次"}日起${available_time}天内可用`;
				}
			},
			showDetail(){
				if(this.iscouponChecked !== 1){
					// App.navigationTo({
					// 	url:"pages/subPages/user/coupon/receive?"
					// })
				}
			}
		},
		components: {
			Abnor
		},
		watch: {

		},
		props: {
			coupontype: {
				type: String,
				default: "is_use"
			},
			couponList: {
				type: Array,
				default: () => []
			},
			iscouponChecked: {
				type: Number,
				default: null
			},
			showType: {
				type: String,
				default: "coupon"
			}
		},

	}
</script>

<style>
	.coupon-list-able {
		padding: 0 30upx;
	}

	.coupon-items-able {
		position: relative;
		margin-top: 22upx;
		background-color: #FFFFFF;
		border-radius: 6upx;
	}

	.coupon-items-able:last-child {
		margin-bottom: 22upx;
	}

	.coupon-items-able .coupon-top {
		padding: 40upx 0 30upx 0;
	}

	.price-title {
		margin-bottom: 30upx;
	}

	.price-title .price-content {
		width: 30%;
		text-align: center;
		/* padding: 0 44upx; */
		color: #FD5352;
		font-weight: 600
	}

	.title-content {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.title-content .full {
		color: #FFFFFF;
		border-radius: 6upx;
		padding: 0 10rpx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		background-color: #FD5352;
		margin-right: 10upx;
	}

	.title-content .title {
		color: #333333;
		font-weight: 600;
		width: 280upx;
	}

	.full-date {
		color: #999999;
	}

	.full-date .full-content {
		width: 30%;
		text-align: center;
	}

	.full-date .date-content {
		flex: 1;
	}

	.coupon-btm {
		position: relative;
		border-top: 1px dashed #EEEEEE;
		padding: 18upx 44upx;
		color: #999999;
	}

	.dot {
		position: absolute;
		top: -10upx;
		width: 20upx;
		height: 20upx;
		border-radius: 20upx;
		background-color: #f7f7f7;
	}

	.dot-left {
		left: -10upx;
	}

	.dot-right {
		right: -10upx;
	}

	.ab-raido {
		width: 100%;
		height: 100%;
		position: absolute;
		right: 0;
		left: 0;
		top: 0;
		opacity: 0;
	}

	.zdyradio {
		position: absolute;
		right: 18upx;
		top: 18upx;
		font-size: 44upx;
	}

	.radio-check {
		color: #FD5352;
	}

	.radio-nocheck {
		color: #CCCCCC;
	}

	.not-coupon-c9 {
		color: #999999 !important;
	}

	.not-coupon-cc {
		color: #CCCCCC !important;
	}

	.coupon-main .coupon-label {
		position: absolute;
		right: -50upx;
		top: 20upx;
		border-bottom: 60upx solid #CCCCCC;
		border-left: 60upx solid transparent;
		border-right: 60upx solid transparent;
		width: 80upx;
		transform: rotate(45deg);
	}

	.labelstyle {
		position: absolute;
		right: 0;
		top: 10upx;
		color: #FFFFFF;
	}

	.labelstyletop {
		top: 4px;
		font-size: 23rpx;
		text-align: center;
	}

	.labelstyletop .tip-box {
		line-height: 1;
	}

	.discount {
		background-color: #48CFAD !important;
	}

	.freight {
		background-color: #5E80DA !important;
	}

	/* 设置scroll-view容器高度 */
	.no-data {
		padding-top: 80upx;
		box-sizing: border-box;
	}

	.coupon-list-able label {
		width: 100%;
	}


	/* 红包 */
	.coupon-item {
		width: 100%;
		box-sizing: border-box;
		height: 120rpx;
		padding: 0 30rpx;
		margin-bottom: 12rpx;
		background-size: 100% 100%;
		border-radius: 10rpx;
		background-image: url("~@/static/images/goods/coupon-bg.png");
	}
	
	.not_use .coupon-item{
		background: #E0E0E0;
	}

	.coupon-price {
		width: 23%;
	}

	.coupon-info {
		padding-left: 12rpx;
	}

	.coupon-item:last-child {
		margin-bottom: 0;
	}

	.coupon-receive {
		padding: 6rpx 10rpx;
		border: 1rpx solid #FFFFFF;
		border-radius: 50px;
	}
</style>
