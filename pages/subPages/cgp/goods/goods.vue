<template>
	<view :style="themeColor">
		<view class="b-f detail-header">
			<!-- 顶部明细 -->
			<view class="dis-flex flex-y-center flex-x-between">
				<view class="detail-top">
					<view class="f-24 col-9 m-top12">总提货单数</view>
					<view class="f-w f-30 col-3 m-top12">{{goodsData.sum_zt_num}}</view>
				</view>
				<view class="detail-top">
					<view class="f-24 col-9 m-top12">已提单数</view>
					<view class="f-w f-30 col-3 m-top12">{{goodsData.y_zt_num}}</view>
				</view>
				<view class="detail-top">
					<view class="f-24 col-9 m-top12">未提单数</view>
					<view class="f-w f-30 col-3 m-top12">{{goodsData.w_zt_num}}</view>
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
		<view class="detail-content padding-box-all" v-for="(item,index) in goodsData.data" :key='index'>
			<view class="dis-flex flex-x-between p-top-bom-20">
				<view class="f-24 f-w col-9">{{item.stockTime?item.stockTime:date}}</view>
				<view class="dis-flex">
					<view class="f-24 f-w main-bg-color auxiliary-color"  style="padding: 5rpx 10rpx 5rpx 10rpx" @click="confirmTake(item.stockTime)">提醒提货</view>
					<!-- <view class="f-24 f-w" v-else style="background: #FFD940;padding: 5rpx 10rpx 5rpx 10rpx" >已全部提货</view> -->
				</view>
			</view>
			<view class="bor-radius-20 ">
				<view class="dis-flex flex-y-center flex-x-between b-f ">
					<view class="detail-top">
						<view class="f-24 col-9 m-top12">当日提货单数</view>
						<view class="f-w f-30 col-3 m-top12">{{item.now_date_num?item.now_date_num:0}}</view>
					</view>
					<view class="detail-top">
						<view class="f-24 col-9 m-top12">已提单数</view>
						<view class="f-w f-30 col-3 m-top12">{{item.y_zt_num?item.y_zt_num:0}}</view>
					</view>
					<view class="detail-top">
						<view class="f-24 col-9 m-top12">未提单数</view>
						<view class="f-w f-30 col-3 m-top12">{{item.w_zt_num?item.w_zt_num:0}}</view>
					</view>
				</view>
				<block v-if="item.order_lists.length">
					<view class="dis-flex flex-y-center  b-f item" v-for="(goodsItem,index1) in item.order_lists" :key='index1'>
						<image :src="goodsItem.goods_img" style="width: 110rpx;height: 110rpx;" class="m-right12 bor-radius-10"></image>
						<view class="left-item dis-flex flex-dir-column  flex-x-between">
							<view class="dis-flex flex-y-center flex-x-between">
								<view class="f-28 f-w">{{goodsItem.goods_name}}</view>
								<view class="f-24 col-9 " :style="goodsItem.is_zt==2?'color:#2AC418':''">{{goodsItem.is_zt==1?'已提货':'未提货'}}</view>
							</view>
							<view class="f-24 col-9">
								<view class="">提货人：{{goodsItem.name}}</view>
							</view>
							<view class="f-24 col-9 dis-flex flex-x-between">
								<view>下单时间：{{goodsItem.create_time}}</view>
								<view>数量：{{goodsItem.total_num}}件</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="nothing f-24 col-6">
						暂无提货
					</view>
				</block>

			</view>

		</view>
		<load-more :showLoadmore="!isMore"></load-more>
	</view>
</template>



<script>
	import App from "@/common/js/app.js"
	import LoadMore from "@/components/template/Loadmore.vue"
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [pageShareMixin],
		components: {
			LoadMore
		},
		data() {
			return {
				isMore: true,
				page: 1,
				date: '',
				goodsData: {
					data: []
				},
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
		onReachBottom() {
			let _this = this,
				goodsData = _this.goodsData;
			_this.page++
			if (_this.page <= goodsData.last_page) {
				_this.getGoodsData()
			}

		},
		methods: {
			bindDateChange: function(e) {
				this.page = 1
				this.goodsData.data = []
				this.goodsData.sum_zt_num = 0
				this.goodsData.w_zt_num = 0
				this.goodsData.y_zt_num = 0
				this.date = e.target.value
				this.getGoodsData()
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
			confirmTake(time) {
				App._post_form('cgp.Reg/cgpReminder', {
					stock_time: time
				}, res => {
					let {
						msg,
						code
					} = res
					uni.showToast({
						icon: 'none',
						title:code == 1?'提醒成功': msg
					})
					if(code ==1) {
						this.goodsData.data = []
						this.getGoodsData()
	
					}
	

				})

			},
			getGoodsData() {
				let date = this.date ? new Date(this.date).getTime() : ''
				App._post_form('cgp.Reg/ztDetail', {
					stock_time: date,
					page: this.page
				}, res => {
					console.log(res,'===================res')
					let {
						sum_zt_num,
						w_zt_num,
						y_zt_num
					} = res.data
					this.goodsData.sum_zt_num = sum_zt_num
					this.goodsData.w_zt_num = w_zt_num
					this.goodsData.y_zt_num = y_zt_num
					this.goodsData.last_page = res.data.last_page?res.data.last_page:0
					let total = res.data.total?res.data.total:0
	
					res.data.data&&res.data.data.length&&this.goodsData.data.push(...res.data.data)
					this.goodsData.data.forEach(item => {
						let flag = true
						item.order_lists.forEach(item1 => {
							item.is_zt == 2?flag = false:""
						})
						!flag ? item.all = false :item.all = true
					})
	
					this.page >= this.goodsData.last_page || total==0? this.isMore = false : '';
				})

			},
			reset(){
				this.page = 1
				this.goodsData.data = []
				this.goodsData.sum_zt_num = 0
				this.goodsData.w_zt_num = 0
				this.goodsData.y_zt_num = 0
				this.date = ''
				this.getGoodsData()
			}
		},
		onLaunch(){
			this.page = 1
			this.goodsData.data = []
			this.goodsData.sum_zt_num = 0
			this.goodsData.w_zt_num = 0
			this.goodsData.y_zt_num = 0
			this.date = ''
		},
		onShow() {
			this.page = 1
			this.goodsData.data = []
			this.goodsData.sum_zt_num = 0
			this.goodsData.w_zt_num = 0
			this.goodsData.y_zt_num = 0
			this.date = ''
			this.getGoodsData()
		}
	}
</script>

<style>
	.detail-top {
		padding: 30rpx 30rpx 30rpx 30rpx;
		text-align: center;
	}

	.detail-top-right {
		padding: 20rpx 40rpx 20rpx 40rpx;
	}

	/* .item{
		 width: 100%;
		 padding: 20rpx 30rpx;
		 height: 220rpx;
		 box-sizing: border-box;
		 
		 
	 }
	 .left-item {
	 			 width:calc(100% - 200rpx) ;
	 } */

	.item {
		width: 100%;
		padding: 10rpx 30rpx;
		height: 150rpx;
		box-sizing: border-box;


	}

	.left-item {
		width: calc(100% - 110rpx);
		height: 110rpx;
	}
</style>
