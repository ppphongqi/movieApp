<template>
	<view class="buying-users">
		<view class="buying-users__header">
			<card-title title="购买用户" />
		</view>
		<view class="buying-users__content">
			<view class="buying-users-list">
				<view v-for="item in listData" :key="item._id" class="buying-users-item">
					<view class="buying-users-card">
						<image class="buying-users-card__img" :src="item.avatar" />
						<view class="buying-users-card__text">{{item.nickname}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CardTitle from './CardTitle'
export default {
    components: {
        CardTitle
    },
    props: {
        // 购买用户列表数据
        listData: {
            type: Array,
            default() {
                return [
                    {
                        _id: '01',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下名***下'
                    },
                    {
                        _id: '02',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下'
                    },
                    {
                        _id: '03',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下'
                    },
                    {
                        _id: '04',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下'
                    },
                    {
                        _id: '05',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下'
                    },
                    {
                        _id: '06',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下'
                    },
                    {
                        _id: '07',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下'
                    },
                    {
                        _id: '08',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下'
                    },
                    {
                        _id: '09',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下'
                    },
                    {
                        _id: '10',
                        avatar: 'https://via.placeholder.com/80x80/#FCCA1E/fffffff',
                        nickname: '名***下'
                    }
                ]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
	.buying-users {
		width: 690rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.buying-users__content {
		padding: 20rpx 30rpx;
		padding-top: 0;
	}
	.buying-users-list {
		display: flex;
		flex-wrap: wrap;
	}
	.buying-users-item {
		$col: 5;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		padding: 0 8rpx;
		width: percentage(1 / $col);
		&:nth-child(n + #{$col+1}) {
			margin-top: 32rpx;
		}
	}
	.buying-users-card__img {
		box-sizing: border-box;
		display: block;
		width: 80rpx;
		height: 80rpx;
		margin: 0 auto;
		border: 1px solid #333;
		border-radius: 100%;
	}
	.buying-users-card__text {
		width: 100%;
		font-size: 24rpx;
		color: #333;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
