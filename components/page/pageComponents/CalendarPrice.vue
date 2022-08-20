<!-- 这个组件仅适用于票务下单页面 -->
<template>
	<view class="c-calendar-price price-font-family">
		<!-- 头部 -->
		<view class="c-calendar-price__header">
			选择使用日期
		</view>
		<!-- 头部 end -->
		<!-- 月份选择区域 -->
		<scroll-view scroll-x class="months-list-scroll">
			<view class="months-list">
				<view class="months-item" v-for="(item,index) in cMonthsList" :key="item.id" :class="{'is-active':index === monthsActive}"
				 @click="handleMonthsItemClick(item,index)">
					<view class="months-card">
						<view class="months-card__text is-strong">{{item.monthStr}}</view>
						<view class="months-card__text">{{item.yearStr}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 月份选择区域 end -->
		<!-- 星期显示区域 -->
		<view class="week-list">
			<view class="week-item" v-for="item in weekList" :key="item.cn">{{item.cn}}</view>
		</view>
		<!-- 星期显示区域 end -->
		<!-- 日期显示区域 -->
		<view class="days-list">
			<view v-for="(item,index) in cDaysList" :key="item.day" class="days-item" :class="{'is-active':item.active}">
				<!-- 不知道为什么cDaysList[index]直接用item不行。。 -->
				<view class="days-card" @click="handleDaysItemClick(cDaysList[index],index)">
					<view class="days-card__day">
						{{item.dayStr}}
					</view>
					<view class="days-card__price">
						{{item.priceStr}}
					</view>
					<view v-if="item.numStr" class="days-card__price">
						{{item.numStr}}
					</view>
				</view>
			</view>
		</view>
		<!-- 日期显示区域 end -->
		<!-- 按钮区域 -->
		<view class="op-wrapper">
			<button class="c-calendar-price__btn-op btn-normal" @click="handleBtnComfirmClick">确认</button>
		</view>
		<!-- 按钮区域 end -->
	</view>
</template>


<script>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'


dayjs.extend(duration)

export default {
    props: {
        // 当前可选起始时间（日期），格式为13位时间戳或YYYY-MM-DD，默认为当前时间
        minDate: {
            type: [
                String,
                Number
            ],
            default: +dayjs()
        },
        // 当前可选结束时间（日期），格式为13位时间戳或YYYY-MM-DD，默认为起始时间一年后的那个月的最后一天
        maxDate: {
            type: [
                String,
                Number
            ],
            default: +dayjs().add(12, 'month')
        },
        // 自定义日历天里面要显示东西
        // 以id命中，格式为YYYYMMDD
        customDayData: {
            type: Array,
            default() {
                return [
                    // {
                    // 	id: '20200101',
                    // 	priceStr: '￥999起'
                    // }
                ]
            }
        },
        // 激活项的id
        value: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            // 当前选择的月份的索引
            monthsActive: 0,
            // 星期几列表数据
            weekList: [
                {
                    cn: '日'
                },
                {
                    cn: '一'
                },
                {
                    cn: '二'
                },
                {
                    cn: '三'
                },
                {
                    cn: '四'
                },
                {
                    cn: '五'
                },
                {
                    cn: '六'
                }
            ]
        }
    },
    computed: {
        // 格式化的开始时间（确保是13位），如果不合法则返回0
        cMinDateTimeStamp() {
            return this.toTimeStamp(this.minDate)
        },
        // 格式化的结束时间（确保是13位），如果不合法则返回0
        cMaxDateTimeStamp() {
            return this.toTimeStamp(this.maxDate)
        },
        // 开始时间和结束时间之间的差量
        cDuration() {
            return dayjs.duration(this.cMaxDateTimeStamp - this.cMinDateTimeStamp)
        },
        // 顶部可选的月份
        cMonthsList() {
            // 一共需要展示多少个月
            let len = Math.ceil(this.cDuration.asMonths())
            // 结果数组
            const monthsList = []
            // 起始时间，dayjs对象
            const startDate = dayjs(this.cMinDateTimeStamp)
            for (let i = 0; i < len; i++) {
                // 当前循环项时间，dayjs对象
                const currentDate = dayjs(this.cMinDateTimeStamp).add(i, 'months')
                monthsList.push({
                    id: currentDate.format('YYYYMM'),
                    index: i,
                    // 13位时间戳
                    timeStamp: +currentDate,
                    // 年份'YYYY年'
                    yearStr: currentDate.format('YYYY年'),
                    // 月份'M月'
                    monthStr: currentDate.format('M月')
                })
            }
            return monthsList
        },
        // 当前需要显示日期项（包括空白的日期项）
        cDaysList() {
            // 当前月
            const currentMothStr = dayjs(this.cMonthsList[this.monthsActive].timeStamp).format('YYYY-MM')
            // 当前要计算日期的起始日期（当前月的第一天）
            const startDay = dayjs(currentMothStr)
            // 返回结果
            let daysList = []
            // 当前循环的日期
            let currentDay = startDay
            // 循环 直到月份变化
            while (currentMothStr === currentDay.format('YYYY-MM')) {
                // 当前项的id
                const id = currentDay.format('YYYYMMDD')
                // 当前项日期部分显示的字符串
                const dayStr = currentDay.format('D')
                // 当前项由props传入的数据
                const customData = this.customDayData.find(item => id === item.id) || {}
                // 当前项是否不可选（customData.id耦合性有点高）（认为有自定义data且当前时间在今天及之后才可选）
                const disabled = !!(!customData.id || currentDay.isBefore(this.minDate, 'day'))
                daysList.push({
                    id,
                    // 当前要显示的日期字符串
                    dayStr,
                    // 时间戳
                    timeStamp: +currentDay,
                    // 价格字符串
                    priceStr: '',
					numStr: '',
                    // 是否不可选
                    disabled,
                    // 是否处于激活状态
                    active: this.value.indexOf(id) !== -1,
                    ...customData
                })
                currentDay = currentDay.add(1, 'day')
            }
            // 偏移量
            const offset = dayjs(startDay).day()
            // 偏移数组
            const offsetArr = []
            for (let i = 0; i < offset; i++) {
                offsetArr.push({
                    id: `offset${i}`,
                    dayStr: '',
                    // 价格字符串
                    priceStr: '',
					numStr: '',
                    // 是否不可选
                    disabled: true
                })
            }
            // 返回结果
			console.log('返回结果',{offsetArr,daysList,customDayData:this.customDayData})
            return [
                ...offsetArr,
                ...daysList
            ]
        }
    },
    methods: {
        // 确定按钮点击事件
        handleBtnComfirmClick() {
            this.$emit('on-btn-confirm')
        },
        // 月份点击事件
        handleMonthsItemClick(item, index) {
            this.monthsActive = index
        },
        // 日期点击事件
        handleDaysItemClick(item, index) {
            this.$emit('on-day-click', item, index)
        },
        /**
		 * 这个方法有问题 忽略了毫秒时间戳不一定是13位
		 * 安全地取得13位时间戳
		 * 如果不能得到13位时间戳 则返回0
		 * @param {Object|string|number} date
		 */
        toTimeStamp(date) {
            // 如果是13位数字，直接返回
            if (typeof date === 'number' && (''+date).length === 13) {
                return date
            }
            // 如果是10位数字，最后加000返回
            if (typeof date === 'number' && (''+date).length === 10) {
                return +`${date}000`
            }
            // 如果date存在，判断是不是合法的日期，不是就返回0
            if (date) {
                const day = dayjs(date)
                return day.isValid() ? +day : 0
            }
            return 0
        }
    }

}
</script>

