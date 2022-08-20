<template>
	<view class="" :style="themeColor">
		<view class="main  f-28">
			<view class="b-f padding-all-box36 m-btm20">
				<view style="border-bottom: 1rpx solid #EEEEEE;" class="form-item dis-flex flex-x-between  flex-y-center  b-f"
				 @click="calendarPricePopupVisible = true">
					<view class="col-3">选择日期</view>
					<view class="m-left12 col-3">
						{{time || '请选择使用日期'}}
						<text class="iconfont icon-jinrujiantou col-6 m-left12"></text>
					</view>
				</view>
				<view class="dis-flex flex-x-between flex-y-center   b-f form-item">
					<view class="col-3">选择预约门店</view>
					<view class="m-left12 col-3 dis-flex  flex-x-end">
						<picker @change="bindPickerChange" :value="index" :range="mechart" style="width:440rpx;">
							<view class="uni-input t-r">{{mechart[index]}}</view>

						</picker>
						<view class="iconfont icon-jinrujiantou col-6 m-left12"></view>


					</view>
				</view>
			</view>

			<!-- 核销码 -->
			<view class="m-btm20 b-f padding-all-box36" v-if="options.type!=1">
				<view class="form-item" style="border-bottom: 1rpx solid #EEEEEE;">核销码</view>
				<view class="col-3 f-28 f-w m-top40" v-for="(item,index) in code">
					{{item.code}}

				</view>
			</view>
			<!-- 备注 -->
			<view class="padding-all-box36 b-f">
				<view class="">留言备注</view>
				<view class="col-6">

					<textarea v-model="remark" placeholder-style='' placeholder="给商家留言备注" class="area" />
					</view>
				</view>

		</view>
		<view class="btn main-bg-color auxiliary-color t-c f-28" @click="submit">
			立即预约
		</view>
		<!-- 日历价格选择弹窗 -->
		<popup-view :show="calendarPricePopupVisible" type="bottom">
			<calendar-price :value="calendarPriceValue" :customDayData="cCustomDayData" @on-day-click="handleCalendarPriceItemClick" @on-btn-confirm="calendarPricePopupVisible = false" />
		</popup-view>
		<!-- 日历价格选择弹窗 end -->

	</view>
</template>

