<template>
	<view class="c-RankList">
		<view v-for="item in list" :key="item.id" class="c-RankList-item">
			<view class="c-RankList-card" :class="{'is-mine':item.isMine}">
				<view class="c-RankList-card__rank">{{ item.rank }}</view>
				<image class="c-RankList-card__avatar" :src="item.avatar" />
				<view class="c-RankList-card__nickname">{{
                    item.nickname
                }}</view>
				<view class="c-RankList-card__time">{{ item.time }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					// return [
					//     {
					//         id: "01",
					//         avatar: "http://placekitten.com/286/286",
					//         nickname:
					//             "第四名第四名第四名第四名第四名第四名第四名第四名第四名第四名",
					//         rank: 4,
					//         time: "00:00",
					//     },
					// ];
					return []
				},
			},
		},
	};
</script>

<style lang="scss" scoped>
	.c-RankList {
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
		padding: 30rpx 0;
		background: #fff;
		border-radius: 30rpx;
	}

	.c-RankList-card {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 30rpx;

		&.is-mine {
			margin-left: 30rpx;
			margin-right: 30rpx;
			background-color: #F8F8F8;
			border-radius: 30rpx;
		}
	}

	.c-RankList-card__rank {
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		width: 120rpx;
		text-align: center;

		.c-RankList-card.is-mine & {
			font-size: 28rpx;
		}
	}

	.c-RankList-card__avatar {
		flex-shrink: 0;
		width: 90rpx;
		height: 90rpx;
		border-radius: 100%;
	}

	.c-RankList-card__nickname {
		margin-left: 20rpx;
		min-width: 0;
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		font-size: 28rpx;
		text-overflow: ellipsis;
		color: #333;
		font-weight: bold;
	}

	.c-RankList-card__time {
		margin-left: 20rpx;
		min-width: 0;
		flex-shrink: 0;
		white-space: nowrap;
		color: #482311;
		font-weight: bold;
	}
</style>
