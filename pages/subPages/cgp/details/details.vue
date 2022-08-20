<template>
	<view :style="themeColor">
		<view class="b-f detail-header">
			<!-- 顶部明细 -->
			<view class="dis-flex flex-y-center flex-x-center">
				<view class="detail-top">
					<view class="f-24 col-9 m-top12">总利润(元)</view>
					<view class="f-w f-30 col-3 m-top12">{{orderDetail.sum_money}}</view>
				</view>
				<view class="detail-top">
					<view class="f-24 col-9 m-top12">已入账(元)</view>
					<view class="f-w f-30 col-3 m-top12">{{orderDetail.yrz_money}}</view>
				</view>
				<view class="detail-top">
					<view class="f-24 col-9 m-top12">未入账(元)</view>
					<view class="f-w f-30 col-3 m-top12">{{orderDetail.wrz_money}}</view>
				</view>
			</view>
			<!-- 搜索框 -->
			<view class="check-search dis-flex flex-y-center">
				
				<view class="search-input-box flex-box p-r">
					<view class="iconfont icon-search_light col-9"></view>
					<input type="text" class="search-input f-26" placeholder="请输入商品名称" placeholder-style="color:#999;font-size:26rpx;"
					 v-model="goods_name" confirm-type="search" @confirm="search" />
				</view>
				<view class="dis-flex flex-y-center filter-date col-3 f-w f-24" >
					<picker mode="date" :value="date" :start="startDate" :end="endDate"  fields='month' @change="bindDateChange">
						<view class="uni-input f-w time">{{date?date:'日期'}}</view> 
					</picker>
					<image src="/static/images/grouppurchase/riqi.png" style="width: 35rpx;height: 35rpx;"></image>
				</view>
				
				<view class=" reset col-3 f-w f-24" @click="reset">重置</view>
			</view>
			<!-- 按钮 -->
			<view class="dis-flex content-button flex-y-center flex-x-center ">
				<view class="content-content-a" v-for="(item,index) in semesterSelection" @click="setid(index)" :class="{active:current === index}"
				 :key="index">
					<view class="f-24">{{item.name}}</view>
				</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="m-top20 ">
			<view class="p-left-right-30">
				<view class="dis-flex flex-y-center  b-f item" v-for="(item,index) in orderDetail.data" :key='index'>
					<image :src="item.goods_img" style="width: 110rpx;height: 110rpx;" class="m-right12 bor-radius-10"></image>
					<view class="left-item dis-flex flex-dir-column  flex-x-between">
						<view class="dis-flex flex-y-center flex-x-between">
							<view class="f-28 f-w">{{item.goods_name}}</view>
							<view class="f-24 col-9 ">{{item.reg_is_reach==2?'未入账':'已入账'}}</view>
						</view>


						<view class="dis-flex flex-x-between f-24 col-9">
							<view >佣金：¥{{item.reg_money}}</view>
							<view class="f-24 col-9 ">数量：{{item.total_num}}</view>
						</view>
						<view class="f-24 col-9 dis-flex flex-x-between">
							<view >下单时间：{{item.create_time}}</view>

						</view>

					</view>
				</view>


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
		data() {
			return {
				date:'',
				isMore: true,
				page: 1,
				orderDetail: {
					data: [],
					sum_money: 0,
					yrz_money: 0,
					wrz_money: 0,
					last_page: 0


				},
				state: '',
				goods_name: '',
				current: 0,
				semesterSelection: [{
						name: '总利润'
					},
					{
						name: '已入账'
					},
					{
						name: '未入账'
					}
				],
				isShowDate: false, // 显示日期选择
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
		components: {
			LoadMore
		},
		watch:{
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
		methods: {
			bindDateChange: function(e) {
				this.page = 1
				this.date = e.target.value
				this.state = ''
				this.current = 0
				this.goods_name=''
				this.orderDetail = {
					data: [],
					sum_money: 0,
					yrz_money: 0,
					wrz_money: 0,
					last_page: 0
				}
				this.getOrderDetail()
			},
			reset(){
				this.page = 1
				this.date = ''
				this.state = ''
				this.current = 0
				this.goods_name=''
				this.orderDetail = {
					data: [],
					sum_money: 0,
					yrz_money: 0,
					wrz_money: 0,
					last_page: 0
				}
				this.getOrderDetail()
	
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
			search() {
				this.page = 1
				this.date = ''
				this.state = ''
				this.current = 0
				this.orderDetail = {
					data: [],
					sum_money: 0,
					yrz_money: 0,
					wrz_money: 0,
					last_page: 0
				}
				this.getOrderDetail()
			},
			setid(index) {
				this.page = 1
				this.orderDetail.data = []
				this.current = index;
				this.state = index ? index : ''
				this.getOrderDetail()
			},
			getOrderDetail() {
				App._post_form('cgp.Reg/regCoreDetail', {
					goods_name: this.goods_name,
					reg_is_reach: this.state,
					time:this.date?this.$util.getdate(this.date):'',
					page: this.page
				}, res => {
					this.orderDetail.data.push(...res.data.data)
					this.orderDetail.sum_money = res.data.sum_money
					this.orderDetail.yrz_money = res.data.yrz_money
					this.orderDetail.wrz_money = res.data.wrz_money
					this.orderDetail.last_page = res.data.last_page
					this.page >= this.orderDetail.last_page || res.data.total == 0 ? this.isMore = false : '';

				})
			}

		},
		onShow() {
			this.getOrderDetail()
			this.orderDetail.total == 0 ? this.isMore = false : ''
		},
		onReachBottom() {
			let _this = this,
				orderDetail = _this.orderDetail;
			this.page++
			if (_this.page <= orderDetail.last_page) {
				_this.getOrderDetail()
			}

		}
	}
</script>

<style lang="scss" scoped>
	.reset {
				 width: 100rpx;
				 height: 72rpx;
				 line-height: 72rpx;
				 text-align: center;
				 margin-left: 20rpx;
				 border-radius: 72rpx;
				 border: 1px solid #EEEEEE;
	}
	.time {
		height: 40rpx;
		line-height: 40rpx;;
		border-right: 1px solid #CCCCCC;
		padding-right: 10rpx;
		margin-right: 10rpx;
	}
	.item {
		width: 100%;
		padding: 10rpx 30rpx;
		height: 150rpx;
		box-sizing: border-box;


	}

	.left-item {
		width: calc(100% - 110rpx);
		height:110rpx;
	}

	.detail-top {
		padding: 30rpx 60rpx 30rpx 60rpx;
	}

	.content-content-a {
		background: #FFFFFF;
		padding: 20rpx 70rpx 20rpx 70rpx;
		flex: 1;
		text-align: center;
		border: 2rpx solid #EEEEEE;
		flex: 1;
	}

	.content-button {
		padding: 20rpx 40rpx 20rpx 40rpx;
		text-align: center;
	}

	.active {
		background: #FFD940;
		background:var(--theme-color);
		color:var(--auxiliary-color) ;
	}

	// 搜索框
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
			height: 72rpx;
			line-height: 72rpx;
			background: #F6F6F6;
			border-radius: 76rpx;
			padding-left: 70rpx;
		}

		.icon-search_light {}

		.filter-date {
			margin-left: 30rpx;
			background: #FFFFFF;
			border-radius: 76rpx;
			border: 1rpx solid #EEEEEE;
			height: 72rpx;
			padding: 10rpx;
			box-sizing: border-box;

			.icon-filter {
				margin-left: 8rpx;
			}
		}

	}

	// 日期选择弹框
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
					background: #FFF3C5;
					border: 1rpx solid #FFD940;
					border: 1rpx solid var(--theme-color);
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
					background: var(--theme-color);
				}
			}
		}
	}
</style>
