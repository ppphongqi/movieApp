<template>
	<view class="c-users-list">
		<view class="c-users-list__left">
			<view v-for="item in cUsersData" :key="item.id" class="user-card" :style="item.styleStr">
				<image class="user-card__img" :src="item.avatar"></image>
			</view>
			<view class="user-card--more">···</view>
		</view>
		<view class="c-users-list__center"><view>{{totalUsersNum}}人</view><view>已领取</view></view>
		<view class="c-users-list__right"><button class="c-users-list__btn-op btn-normal" open-type="share" @click="handleBtnShareClick">邀请好友一起抢</button></view>
	</view>
</template>

<script>
	export default {
		props: {
		    // 是否使用默认的数据转换器，如果为true可以直接传入接口的原始数据接口，否则，则需要在父组件将数据转换好再传入
		    useDefaultDataConverter: {
			    type: Boolean,
			    default: true
		    },
		    // 原始数据
		    usersData: {
			    type: Array,
			    default() {
			        return [
						// {
						// 	id: 'user1',
						// 	avatar: 'https://via.placeholder.com/60x60/2a9ff6/fffffff',
						// }
					]
			    }
		    },
			// 总共有好多人
			totalUsersNum: {
				type: Number,
				default: 0
			},
			// 最多显示几个 除了省略号
			maxVisibleNum: {
				type: Number,
				default: 4
			}
		},
		computed: {
		    // 格式化后的数据
		    cUsersData() {
		        if (this.useDefaultDataConverter) {
					console.log(this.defaultDataConverter(this.usersData)[0])
		            return this.defaultDataConverter(this.usersData)
		        }
		        return this.usersData.slice(0, this.maxVisibleNum)
		    }
		},
		methods: {
			// 分享按钮点击事件
			handleBtnShareClick() {
				this.$emit('on-btn-share-click')
			},
			// 默认的数据转换器
		    defaultDataConverter(data=[]) {
				const arr = data.slice(0,this.maxVisibleNum)
				const len = arr.length
				console.log('userList的数据',arr,data)
				return arr.map((item,index)=>({
					id: item.id || `user${index}`,
					avatar: item.avatar,
					styleStr: `z-index: ${len - index + 2};`
				}))
		    }
		}
	}
</script>

<style lang="scss" scoped>
	.c-users-list {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 690rpx;
		max-width: 100%;
		height: 100rpx;
		margin: 0 auto; 
		padding: 0 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	
	.c-users-list__left {
		position: relative;
		display: flex;
		align-items: center;
	}
	
	.user-card {
		position: relative;
		height: 60rpx;
		width: 60rpx;
		margin-right: -24rpx;
	}
	.user-card--more {
		position: relative;
		height: 60rpx;
		width: 60rpx;
		margin-right: -24rpx;
		color: #999999;
		text-align: center;
		line-height: 60rpx;
		border-radius: 100%;
		background-color: #EEEEEE;
		z-index: 0;
	}
	
	.user-card__img {
		position: relative;
		width: 100%;
		height: 100%;
		margin-right: -24rpx;
		border-radius: 100%;
	}
	
	.c-users-list__center {
		font-size: 24rpx;
		color: #333333;
	}
	.c-users-list__btn-op {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 36rpx;
		height: 60rpx;
		font-size: 24rpx;
		color: #333333;
		background-color: #FDD94A;
		border-radius: 60rpx;
	}
</style>
