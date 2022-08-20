<template>
	<view class="col-3" :style="themeColor" style="padding: 20rpx;box-sizing: border-box;">
		<view class="col-9 f-28  m-left12 " >请选择预约时间</view>
		<view class="dis-flex  flex-y-center f-24 flex-warp item-part" >
			<block v-if="stockData.length">
				<view class="item t-c" v-for="(item,index) in stockData" :key='index' @click="check(index)" :class="{'active auxiliary-color':item.check==true}">
					<view class="m-top10 col-9" :class="{' auxiliary-color':item.check==true}">{{item.week}}</view>
					<view class="m-top10 f-28 f-w"  :class="{' auxiliary-color':item.check==true}">{{item.stock}}</view>
					<view class="m-top10 col-9"  :class="{' auxiliary-color':item.check==true}">库存：{{item.kucun}}</view>
				</view>
			</block>
			<block v-else>
				<view class="nothing">没有可选择的预约时间</view>
			</block>


		</view>

		<view class="btn dis-flex flex-x-around flex-y-center f-28">

			<view class="col-9 t-c" style="width: 40%;background-color: #F8F8F8;" @click="cancel">取消</view>
			<view class="main-bg-color auxiliary-color t-c" style="width: 60%;" @click="back">确定</view>
		</view>

	</view>
</template>

<script>
import App from '@/common/js/app.js'
export default {
    data() {
        return {
            options: {},
            time: '',
            stockData: [],
            dayStock: 0

        }
    },
    methods: {
        getStockData() {
			  let {
			  	goods_id,
			  	attr_id: attr_id = ''
			  } = this.options
			  App._post_form('Goods/getReservationAll', {
			  	goods_id,
			  	attr_id
			  }, res => {
				  console.log(res, 'res=======')

				  let isIos = uni.getSystemInfoSync().model.indexOf('iPhone') !== -1
				  this.stockData = res.data
				  this.stockData.forEach(item => {
					  let time = new Date(item.ymd_c * 1000)
					  let weeks = [
                        '星期日',
                        '星期一',
                        '星期二',
                        '星期三',
                        '星期四',
                        '星期五',
                        '星期六'
                    ]

					  // item.stock = isIos ? `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}` : `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
					  item.stock = `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`
					  item.week = weeks[time.getDay()]
					  this.$set(item, 'check', false)
				  })
				  console.log(this.stockData, 'this.stockData')


			  })
        },
        check(index) {
            this.stockData.forEach((item, index1) => {
                this.$set(item, 'check', false)
            })
            this.$set(this.stockData[index], 'check', true)
            this.time = this.stockData[index].stock
            this.dayStock = this.stockData[index].kucun
            if (!this.dayStock) {
                this.time = ''
            }
        },
        back() {
            var pages = getCurrentPages()
            var prevPage = pages[pages.length - 2] // 上一个页面
            prevPage.$vm.time = this.time
            // 验证是否选择时间
            if (!this.time) {
                App.showError('请选择时间')
                return

            }
            // 验证预约当天的库存
            if (!this.dayStock) {
                App.showError('该天库存为0，请选择其他日期进行预约哦~')
                return
            }
            uni.navigateBack({ // uni.navigateTo跳转的返回，默认1为返回上一级
                delta: 1
            })
        },
        cancel() {
            this.time = ''
            uni.navigateBack({
                delta: 1
            })
        }
    },
    onLoad(options) {
        this.options = options

    },
    onShow() {
        this.getStockData()
    }
}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.item-part {

		box-sizing: border-box;
		margin-bottom: 100rpx;
	}
   .item {
	   background-color: #FFFFFF;
	   padding: 10rpx;
	   box-sizing: border-box;
	   width: 24%;
	   margin-top: 20rpx;
	   margin-left: 1%;
	   border: 1px solid rgba(51,51,51,1);

   }
   .active{
	       background-color: var(--theme-color);
   		   border-color: var(--theme-color);
   }
	.btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		view {

			height: 100%;
			line-height: 100rpx;
		}

	}
</style>