<script>
import {
    wxRequestSubscribeMessage
} from '@/common/js/wxPromise.js'
import App from '@/common/js/app.js'
import dayjs from 'dayjs'
import {dateFormat} from '@/common/js/date.js'
import PopupView from '@/components/template/PopManager.vue'
import CalendarPrice from '@/components/page/pageComponents/CalendarPrice.vue'
export default {
    components: {
        PopupView,
        CalendarPrice
    },
    data() {
        return {
            mechart: [],
            index: 0,
            options: {},
            num: 0,
            // 预约时间,格式是这样的2021/1/21
            time: '',
            remark: '',
            mechartDetail: [],
            stock: '',
            code: [],
            // 日历价格是否显示
            calendarPricePopupVisible: false,
			// 当前选中的日历价格的id（数组）
			calendarPriceValue: [],
			// 当前预约时间的接口数据
			reservationAllRes: []
        }
    },
    computed: {
        isMeal() {
            return this.options.is_meal && this.options.is_meal == 1
        },
		// 格式化的日历价格自定义数据
		cCustomDayData() {
			const data = this.reservationAllRes || []
			return data.filter(item=>item.id && item.ymd && item.kucun).map(item=>({
				id: item.ymd,
				priceStr: `${item.text}: ${item.kucun}`,
				timeStamp: item.ymd_c * 1000,
				_source: item
			}))
		}
    },
    methods: {
		// 日历价格项点击事件
		handleCalendarPriceItemClick(item, index) {
			const day = this.cCustomDayData.find(day=>day.id === item.id)
			if(day){
				this.calendarPriceValue = [item.id]
				this.time = dateFormat(day.timeStamp,{
					format: 'YYYY/MM/DD',
					fallback: ''
				})
			}
		},
        bindPickerChange(e) {
            this.index = e.target.value
            this.stock = this.mechartDetail[e.target.value].id

        },
        // 加减消费数量
        numChange(type) {
            if (type == 'down') {
                this.num > 0 && this.num--
            } else {
                this.num < this.options.num && this.num++
            }

        },
        // 获取商家对应的门店
        getBusList() {
            App._post_form('Business/lists', {
                bus_id: this.options.bus_id,
                goods_id: this.options.goods_id
            }, res => {
                this.mechart = res.data.map(item => item.name)

                this.mechartDetail = res.data
                if (this.options.type == 1) {
                    this.index = this.mechart.indexOf(this.options.storeBus) < 0 ? 0 : this.mechart.indexOf(this.options.storeBus)
                    this.stock = this.mechartDetail[this.index].id
                } else {
                    this.stock = this.mechartDetail[0].id

                }


            })
        },
        submit() {
            App.saveFormId('reserve')

            let {
                    stock: id = 0,
                    options: {
                        bus_id: bus_id = 0,
                        order_id: order_id = 0,
                        goods_id,
                        index: index1 = 0,
                        type

                    },
                    time,
                    mechart,
                    index,
                    remark: remark = '',
                    isMeal
                } = this,
                // time1 = new Date(time).getTime(),
                // 原始接口数据里明明有时间戳 不用 结果转换过来转换过去!!!
                time1 = +dayjs(`${time} 00:00:00`, 'YYYY/MM/DD HH:mm:ss'),
                pages = getCurrentPages(),
                prevPage = pages[pages.length - 2]
            console.log('time1--------', time1, time)
            // 为什么会这样去传值 用vuex会更好
            if (type == 1) {
                if (isMeal) {
                    prevPage.$vm.$set(prevPage.$vm.mealData[index1], 'time', time)
                    prevPage.$vm.$set(prevPage.$vm.mealData[index1], 'remarkSub', remark)
                    prevPage.$vm.$set(prevPage.$vm.mealData[index1], 'storeBus', mechart[index])
                    prevPage.$vm.$set(prevPage.$vm.mealData[index1], 'storeId', this.mechartDetail[index].id)
                    prevPage.$vm.back = true
						  console.log(prevPage, 'prevPage==========prevPageprevPageprevPage')
                } else {
                    prevPage.$vm.time = time
                    prevPage.$vm.remarkSub = remark
                    prevPage.$vm.storeBus = mechart[index]
                    prevPage.$vm.storeId = this.mechartDetail[index].id

                }
                uni.navigateBack({ // uni.navigateTo跳转的返回，默认1为返回上一级
                    delta: 1
                })


            } else {
                App._post_form('Goods/setReserve', {
                    id,
                    bus_id,
                    order_id,
                    goods_id,
                    time: time1,
                    remark
                }, res => {
                    if (res.code == 1) {
                        App.showSuccess('操作成功')
                        setTimeout(() => {
                            uni.navigateBack({
                                delta: 1
                            })
                        }, 500)

                    }

                })

            }


        },
        // 获取核销码
        getCode() {
            App._post_form('user.Order/getCode', { order_id: this.options.order_id }, res => {
                this.code = res.data

            })

        },
		async fetchReservationAllRes({
			goods_id,
			attr_id
		}={}) {
			try{
				const res = await App._getP('Goods/getReservationAll', {
                    goods_id: goods_id || this.options.goods_id || "",
                    attr_id: attr_id || this.options.goods_sku_id || "",
                })
				this.reservationAllRes = this.$util.deepGet(res, 'data', [])
			}catch(e){
				//TODO handle the exception
			}
		}

    },
    onShow() {
        this.getBusList()
        this.getCode()

    },
    onLoad(options) {
        this.options = options
        this.time = options.time
        let {
            time,
            storeBus,
            remark
        } = options
        if (options.type == 1) {
            this.setData({
                time,
                remark
            })
        }
		this.fetchReservationAllRes()
    }
}
</script>

<style lang="scss">
	page {
		// background-color: #fff;
	}
    .area {
		width:calc(100% - 32rpx) !important;
		padding:20rpx;
		height:230rpx;
		margin-top:20rpx;
		font-size: 28rpx;
		background:rgba(249,249,249,1);
		border-radius:8px;
	}
	.title {
		width: 100%;
		height: 170rpx;
	}
	.form-item {
		padding: 40rpx 0;
	}

	.content {
		margin-top: -160rpx;

		.info {}

		.main {
			background-color: #fff;
			border-radius: 30rpx 30rpx 0 0;

			.form-item {
				padding: 30rpx 0;
				border-bottom: 2rpx solid #E6E6E6;
				border-width: 80%;
			}
		}

	}

	.btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
	}

	.num-btn {
		width: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		margin: 0 4rpx;
		background: #F8F8F8;
		text-align: center;
		font-size: 24rpx;

		&.disabled {
			color: #999999;
		}
	}
</style>
