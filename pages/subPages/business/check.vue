<template>
	<view :style="themeColor">
		<view class="check-filter b-f">
			<view class="check-search dis-flex flex-y-center" :class="{'assistant':mType==='assistant'}">
				<view class="search-input-box flex-box p-r">
					<view class="iconfont icon-search_light col-9"></view>
					<input type="text" v-model="searchName" class="search-input f-26" :placeholder="mType==='assistant'?'请输入商品名称':'请输入门店名称、店员姓名、商品名称'"
					 placeholder-style="color:#999;font-size:26rpx;" confirm-type="search" @confirm="getCheckRecords(1)" />
				</view>
				<view class="dis-flex flex-y-center filter-date col-3 f-w" @click="showDateChange">
					<view class="f-26">日期</view>
					<view class="iconfont icon-filter"></view>
				</view>
			</view>
			<view class="check-merchant b-f col-3 f-28 dis-flex flex-y-center" v-if="mType==='admin'">
				<view class="check-item" :class="{'active':store_id !== 0}" @click="popChange('store')">
					<view class="check-item-text">{{storeName}}</view>
					<view class="check-item__icon"></view>
				</view>
				<view class="check-item" :class="{'active':goods_id !== 0}" @click="popChange('goods')">
					<view class="check-item-text">{{goodsName}}</view>
					<view class="check-item__icon"></view>
				</view>
				<!-- <block >

				</block>
				<block v-else>
					<view class="check-item">
						<text class="check-item-text">{{storeName}}</text>
					</view>
				</block> -->
				<view class="check-item" :class="{'active':mid !== 0}" @click="popChange('assistant')">
					<view class="check-item-text">{{assistantName}}</view>
					<view class="check-item__icon"></view>
				</view>
			</view>
		</view>
		<!-- 店铺筛选下拉弹框 -->
		<view class="merchant-pop-maks" v-if="isShowPop" @click="popChange(popType)"></view>
		<view class="check-merchant-pop" :class="{'show':isShowPop}">
			<block v-if="popListData.length > 6">
				<scroll-view scroll-y="true" class="merchant-list">
					<block v-for="(item,index) in popListData" :key="index">
						<view class="merchant-item f-28 col-3" :class="{active:itemActive(item)}" @click="merchantItemChange(item)">
							{{item.name}}
							<image src="/static/images/business/success.png" v-if="itemActive(item)" class="active-icon"></image>
						</view>
					</block>
				</scroll-view>
			</block>
			<block v-else>
				<view class="merchant-list">
					<block v-for="(item,index) in popListData" :key="index">
						<view class="merchant-item f-28 col-3" :class="{active:itemActive(item)}" @click="merchantItemChange(item)">
							{{item.name}}
							<image src="/static/images/business/success.png" v-if="itemActive(item)" class="active-icon"></image>
						</view>
					</block>
				</view>
			</block>
		</view>
		<!-- 日期选择弹框 -->
		<popup-view :show="isShowDate" type="center" @clickmask="isShowDate = false">
			<view class="check-date">
				<form @submit="checkDateSubmit">
					<view class="check-date-title f-30 col-3 t-c">筛选时间</view>
					<view class="check-date-type">
						<radio-group @change="dateType = $event.detail.value" name="time" class="dis-flex flex-warp flex-y-center">
							<label class="date-item f-28 col-3 t-c" :class="{'active':item.value === dateType}" v-for="(item, index) in dateTypeList"
							 :key="item.value">
								{{item.title}}
								<radio :value="item.value" class="data-radio" :checked="item.value === dateType" />
							</label>
						</radio-group>
					</view>
					<view class="date-customize" v-if="dateType === 'customize'">
						<view class="customize-title f-26 col-3">起始时间</view>
						<view class="customize-time">
							<view class="customize-picker-mask dis-flex flex-x-around flex-y-end">
								<view class="picker-mask-item">年</view>
								<view class="picker-mask-item">月</view>
								<view class="picker-mask-item">日</view>
							</view>
							<picker-view :value="startValue" name="stime" :indicator-style="indicatorStyle" class="picker-view" @change="handleStartChange">
								<picker-view-column>
									<view class="picker-item" v-for="(item,index) in pickerData.years" :key="index">{{item}}</view>
								</picker-view-column>
								<picker-view-column>
									<view class="picker-item" v-for="(item,index) in pickerData.months" :key="index">{{item}}</view>
								</picker-view-column>
								<picker-view-column>
									<view class="picker-item" v-for="(item,index) in pickerData.days" :key="index">{{item}}</view>
								</picker-view-column>
							</picker-view>
						</view>
						<view class="customize-title f-26 col-3">结束时间</view>
						<view class="customize-time">
							<view class="customize-picker-mask dis-flex flex-x-around flex-y-end">
								<view class="picker-mask-item">年</view>
								<view class="picker-mask-item">月</view>
								<view class="picker-mask-item">日</view>
							</view>
							<picker-view :value="endValue" name="etime" :indicator-style="indicatorStyle" class="picker-view" @change="handleEndChange">
								<picker-view-column>
									<view class="picker-item" v-for="(item,index) in pickerData.years" :key="index">{{item}}</view>
								</picker-view-column>
								<picker-view-column>
									<view class="picker-item" v-for="(item,index) in pickerData.months" :key="index">{{item}}</view>
								</picker-view-column>
								<picker-view-column>
									<view class="picker-item" v-for="(item,index) in pickerData.days" :key="index">{{item}}</view>
								</picker-view-column>
							</picker-view>
						</view>
					</view>
					<view class="check-date-btns dis-flex flex-y-center">
						<view class="check-date-btn" @click="isShowDate = false">取消</view>
						<view class="check-date-btn confirm p-r main-bg-color auxiliary-color">确认
							<button class="report-btn" form-type="submit"></button>
						</view>
					</view>
				</form>
			</view>
		</popup-view>

		<!-- 记录列表 -->
		<view class="check-orders" :class="{'assistant':mType==='assistant'}">
			<block v-if="!!checkData.data && checkData.data.length">
				<view class="check-orders-total f-24 col-3">{{type==="3"?"核销":"自提"}}共<text class="col-m">{{checkData.check_count}}</text>次,合计<text
					 class="col-m">{{checkData.check_money}}</text>元;共<text class="col-m">{{checkData.total_num}}</text>件商品</view>
				<view class="check-order-item b-f" v-for="(item,index) in checkOrders" :key="index">
					<view class="check-order-title dis-flex flex-x-between flex-y-center border-line border-bottom">
						<view class="f-24 col-9">订单号:{{item.order_no}}</view>
						<view class="f-24 col-m">{{item.status}}</view>
					</view>
					<list-goods-item :goods-data="item.goods" totalNumPrefix="核销数量："></list-goods-item>
					<view class="handle-list border-line border-top">
						<view class="handle-item dis-flex flex-x-between" v-if="type === '3'">
							<view class="f-24 col-3">核销金额</view>
							<view class="f-24 col-m">{{settingData.currency}}{{item.money}}</view>
						</view>
						<view class="handle-item dis-flex flex-x-between" v-if="!!item.create_time">
							<view class="f-24 col-3">核销人员</view>
							<view class="f-24 col-3">{{item.name||""}}</view>
						</view>
						<view class="handle-item dis-flex flex-x-between">
							<view class="f-24 col-3">核销时间</view>
							<view class="f-24 col-3">{{item.create_time}}</view>
						</view>
					</view>
				</view>
				<load-more :showLoadmore="!showLoadmore"></load-more>
			</block>
			<block v-else>
				<Abnor title="您还没有相关记录哦"></Abnor>
			</block>
		</view>

		<!-- 返回顶部 -->
		<GoTopBtn :page-scroll="pageScroll"></GoTopBtn>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import initPicker from '@/common/w-picker.js'
