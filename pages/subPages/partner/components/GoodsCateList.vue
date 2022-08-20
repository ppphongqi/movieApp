<template>
	<view class="c-GoodsCateList" :class="{
		'c-GoodsCateList--dropdown-open': dropdownOpen,
		'c-GoodsCateList--dropdown-close': !dropdownOpen,
		'no-left': !navLeftVisible
	}">
		<view v-if="navLeftVisible" class="c-GoodsCateList__left">
			<PageNavBar autoWidth :nav-list="list" :current="currentId" isScroll @on-nav-item-click="handleNavBarItemClick">
			</PageNavBar>
		</view>
		<view class="c-GoodsCateList__right">
			<u-dropdown ref="uDropdown" height="100" :menu-icon="menuIcon" active-color="#333" inactive-color="#333"
				:menu-icon-size="navLeftVisible ? 36 : 24" close-on-click-mask @open="dropdownOpen=true" @close="dropdownOpen=false">
				<u-dropdown-item :title="dropdownItemTitle">
					<view class="slot-content" style="background-color: #FFFFFF;">
						<scroll-view scroll-y="true" style="max-height: 400rpx;">
							<view class="cate-list">
								<view v-for="item in list" :key="item.id" class="cate-item"
									:class="{'cate-item--active':item.id === currentId}"
									@click="handleCateItemClick(item,index)">{{item.title}}</view>
							</view>
						</scroll-view>
					</view>
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view style="margin-left: auto;">
			<slot name="right" />
		</view>
	</view>
</template>

<script>
	import PageNavBar from '@/components/template/PageNavBar2.vue'
	export default {
		components: {
			PageNavBar
		},
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					// return [{
					// 		id: 'coupon_list',
					// 		title: `可使用`,
					// 		value: 'coupon_list'
					// 	}
					// ]
					return []
				}
			},
			// 是否显示左侧导航
			navLeftVisible: {
				type: Boolean,
				default: true
			},
			menuIcon: {
				type: String,
				default: 'list-dot'
			},
			dropdownItemTitle: {
				type: String,
				default: ''
			}
			
		},
		data() {
			return {
				// 当前选中项的id
				currentId: this.$util.deepGet(this.list, '0.id', ''),
				// 当前是否打开下拉菜单
				dropdownOpen: false
			}
		},
		watch: {
			list(val) {
				if(!this.currentId) {
					this.currentId = this.$util.deepGet(this.list, '0.id', '')
				}
			},
			currentId(val) {
				this.$emit('on-change',val)
			}
		},
		methods: {
			handleNavBarItemClick(e) {
				this.currentId = e.id
				this.$emit('on-item-click',e.item,e.index)
			},
			handleCateItemClick(item, index) {
				this.currentId = item.id
				this.$emit('on-item-click',item,index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	// app.css里面还有相关样式代码
	.c-GoodsCateList {
		position: relative;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #eee;
		background-color: #fff;
	}

	.c-GoodsCateList__left {
		min-width: 0;
		flex: 1;
	}

	.c-GoodsCateList__right {
		// display: flex;
		align-items: center;
		justify-content: center;
		width: 90rpx;
		height: 100rpx;
		box-shadow: -8rpx 0 4rpx -4rpx #eee;
		.no-left & {
			padding: 0 30rpx;
			width: auto;
		}
	}

	.cate-list {
		padding: 20rpx;
	}

	.cate-item {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 50rpx;
		margin: 10rpx;
		padding: 0 30rpx;
		color: #333;
		font-size: 26rpx;
		background-color: #F8F8F8;
		border-radius: 9999rpx;
	}

	.cate-item--active {
		font-weight: bold;
		background-color: #FFD940;
	}
</style>
