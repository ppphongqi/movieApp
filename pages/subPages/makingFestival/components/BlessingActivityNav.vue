<template>
	<scroll-view class="blessing-activity-nav" scroll-x :scroll-into-view="cScrollIntoView">
		<view class="activity-nav-list">
			<view
				v-for="item in listData"
				:key="item._id"
				:id="`nav-item--${item._id}`"
				class="activity-nav-item"
				:class="{'is-active': item._id === value}"
				@click="handleItemClick(item)">
				<view class="activity-nav-item__title">{{item.title}}</view>
				<view class="activity-nav-item__text">{{item.text}}</view>
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
						// 	_id: '03',
						// 	title: '周一',
						// 	text: '8月6日'
						// },
					]
				}
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.blessing-activity-nav {
		box-sizing: border-box;
		width: 630rpx;
		margin: 0 auto;
	}
	.activity-nav-list {
		box-sizing: border-box;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 100%;
		padding: 20rpx 0;
	}
	.activity-nav-item {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 143rpx;
		height: 90rpx;
		text-align: center;
		color: #999;
		background-color: #F8F8F8;
		border-radius: 6rpx;
		transition: all .2s ease-in-out;
		&.is-active  {
			color: #333;
			background-color: #FFD940;
			&::after {
				position: absolute;
				left: 50%;
				top: 100%;
				content: "\20";
				width: 0;
				height: 0;
				border-left: 11rpx solid transparent;
				border-right: 11rpx solid transparent;
				border-top: 10rpx solid  #FFD940;
				transform: translateX(-50%);
			}
		}
		&+& {
			margin-left: 20rpx;
		}
	}
	.activity-nav-item__title {
		width: 100%;
		font-size: 28rpx;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.activity-nav-item__text {
		width: 100%;
		font-size: 24rpx;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
