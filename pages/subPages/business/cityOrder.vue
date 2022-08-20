<template>
	<view class="page-cityOrder" :style="themeColor">
		<!-- 顶部分类 -->
		<u-sticky h5-nav-height="0">
			<page-nav-bar class="page-nav" :nav-list="cTopCateData" :current="cTopCateActiveItem.id" @on-nav-item-click="handleTopCateItemClick"></page-nav-bar>
		</u-sticky>
		<!-- 顶部分类 end -->
		<!-- main -->
		<view class="page-cityOrder__main">
			<!-- 订单列表 -->
			<view class="cityOrder-list">
				<view v-for="item in cOrderList" :key="item.id" class="cityOrder-list__item">
					<view class="cityOrder-card">
						<!-- header -->
						<view class="cityOrder-card__header">
							<view class="cityOrder-card__time">下单日期：{{item.create_time}}</view>
							<view class="cityOrder-card__tip">{{item.app_state_text}}</view>
						</view>
						<!-- header end -->
						<!-- content -->
						<view class="cityOrder-card__content">
							<view class="cityOrder-card__content__left">
								<image class="cityOrder-card__img-goods" :src="item.goodsImage" mode="aspectFill"></image>
							</view>
							<view class="cityOrder-card__content__center">
								<view class="cityOrder-card__title">{{item.goods_name}}</view>
								<view v-if="item.goods_attr" class="cityOrder-card__attr">规格：{{item.goods_attr}}</view>
							</view>
						</view>
						<!-- content end -->
						<!-- footer -->
						<view class="cityOrder-card__footer">
							<view class="cityOrder-card__row">
								<view class="cityOrder-card__text is-gray">配送费</view>
								<view class="cityOrder-card__text">¥{{item.express_price}}</view>
							</view>
							<view class="cityOrder-card__row">
								<view class="cityOrder-card__text is-gray">配送地址</view>
								<view class="cityOrder-card__text">{{item.end_address}}</view>
							</view>
							<view class="cityOrder-card__row">
								<view class="cityOrder-card__text is-gray">客户信息</view>
								<view class="cityOrder-card__text">{{item.end_username}} {{item.end_phone}}<button class="btn-normal cityOrder-card__btn-phone" @click="makePhone(item.end_phone)">拨打</button> </view>
							</view>
							<view v-if="item.description" class="cityOrder-card__remarks">
								<view class="cityOrder-card__remarks__title"> 备注： </view>
								<view class="cityOrder-card__remarks__text">{{item.description}}</view>
							</view>
							<view class="cityOrder-card__price">
								共{{item.total_num}}件商品，合计：<text class="is-strong">¥{{item.pay_price}}</text>
							</view>
							<view v-if="item.cdo_button && item.cdo_button.length" class="cityOrder-card__btns-wrapper">
								<button v-for="btn in item.cdo_button" :key="btn.type" class="btn-normal cityOrder-card__btn" :class="btn.classStr"
								 @click="handleBtnOpClick(item,btn)">{{btn.text}}</button>
							</view>
						</view>
						<!-- footer end -->
					</view>
				</view>
			</view>
			<!-- 订单列表 end -->
			<LoadMore :showLoadmore="!orderListRes.hasMore"></LoadMore>
		</view>
		<!-- main end -->
		<!-- 填写拒绝原因弹窗 -->
		<popup-view :show="rejectionFormPopupVisible" type="center">
			<view class="rejectionForm-card app-clearfix">
				<view class="rejectionForm-card__header">
					<view class="rejectionForm-card__title">拒绝原因</view>
				</view>
				<view v-show="rejectionFormPopupVisible" class="rejectionForm-card__content">
					<textarea v-model="rejectionValue" class="rejectionForm-card__textarea" placeholder="请输入拒绝原因..." />
					</view>
				<view class="rejectionForm-card__footer">
					<button class="btn-normal rejectionForm-card__btn main-bg-color auxiliary-color" @click="handleBtnRejectSubmitClick">确认拒绝</button>
					<button class="btn-normal rejectionForm-card__btn rejectionForm-card__btn--text" @click="rejectionFormPopupVisible = false">取消</button>
				</view>
			</view>
		</popup-view>
		<!-- 填写拒绝原因弹窗 end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import PageNavBar from '@/components/template/PageNavBar2.vue'
	import PopupView from '@/components/template/PopManager.vue'
	import LoadMore from '@/components/template/Loadmore.vue'
	export default {
		components: {
			PageNavBar,
			PopupView,
			LoadMore
		},
		data() {
			return {
				options: {
					// 商家id
					bus_id: '',
					store_id: ''
				},
				// 顶部分类选中项索引
				topCateAvtive: 0,
				// 是否显示拒绝原因弹窗
				rejectionFormPopupVisible: false,
				// 拒绝原因
				rejectionValue: '',
				// 拒绝的订单
				rejectionOrder: {},
				// 订单的列表接口数据
				orderListRes: {
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
				}
			}
		},
		computed: {
			// 格式化的顶部分类数据
			cTopCateData() {
				return [{
						id: '全部',
						title: '全部',
						status: ''
					},
					{
						id: '待接单',
						title: '待接单',
						status: 'payed'
					},
					{
						id: '待配送',
						title: '待配送',
						status: 'accepted'
					},
					{
						id: '配送中',
						title: '配送中',
						status: 'geted'
					},
					{
						id: '已送达',
						title: '已送达',
						status: 'gotoed'
					}
				]
			},
			// 当前选中的顶部分类的项
			cTopCateActiveItem() {
				return this.cTopCateData[this.topCateAvtive] || {}
			},
			// 格式化的订单列表数据
			cOrderList() {
				const data = this.orderListRes.data || []
				return data.map(item=>({
					id: item.order_id,
					order_id: item.order_id,
					// 下单时间
					create_time: item.create_time,
					// 订单状态文字
					app_state_text: item.app_state_text,
					// 商品id
					goods_id: this.$util.deepGet(item,'goods.0.goods_id',''),
					// 商品图片
					goodsImage: this.$util.deepGet(item,'goods.0.image.file_path',''),
					// 商品名称
					goods_name: this.$util.deepGet(item,'goods.0.goods_name',''),
					// 规格文字
					goods_attr: item.goods_attr,
					// 配送费
					express_price: item.express_price,
					// 配送地址
					end_address: item.end_address,
					// 客户姓名
					end_username: item.end_username,
					// 电话
					end_phone: item.end_phone,
					// 备注
					description: item.refuse_reason,
					// 总数量
					total_num: this.$util.deepGet(item,'goods.0.total_num',''),
					// 总价
					pay_price: item.pay_price,
					// 要显示的按钮
					cdo_button: (item.cdo_button || []).map(btn=>{
						let classStr = 'main-bg-color auxiliary-color'
						if(['refuse','completed'].includes(btn.type)) {
							classStr = 'cityOrder-card__btn--ghost'
						}
						return {
							...btn,
							classStr
						}
					})
				}))
			}
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
		    try {
		        await this.mainMixin_BeforeFetchPageData()
		        await this.fetchOrderListRes({
		                resetBeforeFetch: true
		            }).catch(() => {})
		    } catch (e) {
		        console.log(e)
		        // TODO handle the exception
		    }
		},
		// 下拉刷新
		async onPullDownRefresh() {
		    try {
		        await this.mainMixin_BeforeFetchPageData()
		        await this.fetchOrderListRes({
		                resetBeforeFetch: true
		            }).catch(() => {})
		    } catch (e) {
		        console.log(e)
		        // TODO handle the exception
		    }
		    uni.stopPullDownRefresh()
		},
		// 上拉加载
		onReachBottom() {
		    if (this.orderListRes.isFetching || !this.orderListRes.hasMore) {
		        return
		    }
		    this.fetchOrderListRes().catch(() => {})
		},
		methods: {
			// 顶部分类点击事件
			handleTopCateItemClick({
				index
			}) {
				this.topCateAvtive = index
				uni.showLoading({
				    title: '请稍候',
				    mask: true
				})
				try {
				    this.fetchOrderListRes({
				        resetBeforeFetch: true
				    })
				} catch (e) {
				    console.log(e)
				    // TODO handle the exception
				}
				uni.hideLoading()
			},
			// 操作按钮点击事件
			async handleBtnOpClick(item,btn) {
				// 如果正在请求或者不是以下操作 直接返回
				if(this.handleBtnOpClicking) {
					return 
				}
				// 如果是拒绝按钮点击
				if(btn.type === 'refuse') {
					this.rejectionOrder = item
					this.rejectionFormPopupVisible = true
					return
				}
				this.handleBtnOpClicking = true
				// 其他按钮直接请求接口
				try{
					// 确认操作
					const modalRes = await uni.showModal({
						title: '请确认',
						content: btn.text
					})
					if(modalRes[1].cancel) {
						this.handleBtnOpClicking = false
						return
					} 
					uni.showLoading({
						title: '请稍候...',
						mask: true
					})
					// 请求接口
					const res = await App._postP('citydelivery.Index/businessStatus',{
						order_id: item.order_id,
						status: btn.type
					})
					this.doUpdateOrderItem(res.data)
					uni.showToast({
						icon: 'none',
						title: '操作成功'
					})
				
				}catch(e){
					console.log(e)
				}
				this.handleBtnOpClicking = false
			},
			// 提交拒绝理由弹窗确认按钮点击事件
			async handleBtnRejectSubmitClick() {
				try{
					uni.showLoading({
						title: '请稍候...',
						mask: true
					})
					// 请求接口
					const res = await App._postP('citydelivery.Index/businessStatus',{
						order_id: this.rejectionOrder.order_id,
						status: 'refuse',
						refuse_reason: this.rejectionValue
					})
					// 关闭弹窗
					this.rejectionFormPopupVisible = false
					// 更新列表
					this.doUpdateOrderItem(res.data)
					uni.showToast({
						icon: 'none',
						title: '操作成功'
					})
				}catch(e){
					console.log(e)
				}
			},
			// 更新列表中的某一项
			doUpdateOrderItem(item) {
				const index = (this.orderListRes.data || []).findIndex(order => order.order_id === item.order_id)
				console.log({index},item.order_id)
				if(index === -1) return
				this.orderListRes.data[index] = item
				this.orderListRes.data = [...this.orderListRes.data]
			},
			makePhone(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile
				});
			},
			// 请求优惠券列表的分页接口数据（注意业务中优惠券列表不用分页）
			async fetchOrderListRes({
			    resetBeforeFetch = false
			} = {}) {
			    try {
			        // 如果在请求之前需要重置数据
			        if (resetBeforeFetch || !this.cTopCateActiveItem.id) {
			            console.log('重置数据')
			            // 重置数据
			            // 还应该取消请求的但是现在没有取消请求的方法
			            this.orderListRes = {
			                ...this.orderListRes,
			                page: 0,
			                data: [],
			                hasMore: true,
			                isFetching: false
			            }
			        }
			        // 如果没有更多就不必请求了
			        if (!this.orderListRes.hasMore) {
			            return Promise.reject()
			        }
			        // 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
			        // 设置为正在请求
			        this.orderListRes.isFetching = true
			        // 请求数据
			        const res = await App._getP('citydelivery.Index/businessOrderList', {
			            page: this.orderListRes.page + 1,
						// 其他接口都是list_rows
			            list_rows: this.orderListRes.listRow,
			            bus_id: this.options.bus_id,
						store_id: this.options.store_id == '-1' ? '' : this.options.store_id,
						status: this.cTopCateActiveItem.status
			        })
			        // 取得新的数据
			        const newData = this.$util.deepGet(res, 'data.data', [])

			        // 判断是否有更多
			        const hasMore = newData.length >= this.orderListRes.listRow
			        // 设置新的数据
			        this.orderListRes = {
			            ...this.orderListRes,
			            page: this.orderListRes.page + 1,
			            // 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
			            // 但如果前一个请求比后一个请求后返回，依然会出错
			            data: resetBeforeFetch ? newData : this.orderListRes.data.concat(newData),
			            hasMore,
			            isFetching: false
			        }
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
	// 订单列表
	.cityOrder-list {
		box-sizing: border-box;
		padding: 0 30rpx;
		margin: 20rpx 0;
	}

	.cityOrder-list__item {
		box-sizing: border-box;

		&+& {
			margin-top: 20rpx;
		}
	}

	.cityOrder-card {
		box-sizing: border-box;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.cityOrder-card__header {
		display: flex;
		align-items: center;
		justify-content: center;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	.cityOrder-card__time {
		font-size: 28rpx;
		color: #333;
		flex-shrink: 0;
	}

	.cityOrder-card__tip {
		margin-left: 16rpx;
		font-size: 28rpx;
		color: #FE504F;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cityOrder-card__content {
		display: flex;
		margin-bottom: 30rpx;
	}

	.cityOrder-card__img-goods {
		width: 170rpx;
		height: 170rpx;
		border-radius: 10rpx;
	}

	.cityOrder-card__content__center {
		margin-left: 20rpx;
	}

	.cityOrder-card__title {
		display: -webkit-box;
		max-height: 2em*1.5;
		margin-bottom: 20rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		line-height: 1.5;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.cityOrder-card__attr {
		font-size: 24rpx;
		color: #999;
	}

	.cityOrder-card__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.cityOrder-card__text {
		font-size: 24rpx;
		color: #333;
		&.is-gray {
			color: #999999;
		}
	}

	.cityOrder-card__remarks {
		box-sizing: border-box;
		display: flex;
		padding: 30rpx;
		margin-top: 20rpx;
		background-color: #F8F8F8;
		border-radius: 20rpx;
	}

	.cityOrder-card__remarks__title {
		font-size: 28rpx;
		color: #999;
	}

	.cityOrder-card__remarks__text {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}

	.cityOrder-card__price {
		margin-top: 20rpx;
		text-align: right;
		font-size: 24rpx;
		color: #333;

		.is-strong {
			font-size: 28rpx;
			color: #FE504F;
			font-weight: bold;
		}
	}

	.cityOrder-card__btns-wrapper {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.cityOrder-card__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 160rpx;
		height: 64rpx;
		margin-top: 30rpx;
		padding: 0 16rpx;
		font-size: 24rpx;
		color: #333;
		border-radius: 10rpx;

		&+& {
			margin-left: 20rpx;
		}
	}

	.cityOrder-card__btn--ghost {
		border: 1px solid #EEEEEE;
	}

	// 订单列表 end
	// 拒绝原因弹窗
	.rejectionForm-card {
		box-sizing: border-box;
		width: 530rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.rejectionForm-card__title {
		font-weight: bold;
		color: #333;
		font-size: 32rpx;
		text-align: center;
	}
	.rejectionForm-card__content {
		box-sizing: border-box;
		padding: 30rpx;
		margin-top: 30rpx;
		background-color:#F8F8F8;
		border-radius: 10rpx;
	}
	.rejectionForm-card__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		margin-top: 30rpx;
		border-radius: 10rpx;
	}
	.rejectionForm-card__btn--text {
		margin-top: 20rpx;
		font-size: 26rpx;
		color: #999;
		height: initial;
		background-color: transparent;
	}
	.cityOrder-card__btn-phone {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 40rpx;
		padding: 0 16rpx;
		min-width: 80rpx;
		margin-left: 1em;
		color: #333;
		font-size: 24rpx;
		border: 1px solid #333;
		border-radius: 9999rpx;
	}
	// 拒绝原因弹窗 end
</style>
