<template>
	<scroll-view class="blessing-tab-nav" :class="{'is-fluid':isFluid}" scroll-x :scroll-into-view="cScrollIntoView">
		<view class="tab-nav-list">
			<view
				v-for="item in listData"
				:key="item._id"
				:id="`nav-item--${item._id}`"
				class="tab-nav-item"
				:class="{'is-active': item._id === value}"
				@click="handleItemClick(item)">
				{{item.name}}
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		props: {
			// uni-app不支持https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model
			// 选中项的id
			value: {
				type: String,
				default: ''
			},
			// 导航的列表数据
			listData: {
				type: Array,
				default() {
					return [
						// {
						// 	_id: '01',
						// 	name: '热卖专区'
						// }
					]
				}
			},
			//
			isFluid: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			// 当前激活的元素
			cActiveItem() {
				return this.listData.find(item=>item._id === this.value) || null
			},
			// 当前要滚动到的元素
			cScrollIntoView() {
				if(!this.cActiveItem) return ''
				return `nav-item--${this.value}`
			}
		},
		watch: {
			listData:{
				handler(val) {
					console.log('当导航更新时 更新一次导航的激活项')
					// 当导航更新时 更新一次导航的激活项
					if(val.find(item => item._id === this.value)){
						return
					}
					this.$emit('input',this.$util.deepGet(val, '0._id', ''))
				},
				immediate: true
			}
		},
		methods: {
			// 导航点击事件
			handleItemClick(item) {
				console.log('handleItemClick',item)
				this.$emit('input',item._id)
				this.$emit('on-item-click',item._id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.blessing-tab-nav {
		box-sizing: border-box;
		width: 690rpx;
		height: 84rpx;
		margin: 20rpx auto;
		border-radius: 10rpx;
		background-color: #fff;
		&.is-fluid {
			width: 100%;
			border-radius: 0;
			margin: 0;
		}
	}
	.tab-nav-list {
		display: inline-flex;
		min-width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}
	.tab-nav-item {
		position: relative;
		box-sizing: border-box;
		width: 170rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999999;
		transition: all .2s ease-in-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		&.is-active {
			font-weight: bold;
			color: #333;
		}
		&+&::after {
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
			content: "";
			display: block;
			width: 1px;
			height: 30rpx;
			background-color: #EEEEEE;
		}
	}
</style>