import PopupView from '@/components/template/PopManager.vue'
import PageNavBar from '@/components/template/PageNavBar2.vue'
import ListGoodsItem from '@/components/template/ListGoodsItem.vue'
import GoTopBtn from '@/components/template/GoTopBtn.vue'
import LoadMore from '@/components/template/Loadmore.vue'
import Abnor from '@/components/template/Abnor.vue'
import listMixin from '@/common/js/pageListMixin.js'
import App from '@/common/js/app.js'
export default {
    mixins: [listMixin],
    data() {
        return {
            // 当前商品列表的接口数据
            goodsRes: [],
            // 当前选中的商品
            goods_id: 0,
            isShowPop: false, // 显示下拉
            isShowDate: false, // 显示日期选择
            dateType: 'all',
            popType: 'store',
            pickerData: {},
            startValue: [
                0,
                0,
                0
            ],
            endValue: [
                0,
                0,
                0
            ],
            merchantData: [], // 商家数据
            store_id: 0, // 选中门店id
            mid: 0, // 选中店员id
            searchName: '', // 搜索名字
            searchTime: 'all', // 时间筛选类型
            type: '3', // 显示记录类型 2-自提 3-核销
            dateTypeList: [
                {
                    title: '所有',
                    value: 'all'
                },
                {
                    title: '今日',
                    value: 'today'
                },
                {
                    title: '昨日',
                    value: 'yesterday'
                },
                {
                    title: '7日',
                    value: 'week'
                },
                {
                    title: '自定义',
                    value: 'customize'
                }
            ],
            navType: '0',
            page: 1,
            checkData: {},
            isMore: true,
            mType: 'admin', // 当前查看成员类型 admin-管理员 assistant-店员
            pickerYear: '', // 当前选中的年份
            pickerMonth: '' // 当前选中的月份
        }
    },
    components: {
        PageNavBar,
        ListGoodsItem,
        GoTopBtn,
        Abnor,
        LoadMore,
        PopupView
    },
    computed: {
        indicatorStyle() {
            return 'height: 34px;'
        },
        // 数据格式整理
        checkOrders() {
            if (!!this.checkData.data) {
                let checkOrders = this.checkData.data.map(val => {
                    let {
                        goods_attr,
                        file_path,
                        goods_name,
                        total_num,
                        goods_price,
                        is_give
                    } = val
                    val.goods = {
                        goods_attr,
                        goods_name,
                        // 现在都是一次核销一个的 接口要注意
                        total_num,
                        goods_price,
                        is_give,
                        image: [
                            {
                                file_path
                            }
                        ]
                    }
                    return val
                })
                return checkOrders
            }
            return []

        },
        // 门店列表
        storeList() {
            if (this.merchantData.length > 0) {
                return this.merchantData
            }
            return []

        },
        // 商品列表
        goodsList() {
            if (!this.goodsRes || !this.goodsRes.length) {
                return []
            }
            const arr = this.goodsRes.map(item => ({
                ...item,
                goods_id: item.goods_id,
                name: (item.goods_name || '').slice(0, 20)
            }))
            return [
                {
                    goods_id: 0,
                    name: '所有商品'
                },
                ...arr
            ]
        },
        // 店员列表
        assistantList() {
            if (this.merchantData.length > 0) {
                let store_id = this.store_id,
                    assistant = [],
                    defaults = [
                        {
                            mid: 0,
                            store_id: 0,
                            name: '所有店员'
                        },
                        {
                            mid: -1,
                            store_id: -1,
                            name: '后台核销'
                        }
                    ]
                if (store_id === 0) {
                    this.merchantData.map(val => {
                        val.user && assistant.push(...val.user)
                    })
                } else {
                    this.mid = 0
                    let userList = this.merchantData.filter(val => val.id === store_id)[0].user
                    if (!!userList) {
                        assistant.push(...userList)
                    }
                }
                let assistantFilter = {}
                assistant.map(val => {
                    assistantFilter[val.mid] = val
                })
                return [
                    ...defaults,
                    ...Object.values(assistantFilter)
                ]
            }
            return []

        },
        // 当前下拉显示数据
        popListData() {
            const {
                popType,
                storeList,
                assistantList,
                goodsList
            } = this
            if (popType === 'store') {
			    return storeList
            } else if (popType === 'assistant') {
			    return assistantList
            } else if (popType === 'goods') {
			   return goodsList
            }
        },
        // 门店名称
        storeName() {
            let {
                store_id,
                storeList = []
            } = this
            if (storeList.length > 0) {
                return store_id === 0 ? '所有门店' : storeList.filter(val => val.id === store_id)[0].name
            }
            return '所有门店'

        },
        goodsName() {
            const item = this.goodsList.find(item => item.goods_id === this.goods_id)
            if (!item) {
                return '所有商品'
            }
            return item.name
        },
        // 店员名称
        assistantName() {
            let {
                mid,
                assistantList
            } = this
            return mid === 0 ? '所有店员' : assistantList.filter(val => val.mid === mid)[0].name
        },
        // 当前是否选中(不应该写成计算属性)
        // 当前是否选中
        itemActive() {
            let {
                popType,
                store_id,
                mid,
                goods_id
            } = this
            return item => {
                if (popType === 'store') {
                    return item.id === store_id
                } else if (popType === 'assistant') {
                    return item.mid === mid
                } else if (popType === 'goods') {
                    return item.goods_id === goods_id
                }
            }
        }
    },
    onLoad(options) {
        console.log(options)
        let {
            type = '3', // 记录类型
            mType = 'admin', // 查看人员类型
            store_id = 0, // 门店id
            bus_id = 0
        } = options
        uni.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
        })
        uni.setNavigationBarTitle({
            title: `${type === '2' ? '自提' : '核销'}记录`
        })
        this.bus_id = bus_id
        this.type = type
        this.mType = mType
        this.store_id = Number(store_id) === -1 ? 0 : Number(store_id)
        this.initDate()
        this.getCheckRecords(1)
        this.getMerchantData()
        this.fetchGoodsRes()
    },
    methods: {
        // 请求当前商品接口数据
        async fetchGoodsRes() {
            if (!this.bus_id) {
                this.goodsRes = []
                return
            }
		    try {
		        const res = await App._getP('merchant.order/goodsRows', {
                    bus_id: this.bus_id
                })
		        this.goodsRes = res.data
		    } catch (e) {
		        return Promise.reject(e)
		        // TODO handle the exception
		    }
        },
        handleStartChange(e) {
            const val = e.detail.value
            console.log('handleStartChange', val)
            this.pickerYear = this.pickerData.years[val[0]]
            this.pickerMonth = this.pickerData.months[val[1]]
            this.initDate()
            this.startValue = e.detail.value

        },
        handleEndChange(e) {
            const val = e.detail.value
            console.log('handleEndChange', val)
            this.endPickerYear = this.pickerData.years[val[0]]
            this.endPickerMonth = this.pickerData.months[val[1]]
            this.initDate()
            this.endValue = e.detail.value
        },
        /**
			 * 初始化日期
			 */
        initDate() {
            let currentDate = this.useCurrent(),
                [
                    tYear,
                    tMonth,
                    tDay
                ] = currentDate,
                dateStep = 10, // 当前时间，前后10年
                endYear = String(tYear * 1 + dateStep),
                pickerData = initPicker.date(tYear, endYear, 'date', 1, currentDate),
                [
                    beforeYear,
                    afterYear
                ] = [
                    dateStep * -1,
                    0
                ].map(val => {
                    let years = new Array(dateStep).join('.').
                        split('.')
                    years = years.map((value, index) => String(tYear * 1 + val + index))
                    return years
                })
            pickerData.years = [
                ...beforeYear,
                ...afterYear
            ]
            let currentValue = {} // 默认选中下标
            currentDate.map((val, index) => {
                currentValue[index === 0 ? 'years' : index === 1 ? 'months' : 'days'] = val
            })
            for (let [
                key,
                value
            ] of Object.entries(pickerData)) {
                pickerData[key] = value.map(val => Number(val) + '')
                currentValue[key] = pickerData[key].findIndex(val => val === currentValue[key])
            }
            this.pickerData = pickerData
            // fix 自定义时间范围始终有一个时间是当前时间
            if (this.dateType === 'customize') {
                if (!this.startValue || !this.startValue.length) {
                    this.startValue = Object.values(currentValue)
                }
                if (!this.endValue || !this.endValue.length) {
                    this.endValue = Object.values(currentValue)
                }
            } else {
                this.startValue = Object.values(currentValue)
                this.endValue = Object.values(currentValue)
            }

        },
        useCurrent() {
            let aToday = new Date()
            let tYear = this.pickerYear ? this.pickerYear : aToday.getFullYear().toString()
            let tMonth = this.pickerMonth ? this.pickerMonth : (aToday.getMonth() + 1).toString()
            let tDay = (aToday.getDate()).toString()
            return [
                tYear,
                tMonth,
                tDay
            ]
        },
        formatNum(num) {
            return num < 10 ? '0' + num : num + ''
        },
        /**
			 * 筛选条件切换
			 */
        popChange(popType) {
            this.isShowPop = !this.isShowPop
            if (popType !== this.popType && this.isShowPop) {
                this.popType = popType
            }
        },
        /**
			 * 商家条件筛选
			 */
        merchantItemChange(item) {
            console.log('merchantItemChange', item)
            const popType = this.popType
            if (popType === 'store') {
                this.store_id = item.id
            } else if (popType === 'assistant') {
                this.mid = item.mid
            } else if (popType === 'goods') {
                console.log('merchantItemChange goods', item)
                this.goods_id = item.goods_id
            }

            this.isShowPop = false
            this.getCheckRecords(1)
        },
        /**
			 * 日期筛选显示/隐藏
			 */
        showDateChange() {
            this.isShowDate = !this.isShowDate
            this.isShowPop = false
        },
        /**
			 * 获取筛选日期
			 */
        checkDateSubmit(e) {
            let stime = this.startValue, // 开始日期
                etime = this.endValue, // 结束日期
                time = e.detail.value.time // 日期类型
            console.log('e.detail.value', e.detail.value)
            if (time === 'customize') {
                console.log(stime, etime)
                stime = this.dateTOtimestamp(stime, 'start')
                etime = this.dateTOtimestamp(etime, 'end')
                if (etime < stime) {
                    App.showError('结束时间不能小于开始时间!')
                    return
                }
                this.searchTime = `${stime},${etime}`
            } else {
                this.searchTime = time
            }
            this.isShowDate = false
            this.getCheckRecords(1)
        },
        /**
			 * 时间戳转换
			 */
        dateTOtimestamp([
            yIndex = 0,
            mIndex = 0,
            dIndex = 0
        ], type) {
            let {
                    years,
                    months,
                    days
                } = this.pickerData,
                useDate = [
                    years[yIndex],
                    months[mIndex],
                    days[dIndex]
                ]
			if(type === 'start') {
				useDate = dayjs(`${useDate.join('-')} 00:00:00`,'YYYY-MM-DD HH:mm:ss').unix()
			}
			if(type === 'end') {
				useDate = dayjs(`${useDate.join('-')} 23:59:59`,'YYYY-MM-DD HH:mm:ss').unix()
			}
            return useDate
        },
        /**
			 * 获取商家信息
			 */
        getMerchantData() {
            let _this = this
            App._get('merchant.order/getStoreAndUser', {
                bus_id: _this.bus_id,
                bus_new: 1
            }, res => {
                let data = res.data
                data.unshift({
                    id: 0,
                    name: '所有门店'
                })
                _this.merchantData.push(...data)
            })
        },
        /**
			 * 获取记录列表
			 */
        getCheckRecords(page, isPage = false) {
            let _this = this,
                {
                    store_id, // 门店id
                    mid, // 店员id
                    searchName: name, // 搜索门店/店员名字
                    searchTime: time, // （day今日，yesterday昨日，week7日，数组时间戳自定义
                    type, // 搜索类型
                    bus_id,
                    goods_id
                } = _this,
                params = {
                    bus_id,
                    goods_id: goods_id === 0 ? '' : goods_id,
                    bus_new: 1,
                    store_id: store_id === 0 ? '' : store_id,
                    mid: mid === 0 ? '' : mid,
                    name,
                    time,
                    type,
                    page
                }
            App._get('merchant.order/newCheckRecords', params, res => {
                let data = res.data
                if (isPage) {
                    if (data.data.length > 0) {
                        _this.checkData.data.push(...data.data)
                    }
                } else {
                    _this.checkData = data
                }
                _this.showLoadmore = data.data.length == data.per_page
                _this.page = page
                App.hideLoading()
                uni.hideLoading()
            })
        }
    },

    /**
		 * 滑动到底部
		 */
    onReachBottom() {
        let {
            checkData
        } = this
        if (this.page <= checkData.last_page) {
            this.getCheckRecords(++this.page, true)
        };
    }
}
</script>

