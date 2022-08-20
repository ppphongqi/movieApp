<template>
	<view class="page-my-list">
		<!-- 顶部sticky -->
		<u-sticky h5-nav-height="0">
			<!-- 顶部tab -->
			<page-nav-bar class="page-nav" :nav-list="cTopCateData" :current="cTopCateActiveItem.id" @on-nav-item-click="handleTopCateItemClick"></page-nav-bar>
			<!-- 顶部提示 -->
			<view class="top-tip" @click="navigationTo('pages/subPages/couponCenter/index')">
				<view class="top-tip__icon-coupon iconfont icon-search"></view>
				<view class="top-tip__text">您有<text class="is-strong">{{receivedCouponRes.count}}</text>张待领取的优惠券哦~</view>
				<view class="top-tip__icon-more iconfont icon-right"></view>
			</view>
		</u-sticky>
		<!-- 顶部sticky end -->
		<!-- 券兑换码（暂时不上的功能） -->
		<!-- <view class="coupon-code">
			<input class="coupon-code__input" type="text" placeholder="请输入券兑换码">
			<button class="coupon-code__btn btn-normal">确认</button>
		</view> -->
		<!-- 券兑换码（暂时不上的功能） end -->
		<!-- 优惠券列表 -->
		<view class="coupon-list">
			<view v-for="(item,index) in cCouponList" :key="index" class="coupon-item">
				<coupon-owned :coupon-data="item" @on-item-click="handleCouponItemClick(item)" @on-btn-click="handleCouponItemClick(item)" />
			</view>
		</view>
		<!-- 优惠券列表 end -->
		<!-- 底部tabBar -->
		<tab-bar />
		<!-- 底部tabBar end -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import PageNavBar from '@/components/template/PageNavBar2.vue'
