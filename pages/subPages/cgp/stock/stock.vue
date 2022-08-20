<template>
	<view :style="themeColor">
		<view class="b-f stock-header">
			<!-- 顶部明细 -->
			<view class="dis-flex flex-y-center flex-x-between">
				<view class="stock-top">
					<view class="f-24 col-9 m-top12">总备货量</view>
					<view class="f-w f-30 col-3 m-top12">{{stockData.sum_stock_num}}</view>
				</view>
				<view class="stock-top">
					<view class="f-24 col-9 m-top12">备货中数量</view>
					<view class="f-w f-30 col-3 m-top12">{{stockData.stock_on_num}}</view>
				</view>
				<view class="stock-top">
					<view class="f-24 col-9 m-top12">已确认数量</view>
					<view class="f-w f-30 col-3 m-top12">{{stockData.stock_up_num}}</view>
				</view>
			</view>
			<view class="dis-flex flex-x-between detail-top-right f-24 padding-all-box36 col-3" style="padding-top: 0;">
				<picker mode="date" :value="date" :start="startDate" :end="endDate" style="padding-top: 0;width: 90%;" @change="bindDateChange">
					<view class="dis-flex">
						<image src="/static/images/grouppurchase/riqi.png" style="width: 30rpx;height: 30rpx;"></image>
						<view class=" f-w m-left12">{{date?date:'请选择日期'}}</view>
					</view>
				</picker>
				<view class="f-w m-left12 t-r" style="width: 10%;" @click="reset">重置</view>
			</view>

		</view>
		<block v-if="stockData.data">
			<view class="stock-content" v-for="(item,index) in stockData.data" :key='index'>
				<view class="dis-flex flex-x-between stock-top-right m-top20">
					<view class="f-24 f-w col-9">{{item.stockTime}}</view>
					<view class="f-24 f-w col-3 main-bg-color auxiliary-color" style="padding: 5rpx 10rpx 5rpx 10rpx" v-if="!item.all" @click="confirmStock(item.stockTime)">确认到货</view>
					<view class="f-24 f-w col-3 main-bg-color auxiliary-color" style="padding: 5rpx 10rpx 5rpx 10rpx" v-else>已全部到货</view>
				</view>
				<view class="p-left-right-30">
					<view class="dis-flex b-f flex-x-between bor-radius-20">
						<view class="stock-content-top">
							<view class="f-24 col-9 m-top12">备货量</view>
							<view class="f-w f-30 col-3 m-top12">{{item.total_num}}</view>
						</view>
						<view class="stock-content-top">
							<view class="f-24 col-9 m-top12">订单数量</view>
							<view class="f-w f-30 col-3 m-top12">{{item.order_num}}</view>
						</view>
						<view class="stock-content-top">
							<view class="f-24 col-9 m-top12">提货人数</view>
							<view class="f-w f-30 col-3 m-top12">{{item.number}}</view>
						</view>
					</view>
					<view class="m-top20 dis-flex flex-warp flex-x-between">
						<view style="width: 48%;" class="m-top20 " v-for="(goodsItem,index1) in item.goods_lists" :key='index1'>
							<image :src='goodsItem.goods_img' class="dis-block"></image>
							<view class="b-f" style="padding:0 10rpx;overflow: hidden;">
								<view class="f-28 col-3 twolist-hidden m-top10">{{goodsItem.goods_name}}</view>
								<view class="dis-flex flex-x-between flex-y-center m-top10 m-btm20">
									<view class="f-24 col-9 ">数量：{{goodsItem.total_num}}</view>
									<view class="f-24 f-w col-9" style="background: #F8F8F8;padding: 5rpx 10rpx 5rpx 10rpx" v-if="goodsItem.status==3">已确认</view>
									<view class="f-24 f-w col-9" style="background: #F8F8F8;padding: 5rpx 10rpx 5rpx 10rpx" v-if="goodsItem.status==1">未备货</view>
									<checkbox value="" color="#FFCC33" style="transform:scale(0.7)" v-if="goodsItem.status==2" :checked="goodsItem.checked"
									 @click="getGoodsId(goodsItem,item.stockTime)" />
									 
									 

								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>

		<block v-else>
			<view class="f-24 col-6 nothing">
				暂无备货
			</view>
		</block>

	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				date: '',
				stockData: {},
				stockTime: '',
				timeObj: {}

			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		watch: {
			settingData: {
				handler(val) {
					console.log('哈哈哈哈哈哈哈哈',val)
					this.shareData = this.pageShareMixin_createShareData({
						title: this.$util.deepGet(val, 'cgp.share_title'),
						desc: this.$util.deepGet(val, 'cgp.share_text', ''),
						imgUrl: this.$util.deepGet(val, 'cgp.share_image', '')
					})
				},
				immediate: true
			}
		},
		components: {},
		methods: {
			bindDateChange: function(e) {
				this.date = e.target.value
				this.getStockData()
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getStockData() {
				let date = this.date ? new Date(this.date).getTime() : ''
				App._post_form('cgp.Reg/regStock', {
					stock_time: date
				}, res => {
					this.timeObj = {}
					this.stockData = res.data
	
					this.stockData.data.forEach(item => {
						this.timeObj[item.stockTime] = []
						let flag = true
						item.goods_lists.forEach(item1 => {
							this.$set(item1,'checked',false)
							// item1.checked = false
							if (item1.reg_yes == 2) {
								flag = false
							}
						})
						flag ? item.all = true : item.all = false
					})
				})

			},
			reset(){
				this.date = ''
	
				this.getStockData()
			},
			getGoodsId(goodsItem, time) {
				goodsItem.checked ? goodsItem.checked = false : goodsItem.checked = true

				if (goodsItem.checked) {
					this.timeObj[time].push(goodsItem.goods_id)
				} else {
					this.timeObj[time].splice(this.timeObj[time].indexOf(goodsItem.goods_id), 1)
				}


			},
			confirmStock(time) {
				// console.log(time,'===========time')
				// console.log(this.timeObj,'===========this.timeObj')
				let goodsId = this.timeObj[time],
					stockTime = new Date(time).getTime()
					console.log(this.timeObj,'goodsId============')
					// return false
				if (!goodsId.length) {
					uni.showToast({
						icon: "none",
						title: "请选择商品"
					})
					return false
				}

				App._post_form('cgp.Reg/confirm', {
					stockTime: stockTime,
					goods_ids: goodsId
				}, res => {
					const {
						msg
					} = res
					uni.showToast({
						title: msg
					})
					this.getStockData()

				})

			}

		},
		onShow() {
			this.getStockData()
		}
	}
</script>

<style>
	.stock-top {
		padding: 45rpx;
		text-align: center;
	}

	.stock-top-right {
		padding: 10rpx 40rpx 10rpx 40rpx;
	}

	.stock-content image {
		width: 100%;
		height: 180rpx;
		border-radius: 10rpx;
	}

	.stock-content-top {
		padding: 10rpx 40rpx 10rpx 40rpx;
		text-align: center;
	}

	.card-icon {
		color: #FE504F;
	}
</style>
