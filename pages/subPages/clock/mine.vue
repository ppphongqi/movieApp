<template>
    <view class="page-clock-mine app-clearfix">
        <!-- 用户信息 -->
        <view class="clock-user-card">
            <view class="clock-user-card__content">
                <!-- 左 -->
                <view class="clock-user-card__content__left">
                    <image
                        class="clock-user-card__avatar"
                        :src="cDetails.avatar"
                    ></image>
                </view>
                <!-- 左 end -->
                <!-- 中 -->
                <view class="clock-user-card__content__center">
                    <view class="clock-user-card__title">{{
                        cDetails.nickname
                    }}</view>
                </view>
                <!-- 中 end -->
            </view>
        </view>
        <!-- 用户信息 end -->
        <!-- main -->
        <view class="page-clock-mine__main app-clearfix">
            <!-- 作息统计 -->
            <view class="clock-statistics-card">
                <view class="clock-statistics-card__title">作息统计</view>
                <view class="clock-statistics-card__content">
                    <view v-if="cIsMorningOpen" class="clock-statistics-item">
                        <view class="clock-statistics-item__text">
                            <text class="is-strong">{{detailsRes.m_count}}</text>天
                        </view>
                        <view class="clock-statistics-item__text">
                            <text class="is-gray">累计早打卡</text>
                        </view>
                    </view>
                    <view v-if="cIsNightOpen" class="clock-statistics-item">
                        <view class="clock-statistics-item__text">
                            <text class="is-strong">{{detailsRes.n_count}}</text>天
                        </view>
                        <view class="clock-statistics-item__text">
                            <text class="is-gray">累计晚打卡</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 作息统计 end -->
            <!-- 提醒设置 -->
            <view class="app-card app-flex app-flex--align-center">
                <view class="app-flex-item app-flex-item--shrink-0">
                    <image
                        class="clock-nav-item__icon"
                        src="./static/images/icon-clock-alarm.png"
                        mode=""
                    ></image>
                </view>
                <view class="app-flex-item app-flex-item--1" @click="navigationTo('pages/subPages/clock/settings')">
                    <view class="clock-nav-item__text">提醒设置</view>
                </view>
                <view class="app-flex-item app-flex-item--shrink-0">
                    <view
                        class="clock-nav-item__icon-nav iconfont icon-jinrujiantou"
                    ></view>
                </view>
            </view>
            <!-- 提醒设置 end -->
        </view>
        <!-- main end -->
        <!-- 底部导航 -->
        <tab-bar />
        <!-- 底部导航 end -->
        <!-- 页面loading -->
        <page-loading ref="loading"></page-loading>
        <!-- 页面loading end -->
    </view>
</template>

<script>
import App from "@/common/js/app.js";
import TabBar from "./components/TabBar.vue";
export default {
    components: {
        TabBar,
    },
    data() {
        return {
			// 页面的options
            options: {},
			// 详情的接口数据
			detailsRes: {},
        };
    },
    computed: {
        // 格式化的详情数据
        cDetails() {
            return {
                // 用户头像
                avatar: this.detailsRes.avatarUrl,
                // 用户昵称
                nickname: this.detailsRes.nickName,
				// 累计早打卡天数
				m_count:  this.detailsRes.m_count,
				// 累计晚打卡天数
				m_count:  this.detailsRes.n_count,
            };
        },
		cIsMorningOpen() {
			return this.$util.deepGet(this.settingData,'clock.is_morning_open')== 1
		},
		cIsNightOpen() {
			return this.$util.deepGet(this.settingData,'clock.is_night_open')== 1
		}
    },
    async onLoad(options) {
        uni.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#ffffff",
        });
        this.options = options;
		try {
		    // await this.mainMixin_BeforeFetchPageData();
		    uni.setNavigationBarColor({
		        frontColor: "#000000",
		        backgroundColor: "#ffffff",
		    });
			// 同步请求的数据
			await Promise.all([
				this.fetchDetailsRes().catch(() => {}),
			])
		    App.hideLoading();
		} catch (e) {
		    console.log("onShow 报错", e);
		    // TODO handle the exception
		}
    },
    async onShow() {
        
    },
	methods: {
		// 请求详情的接口数据
		async fetchDetailsRes() {
			try {
				const res = await App._getP('clock.Clock/clockUserInfo', {})
				this.detailsRes = res.data || {}
			} catch (e) {
				console.log('fetchCardCateRes', e)
				return Promise.reject(e)
				// TODO handle the exception
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.page-clock-mine {
    min-height: 100vh;
    background-color: #f8f8f8;
}

// 用户信息
.clock-user-card {
    box-sizing: border-box;
    padding: 30rpx;
    padding-bottom: 30rpx;
    background-color: #ffd940;
    padding-bottom: 60rpx;
}

.clock-user-card__content {
    display: flex;
    align-items: center;
}

.clock-user-card__avatar {
    width: 126rpx;
    height: 126rpx;
    border-radius: 100rpx;
}

.clock-user-card__content__center {
    min-width: 0;
    flex: 1;
    margin-left: 36rpx;
}

.clock-user-card__title {
    font-size: 36rpx;
    font-weight: bold;
    color: #482311;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

// 用户信息 end
// main
.page-clock-mine__main {
    margin-top: -30rpx;
    border-radius: 30rpx 30rpx 0 0;
    background-color: #f8f8f8;
    padding-top: 10rpx;
}

// 作息统计
.clock-statistics-card {
    box-sizing: border-box;
    width: 690rpx;
    max-width: 100%;
    margin: 20rpx auto;
    padding: 30rpx;
    box-sizing: border-box;
    border-radius: 20rpx;
    background-color: #fff;
}

.clock-statistics-card__title {
    font-size: 28rpx;
    color: #333;
}

.clock-statistics-card__content {
    display: flex;
    align-items: center;
}

.clock-statistics-item {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 0;
    flex: 1;
    padding: 20rpx;
    & + &::before {
        display: block;
        content: "\20";
        width: 1px;
        height: 60rpx;
        background-color: #eee;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
}

.clock-statistics-item__text {
    font-size: 28rpx;
    color: #482311;

    .is-strong {
        font-size: 48rpx;
    }

    .is-gray {
        font-size: 24rpx;
        color: #999999;
    }

    & + & {
        margin-top: 20rpx;
    }
}

// 作息统计 end
// 提醒设置
.clock-nav-item__icon {
    width: 50rpx;
    height: 50rpx;
}
.clock-nav-item__text {
    font-size: 28rpx;
    color: #333;
}
.clock-nav-item__icon-nav {
    color: #ccc;
    font-size: 28rpx;
}
// 提醒设置 end
// main end
</style>
