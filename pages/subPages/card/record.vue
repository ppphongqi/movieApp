<template>
	<view class="pages-card-record">
		<!-- 使用记录列表 -->
		<view class="record-list">
			<view v-for="item in cRecordList" :key="item.id" class="record-item">
				<view class="record-card">
					<view class="record-card__left">
						<view class="record-card__title">{{item.title}}</view>
						<view class="record-card__text">使用时间：{{item.time}}</view>
						<view class="record-card__text">核销人员：{{item.by}}</view>
					</view>
					<view class="record-card__right">
						<view class="record-card__record">{{item.record}}</view>
						<view class="record-card__text">剩余{{settingData.card.font.ci}}数：{{item.remainingTimes}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 使用记录列表 end -->
		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="!recordListRes.hasMore"></LoadMore>
		<!-- 加载更多提示 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import LoadMore from '@/components/template/Loadmore.vue'
import LabelCoupon from './components/LabelCoupon.vue'
import { dateFormat } from '@/common/js/date'
export default {
    components: {
        LoadMore
    },
    data() {
        return {
            // 页面options
            options: {
                card_id: ''
            },
            // 优惠券列表的分页接口数据
            recordListRes: {
                // 当前第几页，0就是即将请求第1页
                page: 0,
                // 分页的大小
                list_rows: 20,
                // 数据
                data: [],
                // 是否还有更多
                hasMore: true,
                // 是否正在请求
                isFetching: false
            }
        }
    },
    computed: {
        // 格式化的使用记录列表数据
        cRecordList() {
            return (this.recordListRes.data || []).map(item => ({
                id: 'record2',
                title: `${item.bus_name} ${item.store_name}`,
                // 使用时间
                time: dateFormat(item.check_time, 'YYYY-MM-DD HH:mm:ss'),
                // 核销人员
                by: item.bus_name,
                // 剩余次数，
                remainingTimes: item.have_number,
                // 流水
                record: `-${item.hx_number}`
            }))
        }
    },
    onLoad(options) {
        this.options = options
    },
    async onShow() {
        try {
            await this.mainMixin_BeforeFetchPageData()
            await Promise.all([
                this.fetchRecordListRes({
                    resetBeforeFetch: this.recordListRes.page <= 0
                }).catch(() => {})
            ])
            App.hideLoading()
        } catch (e) {
            console.log('onPullDownRefresh 报错', e)
            // TODO handle the exception
        }
    },
    async onPullDownRefresh() {
	    try {
		    await this.mainMixin_BeforeFetchPageData()
		    await Promise.all([
		        this.fetchRecordListRes({
		            resetBeforeFetch: this.recordListRes.page <= 0
		        }).catch(() => {})
		    ])
	    } catch (e) {
		    console.log('onPullDownRefresh 报错', e)
		    // TODO handle the exception
	    }
	    uni.stopPullDownRefresh()
    },
    // 上拉加载更多
    onReachBottom() {
	    if (this.recordListRes.isFetching || !this.recordListRes.hasMore) {
	        return
	    }
	    this.fetchRecordListRes().catch(() => {})
    },
    methods: {
        // 请求优惠券列表的分页接口数据
        async fetchRecordListRes({
            resetBeforeFetch = false
        } = {}) {
            try {
                // 如果在请求之前需要重置数据
                if (resetBeforeFetch) {
                    // 重置数据
                    // 还应该取消请求的但是现在没有取消请求的方法
                    this.recordListRes = {
                        ...this.recordListRes,
                        page: 0,
                        data: [],
                        hasMore: true,
                        isFetching: false
                    }
                }
                // 如果没有更多就不必请求了
                if (!this.recordListRes.hasMore) {
                    return Promise.reject()
                }
                // 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
                // 设置为正在请求
                this.recordListRes.isFetching = true
                // 请求数据
                const res = await App._getP('card.card/useHit', {
                    page: this.recordListRes.page + 1,
                    list_rows: this.recordListRes.list_rows,
                    card_id: this.options.card_id
                })
                // 取得新的数据
                const newData = this.$util.deepGet(res, 'data.data', [])
                // 判断是否有更多
                const hasMore = newData.length >= this.recordListRes.list_rows
                // 设置新的数据
                this.recordListRes = {
                    ...this.recordListRes,
                    page: this.recordListRes.page + 1,
                    // 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
                    // 但如果前一个请求比后一个请求后返回，依然会出错
                    data: resetBeforeFetch ? newData : this.recordListRes.data.concat(newData),
                    hasMore,
                    isFetching: false
                }
                console.log('this.recordListRes11111111111', this.recordListRes.data[0])
            } catch (e) {
                console.log(e)
                return Promise.reject(e)
                // TODO handle the exception
            }
        }
    }
}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
</style>

<style lang="scss" scoped>
	// 使用记录列表
	.record-list {
		padding: 0 30rpx;
	}

	.record-item {
		&+& {
			border-top: 1px solid #eee;
		}
	}

	.record-card {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
	}

	.record-card__left {
		min-width: 0;
		flex: 1;
	}

	.record-card__title {
		font-weight: bold;
		font-size: 32rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.record-card__text {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.record-card__right {
		box-sizing: border-box;
		width: 200rpx;
		margin-left: 30rpx;
		text-align: right;
	}

	.record-card__record {
		font-weight: bold;
		font-size: 48rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	// 使用记录列表 end
</style>