<style lang="scss" scoped>
	.check-filter {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 5;

		.check-search {
			padding: 30rpx 30rpx 0;
			box-sizing: border-box;

			&.assistant {
				padding: 30rpx;
			}

			.icon-search_light {
				position: absolute;
				top: 50%;
				left: 20rpx;
				font-size: 36rpx;
				width: 1em;
				height: 1em;
				line-height: 1em;
				transform: translateY(-50%);
			}

			.search-input {
				height: 76rpx;
				line-height: 76rpx;
				background: #F6F6F6;
				border-radius: 76rpx;
				padding-left: 70rpx;
			}

			.icon-search_light {}

			.filter-date {
				margin-left: 30rpx;

				.icon-filter {
					margin-left: 8rpx;
				}
			}
		}

		.check-merchant {
			height: 86rpx;
			line-height: 86rpx;

			.check-item {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				text-align: center;
				flex: 1;
				min-width: 0;


				.check-item-text {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					// &::after {
					// 	content: " ";
					// 	width: 0;
					// 	height: 0;
					// 	position: absolute;
					// 	top: 50%;
					// 	right: -28rpx;
					// 	margin-top: -4rpx;
					// 	border: 10rpx solid transparent;
					// 	border-top-color: #999999;
					// }
				}
				.check-item__icon {
					flex-shrink: 0;
					display: block;
					content: "\20";
					width: 0;
					height: 0;
					margin-left: 16rpx;
					border: 10rpx solid transparent;
					border-top-color: #999999;
					transform: translateY(6rpx);
				}

				&.active {
					font-weight: bold;
					.check-item__icon {
						border: 10rpx solid transparent;
						border-bottom-color: #FFD940;
						border-bottom-color: var(--theme-color);
						transform: translateY(-6rpx);
					}
					// .check-item-text {
					// 	&::after {
					// 		margin-top: -14rpx;
					// 		border: 10rpx solid transparent;
					// 		border-bottom-color: #FFD940;
					// 		border-bottom-color: var(--theme-color);
					// 	}
					// }

				}
			}
		}
	}

	// 筛选下拉
	.merchant-pop-maks {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 3;
		background: rgba($color: #000000, $alpha: .5);
	}

	.check-merchant-pop {
		position: fixed;
		top: 190rpx;
		left: 0;
		right: 0;
		z-index: 3;
		background: #FFFFFF;
		border-radius: 0 0 20rpx 20rpx;
		transform: translateY(-100%);
		opacity: 0;
		transition: all ease .3s;

		&.show {
			transform: translateY(0);
			opacity: 1;
		}

		.merchant-list {
			max-height: 516rpx;
			padding: 0 30rpx;
			border-top: 1rpx solid #F8F8F8;

			.merchant-item {
				height: 86rpx;
				line-height: 86rpx;
				position: relative;

				&.active {
					font-weight: bold;
				}

				.active-icon {
					position: absolute;
					top: 50%;
					right: 50rpx;
					transform: translateY(-50%);
					width: 32rpx;
					height: 32rpx;
					display: block;
					border-radius: 50%;
				}
			}
		}
	}

	.check-date {
		width: 600rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		overflow: hidden;
		box-sizing: border-box;

		.check-date-title {
			padding-top: 30rpx;
		}

		.check-date-type {
			margin-top: 30rpx;
			padding: 0 30rpx;

			.date-item {
				height: 68rpx;
				line-height: 68rpx;
				border-radius: 68rpx;
				border: 1rpx solid #EEEEEE;
				width: 30%;
				margin: 0 1.42% 30rpx;
				box-sizing: border-box;
				position: relative;

				&.active {
					// background: #FFF3C5;
					// background: var(--theme-color);
					opacity: 0.8;
					border: 1rpx solid #FFD940;
					border: 1rpx solid var(--theme-color);
					color: var(--theme-color);
				}

				.data-radio {
					position: absolute;
					top: 0;
					right: 0;
					left: 0;
					bottom: 0;
					z-index: 1;
					opacity: 0;
				}
			}
		}

		//时间自定义
		.date-customize {
			margin-top: 40rpx;
			padding: 0 30rpx 30rpx;

			.customize-title {
				margin-bottom: 30rpx;
			}

			.customize-time {
				overflow: hidden;
				background-color: #FFFFFF;
				z-index: 10;
				height: 102px;
				position: relative;

				.customize-picker-mask {
					position: absolute;
					top: 34px;
					left: 0;
					right: 0;
					height: 34px;
					line-height: 34px;
					z-index: 3;

					.picker-mask-item {
						font-size: 30rpx;
						color: #333333;
						flex: 1;
						padding-right: 12rpx;
						text-align: right;
						height: 34px;
						line-height: 32px;
					}
				}

				.picker-view {
					position: relative;
					z-index: 10;
					height: 100%;
				}

				.picker-item {
					text-align: center;
					width: 100%;
					height: 34px;
					line-height: 34px;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 28rpx;
					color: #333333;
					z-index: 2;
				}
			}

		}

		//提交按钮
		.check-date-btns {
			border-top: 1rpx solid #EEEEEE;

			.check-date-btn {
				flex: 1;
				height: 86rpx;
				line-height: 86rpx;
				text-align: center;
				color: #333333;

				&.confirm {
					background: #FFD940;


				}
			}
		}
	}

	.check-orders {
		margin-top: 222rpx;

		&.assistant {
			margin-top: 136rpx;
		}

		.check-orders-total {
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
		}

		.check-order-item {
			padding: 0 30rpx;
			margin: 0 30rpx 20rpx 30rpx;
			border-radius: 6rpx;
		}

		.check-order-title {
			height: 82rpx;
		}

		.handle-list {}

		.handle-item {
			height: 55rpx;
			line-height: 55rpx;
		}
	}


	.indicator {}
</style>