import TabBar from './components/TabBar.vue'
import CouponOwned from './components/CouponOwned.vue'
import {
    couponItemConverter
} from './utils/dataConverter.js'
export default {
    components: {
        PageNavBar,
        TabBar,
        CouponOwned
    },
    data() {
        return {
            // 优惠券列表的分页接口数据（业务中不用分页）。。
            couponListRes: {
                // 当前第几页，0就是即将请求第1页
                page: 0,
                // 分页的大小
                listRow: 100,
                // 数据
                data: [],
                // 是否还有更多
                hasMore: true,
                // 是否正在请求
                isFetching: false
            },
            // 当前选中的顶部tab索引
            topCateAvtive: 0,
            // 待领取数量接口数据
            receivedCouponRes: {}
        }
    },
    computed: {
        // 格式化的顶部tab的数据
        cTopCateData() {
            const len = 10
            return [
                {
                    id: 'coupon_list',
                    title: `可使用(${this.receivedCouponRes.coupon_list || 0})`
                },
                {
                    id: 'used',
                    title: `已使用(${this.receivedCouponRes.used || 0})`
                },
                {
                    id: 'be_overdue',
                    title: `已过期(${this.receivedCouponRes.be_overdue || 0})`
                }
            ]
        },
        // 当前选中的顶部分类的项
        cTopCateActiveItem() {
            return this.cTopCateData[this.topCateAvtive] || {}
        },
        // 格式化好的优惠券数据
        cCouponList() {
            return this.$util.deepGet(this.couponListRes, 'data', []).map(item => ({
                ...couponItemConverter(item),
                // 有效期
                term: item.expire_type === 20 ? this.$util.formatTime(item.stime, 'date', '/') : `${this.$util.formatTime(item.stime, 'date', '/')}-${this.$util.formatTime(item.etime, 'date', '/')}`,
                // 使用描述
                useDesc: item.use_desc,
                // 是否显示新标签
                labelNewVisible: item.coupon_new,
                // 按钮状态 -1 不知道是什么状态
                btnStatus: -1,
                // 按钮文字
                btnText: this.cTopCateActiveItem.id == 'coupon_list' ? '立即使用' : '',
                // 是否显示立即领取按钮
                btnReceiveVisible: this.cTopCateActiveItem.id == 'coupon_list',
                // 优惠券的是否已经使用之类的coupon_list:可使用,used:已使用,be_overdue:已过期
                cateType: this.cTopCateActiveItem.id
            }))
        }
    },
    watch: {
        cCouponList(val) {
            console.log(val[0])
        }
    },
    async onShow() {
        try {
            await this.mainMixin_BeforeFetchPageData()
            await Promise.all([
                this.fetchFouponListRes({
                    resetBeforeFetch: true
                }).catch(() => {}),
                this.fetchReceivedCouponRes().catch(() => {})
            ])
        } catch (e) {
            console.log(e)
            // TODO handle the exception
        }
    },
    methods: {
        // 顶部tips点击事件
        async handleTopTip() {
            App.navigationTo({
                url: 'pages/subPages/couponCenter/index',
                tabBarForce: true
            })
        },
        // 优惠券点击事件
        handleCouponItemClick(item) {
            if (this.topCateAvtive !== 0) {
                return
            }
            App.navigationTo({
                url: `pages/subPages/couponCenter/details?id=${item.id}`
            })
        },
        // 顶部分类点击事件
        async handleTopCateItemClick({
            index
        }) {
            console.log('handleTopCateItemClick', index)
            this.topCateAvtive = index
            uni.showLoading({
                title: '请稍候',
                mask: true
            })
            try {
                this.fetchFouponListRes({
                    resetBeforeFetch: true
                })
            } catch (e) {
                console.log(e)
                // TODO handle the exception
            }
            uni.hideLoading()
        },
        // 请求待领取数量接口数据
        async fetchReceivedCouponRes() {
            try {
                const res = await App._getP('user.Coupon/availableCoupon')
                this.receivedCouponRes = res.data
            } catch (e) {
                // TODO handle the exception
            }
        },
        // 请求优惠券列表的分页接口数据（注意业务中优惠券列表不用分页）
        async fetchFouponListRes({
            resetBeforeFetch = false
        } = {}) {
            try {
                // 如果在请求之前需要重置数据
                if (resetBeforeFetch || !this.cTopCateActiveItem.id) {
                    console.log('重置数据')
                    // 重置数据
                    // 还应该取消请求的但是现在没有取消请求的方法
                    this.couponListRes = {
                        ...this.couponListRes,
                        page: 0,
                        data: [],
                        hasMore: true,
                        isFetching: false
                    }
                }
                // 如果没有更多就不必请求了
                if (!this.couponListRes.hasMore) {
                    return Promise.reject()
                }
                // 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
                // 设置为正在请求
                this.couponListRes.isFetching = true
                // 请求数据
                const res = await App._getP('user.Coupon/lists', {
                    page: this.couponListRes.page + 1,
					// 其他接口都是list_rows
                    listRow: this.couponListRes.listRow,
                    data_type: this.cTopCateActiveItem.id,
                    type: 'coupon'
                })
                // 取得新的数据
                const newData = this.$util.deepGet(res, 'data', [])
                // 判断是否有更多
                const hasMore = newData.length >= this.couponListRes.listRow
                // 设置新的数据
                this.couponListRes = {
                    ...this.couponListRes,
                    page: this.couponListRes.page + 1,
                    // 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
                    // 但如果前一个请求比后一个请求后返回，依然会出错
                    data: resetBeforeFetch ? newData : this.couponListRes.data.concat(newData),
                    hasMore,
                    isFetching: false
                }
                console.log('this.couponListRes11111111111', this.couponListRes.data[0], res)
            } catch (e) {
                console.log('ha', e)
                return Promise.reject(e)
                // TODO handle the exception
            }
        }
    }
}
</script>

<style lang="scss" scoped>
	// 顶部提示
	.top-tip {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 80rpx;
		padding: 0 30rpx;
		border-top: 1px solid #eee;
		background-color: #fff;
	}

	.top-tip__icon-coupon {
		font-size: 24rpx;
		color: #FF4444;
	}

	.top-tip__text {
		margin-left: 12rpx;
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;

		.is-strong {
			color: #FF4444;
		}
	}

	.top-tip__icon-more {
		margin-left: auto;
		font-size: 24rpx;
		color: #999;
	}

	// 顶部提示 end
	// 券兑换码
	.coupon-code {
		box-sizing: border-box;
		display: flex;
		width: 690rpx;
		height: 80rpx;
		align-items: center;
		margin: 0 auto;
		margin-top: 20rpx;
		padding-left: 30rpx;
		background-color: #fff;
		border-radius: 6rpx;
	}

	.coupon-code__input {
		flex: 1;
	}

	.coupon-code__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 100%;
		padding: 0 24rpx;
		line-height: 1;
		font-size: 28rpx;
		color: #333;
	}

	// 券兑换码 end
	// 优惠券列表
	.coupon-list {
		box-sizing: border-box;
		padding: 0 30rpx;
		margin-top: 20rpx;
	}

	.coupon-item {
		&+& {
			margin-top: 20rpx;
		}
	}

	// 优惠券列表 end
</style>