<style lang="scss" scoped>
	.c-calendar-price {
		width: 100vw;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}

	.c-calendar-price__header {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 110rpx;
		padding: 0 30rpx;
		font-weight: bold;
		font-size: 32rpx;
		color: #333;
	}

	// 月份选择区域
	.months-list {
		display: inline-flex;
		align-items: center;
	}

	.months-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 146rpx;
		height: 100rpx;

		&.is-active::after,
		.is-active &::after {
			position: absolute;
			left: 50%;
			bottom: 0;
			display: block;
			content: "\20";
			width: 100rpx;
			height: 8rpx;
			background-color: #FFD940;
			border-radius: 4rpx 4rpx 0 0;
			transform: translateX(-50%);
		}
	}

	.months-card__text {
		font-size: 24rpx;
		color: #999;

		&.is-strong {
			font-size: 28rpx;
			color: #333;
		}
	}

	// 月份选择区域 end
	// 星期显示区域
	.week-list {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background-color: #F8F8F8;
		padding: 0 16rpx;
	}

	.week-item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 percentage(1/7);
		height: 80rpx;
		font-size: 26rpx;
		color: #333333;
	}

	// 星期显示区域 end
	// 日期显示区域
	.days-list {
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		padding: 8rpx 16rpx;
	}

	.days-item {
		display: flex;
		justify-content: center;
		flex-grow: 0;
		flex-shrink: 0;
		width: percentage(1/7);
		padding: 8rpx 0;
	}

	.days-card {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 110rpx;
		white-space: nowrap;
		border: 1px solid transparent;

		.is-active &,
		&.is-active {
			border-color: #FFD940;
			border-radius: 20rpx;
			background-color: #FFFCF2;
		}
	}

	.days-card__day {
		font-size: 32rpx;
		color: #333;
	}

	.days-card__price {
		font-size: 20rpx;
		color: #FF4444;
		line-height: 1.2;
	}

	// 日期显示区域 end
	// 按钮区域
	.op-wrapper {
		padding: 40rpx 30rpx;
		padding-top: 10rpx;
	}

	.c-calendar-price__btn-op {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 80rpx;
		background-color: #FFDA40;
		border-radius: 10rpx;
	}

	// 按钮区域 end
</style>
