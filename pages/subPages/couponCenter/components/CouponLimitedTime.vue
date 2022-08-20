<template>
	<view class="c-limited-time-coupon">
		<!-- 头部 -->
		<view class="c-limited-time-coupon-header">
			<view class="c-limited-time-coupon-header__left">
				<image src="../static/images/icon-alarm-clock.png" style="width: 40rpx;height: 40rpx;"></image>
				<view class="c-limited-time-coupon-header__title">限时抢券</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<button class="c-limited-time-coupon-header__right btn-normal" open-type="share">
				<view class="c-limited-time-coupon-header__subtitle">邀请好友一起抢</view>
				<view class="c-limited-time-coupon-header__icon-share iconfont icon-122" style="font-size: 24rpx;">
				</view>
			</button>
			<!-- #endif -->
		</view>
		<!-- 头部 end -->
		<!-- 时间选择器 -->
		<scroll-view class="cate-scroll" scroll-x>
			<!-- 时间选择列表 -->
			<view class="cate-list">
				<view v-for="(item,index) in cCateData" :key="item.id" class="cate-item"
					@click="handleCateItemClick(index)">
					<view class="cate-card" :class="item.classStr">
						<view class="cate-card__text">{{item.text}}</view>
						<view class="cate-card__status">{{item.statusText}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 时间选择列表 end -->
		<!-- 优惠券列表 -->
		<scroll-view class="coupon-list-scroll" scroll-x>
			<view class="coupon-list">
				<view v-for="(item,index) in cCouponData" :key="item.id" class="coupon-item pr"
					@click="handleItemClick(item,index)">
					<view class="coupon-card" :class="item.classStr">
						<view class="coupon-card__left">
							<!-- 价格 -->
							<view class="coupon-card__price price-font-family">￥<text
									class="is-strong">{{item.couponPrice}}</text></view>
							<!-- 标题 -->
							<view class="coupon-card__title">{{item.title}}</view>
							<!-- 副标题 -->
							<view class="coupon-card__subtitle">{{item.subtitle}}</view>
							<!-- 进度 -->
							<view v-if="item.process >= 0" class="coupon-card__progress_wrapper">
								<u-line-progress inactive-color="#FFD0D0" active-color="#FF4444" :height="20"
									:percent="item.process">
									<view></view>
								</u-line-progress>
								<!-- 因为文字要居中 -->
								<view class="coupon-card__progress-text">已抢{{item.process}}%</view>
							</view>
						</view>
						<view class="coupon-card__right pr" @click.stop>
							<!-- 操作按钮 -->
							<button class="coupon-card__btn-op btn-normal"
								@click.stop="handleBtnClick(item,index)">{{item.btnText}}</button>
							<bind-mobile-button v-if="item.bindMobileVisible"></bind-mobile-button>
						</view>
					</view>
					<bind-mobile-button v-if="item.bindMobileVisible"></bind-mobile-button>
				</view>
			</view>
		</scroll-view>
		<!-- 优惠券列表 end -->
	</view>
</template>

<script>
	import BindMobileButton from '@/components/template/BindMobileButton.vue'
	import { couponItemConverter } from '@/common/js/dataConverter/couponItemConverter'

	export default {
		components: {
			BindMobileButton
		},
		props: {
			// 是否使用默认的数据转换器，如果为true可以直接传入接口的原始数据接口，如果为false，则需要在父组件将数据转换好再传入
			useDefaultDataConverter: {
				type: Boolean,
				default: true
			},
			// 优惠券数据
			couponData: {
				type: Array,
				default () {
					return []
				}
			},
			// 是否自动刷新时间段状态
			autoRefreshCateData: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				// 优惠券数据
				dCouponData: this.couponData,
				// 当前选中的分类的索引
				cateActive: 0,
				obj: {
					a: 1
				}
			}
		},
		watch: {
			couponData(val) {
				this.dCouponData = val
			}
		},
		computed: {
			// 格式化的分类数据
			cCateData() {
				// return [
				//     {
				//         id: 'time01',
				//         text: '16:40',
				//         statusText: '热抢中',
				//         classStr: 'is-active'
				//     }
				// ]
				const rs = this.dCouponData.map((item = {}, index) => {
					// 要考虑是否随着时间的流逝动态改变这个状态不??目前只是把开始时间 结束时间和服务器时间做了比较
					let statusText = '--'
					// -1:未知，0：未开始，1：热抢中，2：已结束
					let status = -1
					if (item.start_time > item.serve_time) {
						status = 0
						statusText = '未开始'
					} else if (item.start_time <= item.serve_time && item.end_time > item.serve_time) {
						status = 1
						statusText = '热抢中'
					} else if (item.end_time <= item.serve_time) {
						status = 2
						statusText = '已结束'
					}
					return {
						id: item.limit_time,
						text: item.limit_time,
						status,
						statusText,
						classStr: this.cateActive === index ? 'is-active' : ''
					}
				})
				return rs
			},
			// 格式化的优惠券列表数据
			cCouponData() {
				// return [
				//     {
				//         id: 'coupon1',
				//         // 优惠券类别
				//         type: 1,
				//         // 优惠券领取状态 0:未开始，1:进行中，2:已抢完
				//         status: 1,
				//         // 优惠券价格，有可能是？
				//         couponPrice: '?',
				//         // 优惠券title
				//         title: '无门槛',
				//         // 优惠券subtitle
				//         subtitle: '全品类券(除特列商品)',
				//         // 优惠券领取进度百分比
				//         process: 45,
				//         // 按钮文字
				//         btnText: '领取'
				//     }
				// ]
				return this.$util.deepGet(this.dCouponData, `${this.cateActive}.coupon_id`, []).map(item => {
					// 领取进度 如果小于0就不显示
					let process = -1
					// 发放数量限制-1就是无限制
					const totalNum = item.total_num || -1
					// 已经领取数量
					const receiveNum = item.receive_num || 0
					if (totalNum > 0) {
						process = (receiveNum / totalNum) * 100
						process = process > 100 ? 100 : process
						process = process.toFixed(0)
					}

					// 优惠券外层容器的classStr
					let classStr = ''
					if (process >= 100) {
						classStr += ' is-over'
					}

					return {
						...couponItemConverter(item),
						process,
						classStr,
						// 是否需要绑定手机号
						bindMobileVisible: item.is_mandatory_phone == 1 && !this.mainMixin_userInfo.mobile
					}
				})
			}
		},
		methods: {
			handleCateItemClick(index) {
				this.cateActive = index
			},
			handleItemClick(item, index) {
				if (item.bindMobileVisible) {
					uni.showToast({
						icon: 'none',
						title: '请先绑定手机号'
					})
					return
				}
				this.$emit('on-item-click', {
					item,
					index,
					cate: this.cCateData[this.cateActive],
					cateIndex: this.cateActive
				})
			},
			handleBtnClick(item, index) {
				if (item.bindMobileVisible) {
					uni.showToast({
						icon: 'none',
						title: '请先绑定手机号'
					})
					return
				}
				this.$emit('on-btn-click', {
					item,
					index,
					cate: this.cCateData[this.cateActive],
					cateIndex: this.cateActive
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-limited-time-coupon {
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
		background-color: #fff;
		padding-bottom: 20rpx;
	}

	// 头部
	.c-limited-time-coupon-header {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 92rpx;
		padding: 0 20rpx;
	}

	.c-limited-time-coupon-header__left {
		display: flex;
		align-items: center;
	}

	.c-limited-time-coupon-header__right {
		display: flex;
		align-items: center;
	}

	.c-limited-time-coupon-header__icon-time {
		color: #FF4444;
	}

	.c-limited-time-coupon-header__title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-left: 8rpx;
	}

	.c-limited-time-coupon-header__subtitle {
		font-size: 24rpx;
		color: #999;
		margin-right: 16rpx;
	}

	.c-limited-time-coupon-header__icon-share {
		color: #999;
	}

	// 头部 end
	// 时间段选择
	.cate-list {
		box-sizing: border-box;
		display: inline-flex;
		flex-wrap: nowrap;
		padding: 0 20rpx;
		margin-bottom: 30rpx;
	}

	.cate-item {
		&+& {
			margin-left: 20rpx;
		}
	}

	.cate-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 130rpx;
		height: 70rpx;
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		background-color: #F8F8F8;
		border-radius: 6rpx;

		&.is-active {
			color: #fff;
			background: linear-gradient(-35.599999deg, #FF4444 0%, #FD7137 100%);

			&::after {
				position: absolute;
				left: 50%;
				top: 100%;
				display: block;
				content: "\20";
				width: 0;
				height: 0;
				transform: translateX(-50%);
				border-left: 10rpx solid transparent;
				border-right: 10rpx solid transparent;
				border-top: 10rpx solid #FF4C41;
			}
		}
	}

	// 时间段选择
	// 优惠券列表
	.coupon-list {
		box-sizing: border-box;
		display: inline-flex;
		flex-wrap: nowrap;
		padding: 0 20rpx;
		margin-bottom: 30rpx;
	}

	.coupon-item {
		&+& {
			margin-left: 20rpx;
		}
	}

	.coupon-card {
		display: flex;
		position: relative;
		align-items: center;
		justify-content: space-between;
		width: 254rpx;
		height: 169rpx;
		border-radius: 20rpx;
		background: linear-gradient(-111deg, #FFF1EE 0%, #FFFAF8 100%);

		&::before {
			position: absolute;
			top: 0;
			right: 40rpx;
			display: block;
			content: "\20";
			width: 20rpx;
			height: 10rpx;
			background-color: #fff;
			border-radius: 0 0 20rpx 20rpx;
			z-index: 1;
		}

		&::after {
			position: absolute;
			bottom: 0;
			right: 40rpx;
			display: block;
			content: "\20";
			width: 20rpx;
			height: 10rpx;
			background-color: #fff;
			border-radius: 20rpx 20rpx 0 0;
			z-index: 1;
		}

		&.is-over {
			background: linear-gradient(-111deg, #F1F1F1 0%, #F9F9F9 50%, #E3E3E3 100%);
			;
		}

	}


	.coupon-card__left {
		box-sizing: border-box;
		height: 100%;
		width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex: 1 0 0;
		padding: 15rpx;
	}

	.coupon-card__right {
		width: 50rpx;
		flex-shrink: 0;
	}

	.coupon-card__price {
		font-weight: bold;
		font-size: 24rpx;
		color: #FF4444;
		white-space: nowrap;
		line-height: 1;

		.is-strong {
			font-size: 40rpx;
		}

		.is-over & {
			color: #999999;
		}
	}

	.coupon-card__title {
		width: 100%;
		margin-top: 4rpx;
		margin-bottom: 4rpx;
		font-weight: bold;
		font-size: 24rpx;
		color: #333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		.is-over & {
			color: #999999;
		}
	}

	.coupon-card__subtitle {
		width: 100%;
		font-size: 18rpx;
		line-height: 20rpx;
		color: #999;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		.is-over & {
			color: #999999;
		}
	}

	.coupon-card__progress_wrapper {
		position: relative;
		width: 100%;
		margin-top: auto;
	}

	.coupon-card__progress-text {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		font-size: 18rpx;
		color: #fff;
		text-align: center;
	}

	.coupon-card__btn-op {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		width: 50rpx;
		height: 134rpx;
		text-align: center;
		font-weight: bold;
		font-size: 28rpx;
		color: #FF4444;
		border-left: 1px dashed #FF4444;

		.is-over & {
			border-left: 1px dashed #999;
		}
	}

	// 优惠券列表 end
</style>
