<template>
    <view class="c-RankTop-list app-clearfix">
        <view v-for="item in cList" :key="item.id" class="c-RankTop-item">
            <view class="c-RankTop-card" :class="item.classStr">
                <view class="c-RankTop-card__avatar-wrapper">
                    <image
                        class="c-RankTop-card__avatar"
                        :src="item.avatar"
                    ></image>
                    <view class="c-RankTop-card__rank">NO.{{ item.rank }}</view>
                </view>
                <view class="c-RankTop-card__text">{{ item.nickname }}</view>
                <view class="c-RankTop-card__text is-strong">{{
                    item.time
                }}</view>
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
            default() {
                // return [
                //     {
                //         id: "01",
                //         avatar: "http://placekitten.com/286/286",
                //         nickname: "第一名第一名第一名第一名第一名",
                //         rank: 1,
                //         time: "00:00",
                //     },
                // ];
				return []
            },
        },
    },
    computed: {
        // 格式化的列表数据
        cList() {
            return this.list.map((item={}) => ({
                ...item,
                classStr: `is-rank-${item.rank}`,
            }));
        },
    },
};
</script>

<style lang="scss" scoped>
.c-RankTop-list {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 690rpx;
    margin: 20rpx auto;
}
.c-RankTop-item {
    width: percentage(1/3);
    box-sizing: border-box;
}

.c-RankTop-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 20rpx;
}

.c-RankTop-card__avatar-wrapper {
    position: relative;
    padding-bottom: 20rpx;
    .c-RankTop-card.is-rank-1 & {
        transform: scale(1);
        transform-origin: center bottom;
    }
    .c-RankTop-card.is-rank-2 & {
        transform: scale(0.9139784);
        transform-origin: center bottom;
    }
    .c-RankTop-card.is-rank-3 & {
        transform: scale(0.709677);
        transform-origin: center bottom;
    }
}

.c-RankTop-card__avatar {
    width: 186rpx;
    height: 186rpx;
    border-radius: 100%;
}
.c-RankTop-card__rank {
    position: absolute;
    left: 50%;
    bottom: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx 14rpx;
    color: #fff;
    font-weight: bold;
    background: linear-gradient(180deg, #4783fb 0%, #034de1 100%);
    border-radius: 30rpx 0 30rpx 0;
    transform: translateX(-50%);
    .c-RankTop-card.is-rank-1 & {
        background: linear-gradient(180deg, #4783fb 0%, #034de1 100%);
    }
    .c-RankTop-card.is-rank-2 & {
        background: linear-gradient(180deg, #fbba00 0%, #f3a503 100%);
    }
    .c-RankTop-card.is-rank-3 & {
        background: linear-gradient(180deg, #ededed 0%, #9a9a9a 100%);
    }
}
.c-RankTop-card__text {
    font-size: 28rpx;
    color: #b2972b;
    overflow: hidden;
    width: 100%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 16rpx;
    &.is-strong {
        font-size: 32rpx;
        color: #482311;
        font-weight: bold;
    }
}
</style>
