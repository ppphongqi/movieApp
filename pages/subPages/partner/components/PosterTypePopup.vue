<template>
	<popup-view class="poster-type-popup" :show="dVisible" type="bottom" @clickmask="dVisible = false">
		<view class="poster-type-card app-after--safe-bottom">
			<!-- header -->
			<view class="poster-type-card__header">
				生成海报模板
			</view>
			<!-- header -->
			<!-- content -->
			<view class="poster-type-card__content">
				<view class="poster-type-list">
					<view v-for="(item,index) in list" :id="item.id" class="poster-type-item"
						:class="{'is-active':activeId == item.id}" @click="handleItemClick(item,index)">
						<view class="poster-card" :class="{'is-active':activeId == item.id}">
							<image class="poster-card__img" :src="item.imgSrc" mode="widthFix"></image>
							<!-- mask -->
							<view v-if="activeId == item.id" class="poster-card__mask">
								<view class="pay-card__radio">
									<view class="iconfont icon-check"></view>
								</view>
							</view>
							<!-- mask end -->
						</view>
					</view>
				</view>
			</view>
			<!-- content end -->
			<!-- footer -->
			<view class="poster-type-card__footer">
				<button class="btn-normal poster-type-card__btn-go"
					@click="dVisible = false">取消</button>
				<button class="btn-normal poster-type-card__btn-go is-active"
					@click="$emit('on-btn-confirm-click',activeId)">选择海报模板</button>
			</view>
			<!-- footer end -->
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
			// 需要模板列表
			list: {
				type: Array,
				default () {
					return [{
						id: '1',
						imgSrc: 'https://via.placeholder.com/210x354/2a9ff6/fffffff'
					}, {
						id: '2',
						imgSrc: 'https://via.placeholder.com/210x354/2a9ff6/fffffff'
					}, {
						id: '3',
						imgSrc: 'https://via.placeholder.com/210x354/2a9ff6/fffffff'
					}]
				}
			},
		},
		data() {
			return {
				dVisible: this.value,
				// 当前选中的id
				activeId: this.$util.deepGet(this.list, '0.id', '')
			}
		},
		computed: {},
		watch: {
			value(val) {
				this.dVisible = val
			},
			dVisible(val) {
				this.$emit('input', val)
			},
		},
		methods: {
			handleItemClick(item, index) {
				this.$emit('on-item-click', item, index)
				this.handleChange(item, index)
			},
			handleChange(item, index) {
				this.activeId = item.id
				this.$emit('on-change', this.activeId)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.poster-type-card {
		position: relative;
		width: 100vw;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #F8F8F8;
	}

	.poster-type-card__header {
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

	.poster-type-card__content {
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}

	.poster-type-card__footer {
		display: flex;
		align-items: center;
		padding: 0 30rpx 30rpx 30rpx;
	}

	.poster-type-card__btn-go {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 90rpx;
		border-radius: 9999rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		border: 1px solid #ccc;

		&.is-active {
			background: var(--theme-color, #FFD940);
			color: var(--auxiliary-color, #333333);
			border: none;
		}

		&+& {
			margin-left: 20rpx;
		}
	}

	$item-gutter: 20rpx;

	.poster-type-list {
		display: flex;
		flex-wrap: wrap;
		margin: -$item-gutter/2;
	}

	.poster-type-item {
		box-sizing: border-box;
		width: percentage($number: 1/3);
		padding: $item-gutter/2;
	}

	.poster-card {
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
		width: 100%;
		height: 354rpx;
	}

	.poster-card__img {
		width: 100%;
		height: 100%;
	}

	.poster-card__mask {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba($color: #000000, $alpha: 0.5);
	}

	.pay-card__radio {
		box-sizing: border-box;
		display: flex;
		width: 50rpx;
		height: 50rpx;
		margin-left: 20rpx;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		background: #FF4444;
		color: #fff;

		.iconfont {
			font-size: 24rpx;
		}
	}
</style>
