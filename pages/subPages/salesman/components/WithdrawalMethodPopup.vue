<template>
	<popup-view class="method-popup" :show="dVisible" type="bottom" @clickmask="dVisible = false">
		<view class="method-card app-after--safe-bottom">
			<!-- header -->
			<view class="method-card__header">
				提现方式
			</view>
			<!-- header -->
			<!-- content -->
			<view class="method-card__content">
				<view class="method-list">
					<view v-for="(item,index) in cList" :id="item.id" class="method-item" @click="handleItemClick(item,index)">
						<view class="pay-card" :class="{
							'is-active': activeId === item.id
						}">
							<image class="pay-card__logo" :src="item.logo"></image>
							<view class="pay-card__text">{{item.text}}</view>
							<view class="pay-card__radio" :class="{
							'is-active': activeId === item.id
						}">
								<view class="iconfont icon-check"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- content end -->
			<!-- footer -->
			<view class="method-card__footer">
				<button class="btn-normal method-card__btn-go" @click="$emit('on-btn-confirm-click',activeId)">确认</button>
			</view>
			<!-- footer end -->
			<!-- 关闭按钮 -->
			<view class="method-popup__btn-close iconfont icon-searchclose" @click="dVisible = false"></view>
			<!-- 关闭按钮 end -->
		</view>
	</popup-view>
</template>

<script>
	import PopupView from '@/components/template/PopManager.vue'
	export default {
		components: {
			PopupView,
		},
		props: {
			// 默认是否显示v-model
			value: {
				type: Boolean,
				default: false
			},
			// 需要显示支付方式
			list: {
				type: Array,
				default () {
					return [{
						id: 1,
						text: '微信',
						logo: require('../static/images/logo-wx.png'),
						en: 'wechat'
					}, {
						id: 2,
						text: '银行卡',
						logo: require('../static/images/logo-yl.png'),
						en: 'bank_card'
					}]
				}
			},
			// 如果存在且不为空数组，将会只保留en相同的列表项
			filterEn: {
				type: Array,
				default() {
					// return ['wehchat','bank_card']
					return []
				}
			}
		},
		data() {
			return {
				dVisible: this.value,
				// 当前选中的id
				activeId: this.$util.deepGet(this.list, '0.id', '')
			}
		},
		computed: {
			cList() {
				if(!this.filterEn || !this.filterEn.length) {
					return this.list
				}
				return (this.list || []).filter(item=>this.filterEn.includes(item.en))
			}
		},
		watch: {
			value(val) {
				this.dVisible = val
			},
			dVisible(val) {
				this.$emit('input', val)
			}
		},
		methods: {
			handleItemClick(item,index) {
				this.$emit('on-item-click',item,index)
				this.handleChange(item,index)
			},
			handleChange(item,index) {
				this.activeId = item.id
				this.$emit('on-change',this.activeId)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.method-card {
		position: relative;
		width: 100vw;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #F8F8F8;
	}

	.method-card__header {
		box-sizing: border-box;
		display: flex;
		min-height: 120rpx;
		padding: 0 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 40rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}

	.method-card__content {
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}

	.method-popup__btn-close {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		font-size: 36rpx;
		text-align: center;
	}

	.method-card__footer {
		padding: 0 30rpx 30rpx 30rpx;
	}

	.method-card__btn-go {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90rpx;
		border-radius: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		background: var(--theme-color, #FFD940);
		color: var(--auxiliary-color, #333333);
	}

	$item-gutter: 20rpx;

	.method-list {
		display: flex;
		flex-wrap: wrap;
		margin: -$item-gutter/2;
	}

	.method-item {
		box-sizing: border-box;
		width: 50%;
		padding: $item-gutter/2;
	}

	.pay-card {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 140rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		border: 2rpx solid transparent;

		&.is-active {
			border-color: var(--theme-color, #FFD940);
		}
	}

	.pay-card__logo {
		width: 80rpx;
		height: 80rpx;
	}

	.pay-card__text {
		min-width: 0;
		margin-left: 20rpx;
		flex: 1;
		font-size: 32rpx;
		font-weight: bold;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.pay-card__radio {
		box-sizing: border-box;
		display: flex;
		width: 40rpx;
		height: 40rpx;
		margin-left: 20rpx;
		align-items: center;
		justify-content: center;
		border: 1px solid #ccc;
		border-radius: 100%;

		.iconfont {
			display: none;
			font-size: 24rpx;
		}

		&.is-active {
			background: var(--theme-color, #FFD940);
			border-color: var(--theme-color, #FFD940);
			color: var(--auxiliary-color, #333333);

			.iconfont {
				display: inline;
			}
		}
	}
</style>
