<template>
	<view class="page-selfcancel price-font-family" :class="{'is-no-data':cNoDataVisible}" :style="themeColor">
		<!-- 没数据提示 -->
		<view v-if="cNoDataVisible" class="no-data-card">
			<image class="cNoDataVisible__img" :src="getImageRoot('img-no-data.png')" />
			<view class="cNoDataVisible__text">无任何可核销订单</view>
			<button class="cNoDataVisible__btn btn-normal" @click="navigationTo('pages/mainPages/order/index?type=delivery')">返回订单订单列表</button>
		</view>
		<!-- 没数据提示 end -->
		<block v-else>
			<!-- 店铺信息 -->
			<view class="store-card">
				<!-- header -->
				<view class="store-card-header">
					<view class="store-card__tittle">{{cStoreData.name}}</view>
				</view>
				<!-- content -->
				<view class="store-card-content">
					<view class="store-info">
						<view class="store-info__left">商家地址：</view>
						<view class="store-info__right">{{cStoreData.address}}</view>
					</view>
					<view class="store-info">
						<view class="store-info__left">商家电话：</view>
						<view class="store-info__right">{{cStoreData.mobile}}</view>
					</view>
				</view>
				<!-- footer -->
				<!-- 			<view class="store-card__footer">
					<image class="store-card__avatar" src="https://via.placeholder.com/50x50/2a9ff6/fffffff"></image>
					<text class="store-card__username">名扬天下</text>
				</view> -->
			</view>
			<!-- 店铺信息 end -->

			<view v-for="order in cOrderList" :key="order.order_no">
				<!-- 订单信息 -->
				<view class="order">
					<!-- header -->
					<view class="order-header">
						<view class="iconfont icon-dingdan" style="color: #999999;margin-right: 10rpx;"></view>
						<view class="order__title">订单号：{{order.order_no}}</view>
					</view>
					<view class="goods-card" @click="handleGoodsClick(order)">
						<view class="goods-card__left">
							<image class="goods-card__img" :src="order.goods_image"></image>
						</view>
						<view class="goods-card__right">
							<view class="goods-card__title">{{order.goods_name}}</view>
							<view class="goods-card__attrs">{{order.sku}}</view>
							<view class="goods-card__row">
								<view class="goods-card__num">x{{order.total_num}}</view>
								<view class="goods-card__price">合计：<text class="is-strong">¥{{order.total_pay_price}}</text></view>
							</view>
						</view>
					</view>
				</view>
				<!-- 订单信息 end -->
				<!-- 衔接图片 -->
				<view class="order-join-img" :style="{'background-image': getImageRoot('img-order-selfcancel.png','url')}"></view>
				<!-- 衔接图片 end -->
				<!-- 核销码信息 -->
				<view class="code-card">
					<!-- header -->
					<view class="code-card-header">
						<view class="code-card-header__left">
							<view class="iconfont icon-hexiao" style="color: #999999;margin-right: 10rpx;"></view>
							<text class="code-card__title">我的核销码</text>
							<text v-if="order.codeUnUsedList.length" class="code-card__num">({{order.codeUnUsedList.length}}个待使用)</text>
						</view>
						<view v-if="order.codeUnUsedList.length" class="code-card-header__right">
							全选
							<view class="btn-selection" :class="{'is-active': order.isSelectedAll}" @click="handleSelectdAll(order)">
								<view class="iconfont icon-check"></view>
							</view>
						</view>

					</view>
					<!-- content -->
					<view class="code-card-content">
						<view v-for="codeUnUsed in order.codeUnUsedList" :key="codeUnUsed.vercode_id" class="code-item" :class="{'is-active': codeUnUsed.active}">
							<view class="code-item__left">{{codeUnUsed.code}}</view>
							<view class="code-item__right">
								<view class="btn-selection" @click="handleBtnSelectionClick(codeUnUsed.vercode_id)">
									<view class="iconfont icon-check"></view>
								</view>
							</view>
						</view>
						<view v-for="codeUsed in order.codeUsedList" :key="codeUsed.vercode_id" class="code-item is-used">
							<view class="code-item-header">
								<view class="code-item-header__left">{{codeUsed.code}}</view>
								<view class="code-item-header__right">
									已使用
								</view>
							</view>
							<view class="code-attr">使用时间：{{codeUsed.check_time}}</view>
						</view>
					</view>
				</view>
				<!-- 核销码信息 end -->
			</view>
			<!-- 操作按钮 -->
			<view class="page-selfcancel__footer--fixed-bottom">
				<button class="page-selfcancel__btn-op btn-normal" @click="handleBtnOpClick">立即核销</button>
			</view>
			<!-- 操作按钮 end -->
		</block>


		<page-loading ref="loading"></page-loading>
		<!-- 核销确认弹窗 -->
		<popup-view :show="confirmPopupVisisble" type="center">
			<view class="confirm-card">
				<view class="confirm-card-content">您已勾选{{vercodeIdActive.length}}个核销码，确认使用?</view>
				<view class="confirm-card-footer">
					<button class="confirm-card__btn-op btn-normal" @click="confirmPopupVisisble=false">取消</button>
					<button class="confirm-card__btn-op is-confirm btn-normal" @click="handleBtnConfirmClick">确认</button>
				</view>
			</view>
		</popup-view>
		<!-- 核销确认弹窗 end -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import PopupView from '@/components/template/PopManager.vue'
export default {
    components: {
        PopupView
    },
    data() {
        return {
            // 页面的接口数据
            pageDataRes: {

            },
            // 页面的query
            query: {

            },
            // 当前选中的核销码
            vercodeIdActive: [],
            // 当前页面是否在请求中-1:未请求过，1:请求中，0:不在请求中
            isPageDataResFetching: -1,
            // 确认弹窗是否显示
            confirmPopupVisisble: false
        }
    },
    async onLoad(options) {
        this.query = options
		// 处理微信小程序码的情况
		if(options.scene) {
			// options.scene存在 认为是扫描二维码进入
			// 格式是bus_id=169&store_id=183
			const decodeStr = decodeURIComponent(options.scene)
			// 只能用this.$util.getParams了
			this.query.bus_id = this.$util.getParams('bus_id',decodeStr)
			this.query.store_id = this.$util.getParams('store_id',decodeStr)
		}
        this.isPageDataResFetching = 1
        try {
            await this.mainMixin_BeforeFetchPageData()
            await Promise.all([this.fetchPageDataRes().catch(() => {})])
        } catch (e) {
            // TODO handle the exception
        }
        this.isPageDataResFetching = 0
        App.hideLoading()
    },
    computed: {
        // 当前页面是否显示无数据
        cNoDataVisible() {
            return this.isPageDataResFetching === 0 && !this.cOrderList.length
        },
        // 店铺信息
        cStoreData() {
            const store = this.$util.deepGet(this.pageDataRes, 'store', {})
            return {
                // 点名
                name: store.name,
                // 商家地址
                address: store.address,
                // 商家电话
                mobile: store.mobile
            }
        },
        // 订单列表信息
        cOrderList() {
            const order = this.$util.deepGet(this.pageDataRes, 'order', [])
            return order.map(item => {
                // 核销码数据
                const codeList = item.code || []
                // code = {
                // 是否使用
                // 	check_status: 0,
                // 时间
                // 	check_time: 0,
                // 码
                // 	code: "319831500",
                // id
                // 	vercode_id: 26378
                // }
                // 已经使用的核销码
                const codeUsedList = codeList.filter(code => +code.check_status === 1)
                // 没有使用的核销码
                const codeUnUsedList = codeList.filter(code => +code.check_status !== 1)
                const rs = {
                    // 订单号
                    order_no: item.order_no,
                    // 商品id
                    goods_id: item.goods_id,
                    // 商品图片
                    goods_image: item.goods_image,
                    // 商品名称
                    goods_name: item.goods_name,
                    // 规格
                    sku: item.sku,
                    // 数量
                    total_num: item.total_num,
                    // 价格
                    total_pay_price: item.total_pay_price,
                    // 已经使用的核销码
                    codeUsedList,
                    // 没有使用的核销码
                    codeUnUsedList: codeUnUsedList.map(item => ({
                        ...item,
                        // 是否选中
                        active: this.vercodeIdActive.indexOf(item.vercode_id) !== -1
                    }))
                }
                // 判断当前是否全选
                const isSelectedAll = codeUnUsedList.length === rs.codeUnUsedList.filter(item => item.active).length
                console.log({ isSelectedAll }, codeUnUsedList.length, rs.codeUnUsedList.filter(item => item.active).length)
                return {
                    ...rs,
                    isSelectedAll
                }
            })
        }
    },
    methods: {
        // 商品点击事件
        handleGoodsClick({ goods_id } = {}) {
            App.navigationTo({
                url: `pages/subPages/goods/index/index?goods_id=${goods_id}`
            })
        },
        // 全选按钮点击事件
        handleSelectdAll(order, index) {
            // 要操作的目标id
            const targetVercodeId = order.codeUnUsedList.map(item => item.vercode_id)
            // // 当前订单的code是否已经被全部选中
            // const flag = codeUnUsedList.length === codeUnUsedList.filter(item => item.active).length
            if (!order.isSelectedAll) {
                // 如果没有全部选中就宣布选中（注意去重）
                this.vercodeIdActive = Array.from(new Set([
                    ...this.vercodeIdActive,
                    ...targetVercodeId
                ]))
            } else {
                // 如果全部选中 就全部不选中
                this.vercodeIdActive = this.vercodeIdActive.filter(item => targetVercodeId.indexOf(item) === -1)
            }
        },
        // 选择按钮点击事件
        handleBtnSelectionClick(vercodeId) {
            const index = this.vercodeIdActive.indexOf(vercodeId)
            if (index === -1) {
                // 加上
                this.vercodeIdActive.push(vercodeId)
            } else {
                // 移除
                this.vercodeIdActive = this.vercodeIdActive.filter(item => item !== vercodeId)
            }
        },
        handleBtnOpClick() {
            if (!this.vercodeIdActive.length) {
			    uni.showToast({
			        icon: 'none',
			        title: '请先勾选核销码'
			    })
			    return
            }
            this.confirmPopupVisisble = true
        },
        // 核销按钮点击事件
        async handleBtnConfirmClick() {
            this.confirmPopupVisisble = false
            uni.showLoading({
                title: '请稍候...',
                mask: true
            })
            try {
                const res = await App._postP('user.order/checkBySelf', {
                    vercode_id: this.vercodeIdActive,
                    store_id: this.query.store_id,
                    check_from: 'qr_self'
                })
                this.vercodeIdActive = []
                await this.fetchPageDataRes()
                uni.hideLoading({
                    title: '请稍候...',
                    mask: true
                })
                uni.showToast({
                    icon: 'none',
                    title: '核销成功'
                })
            } catch (e) {
                // TODO handle the exception
            }
        },
        // 请求页面数据
        async fetchPageDataRes() {
            try {
                const res = await App._postP('user.order/getCheckBySelfAll', {
                    bus_id: this.query.bus_id,
                    store_id: this.query.store_id
                })
                this.pageDataRes = this.$util.deepGet(res, 'data', {})
            } catch (e) {
                console.log('fetchPageData', e)
                return Promise.reject(e)
                // TODO handle the exception
            }
        }

    }
}
</script>

<style lang="scss" scoped>
	.page-selfcancel {
		min-height: 100vh;
		padding-top: 20rpx;
		// 留出安全区域
		padding-bottom: 200rpx;
		background: linear-gradient(#FFD940 0%, rgba(255, 255, 255, 0) 800rpx, #F8F8F8, #F8F8F8 100%);
		&.is-no-data {
			background: #F8F8F8;
		}
	}

	// 店铺信息
	.store-card {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0 30rpx;
	}

	.store-card-header {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 90rpx;
	}

	.store-card__tittle {
		font-weight: bold;
		color: #333;
		font-size: 33rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.store-card-content {
		box-sizing: border-box;
		padding: 20rpx 0;
		border-top: 1px solid #EEEEEE;
	}

	.store-info {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #333;
		white-space: nowrap;

		&+& {
			margin-top: 12rpx;
		}
	}

	.store-info__left {
		flex-shrink: 0;
		color: #999;
	}

	.store-info__right {
		color: #333;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.store-card__footer {
		display: flex;
		align-items: center;
		height: 90rpx;
		border-top: 1px solid #EEEEEE;

		.store-card__username {
			margin-left: 16rpx;
		}
	}

	.store-card__avatar {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
	}

	.store-card__username {
		font-size: 28rpx;
		color: #333;
	}

	// 店铺信息 end
	// 页面底部区域
	.page-selfcancel__footer--fixed-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #FFD940;
	}

	.page-selfcancel__btn-op {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90rpx;
		font-weight: bold;
		font-size: 32rpx;
		color: #333333;
	}

	// 页面底部区域 end
	// 订单信息
	.order {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 10rpx 10rpx 0 0;
		padding: 0 30rpx;
		padding-bottom: 15rpx;
	}

	.order-header {
		display: flex;
		align-items: center;
		height: 90rpx;
	}

	.order__title {
		font-size: 28rpx;
		color: #333;
	}

	.goods-card {
		box-sizing: border-box;
		display: flex;
		background-color: #F8F8F8;
		padding: 20rpx;
	}

	.goods-card__img {
		width: 170rpx;
		height: 170rpx;
		border-radius: 10rpx;
	}

	.goods-card__right {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 0;
		margin-left: 20rpx;
	}

	.goods-card__title {
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.goods-card__attrs {
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.goods-card__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
	}

	.goods-card__num {
		font-size: 28rpx;
		color: #999;
	}

	.goods-card__price {
		font-size: 24rpx;
		color: #333;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.is-strong {
		font-weight: bold;
		font-size: 28rpx;
		color: #FE504F;
	}

	// 订单信息 end
	// 衔接图片
	.order-join-img {
		height: 32rpx;
		width: 690rpx;
		margin: 0 auto;
		background-size: cover;
		background-repeat: no-repeat;
	}

	// 衔接图片 end
	// 核销码信息
	.code-card {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 690rpx;
		padding: 0 30rpx;
		padding-bottom: 20rpx;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 0 0 10rpx 10rpx;
	}

	.code-card-header {
		box-sizing: border-box;
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #EEEEEE;

		.icon-hexiao {
			display: inline-block;
			margin-right: 8rpx;
		}
	}

	.code-card-header__right {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		.btn-selection {
			margin-left: 10rpx;
		}
	}

	.code-card__title {
		font-size: 28rpx;
		color: #333;
	}

	.code-card__num {
		font-size: 24rpx;
		color: #FE504F;
	}

	.btn-selection {
		box-sizing: border-box;
		width: 30rpx;
		height: 30rpx;
		border: 1px solid #CCCCCC;
		border-radius: 4rpx;
		text-align: center;
		line-height: 30rpx;
		.icon-check {
			display: none;
			font-size: 18rpx;
			line-height: 30rpx;
			text-align: center;
		}

		.is-active &,
		&.is-active {
			background-color: #FFD940;
			border-color: #FFD940;

			.icon-check {
				display: block;
			}
		}

	}

	.code-card-content {
		box-sizing: border-box;
		background-color: #F8F8F8;
		border-radius: 10rpx;
		margin-top: 30rpx;
		padding: 0 30rpx;
	}

	.code-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;

		&+& {
			border-top: 1px dashed #EEEEEE;
		}

		&.is-used {
			box-sizing: border-box;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-around;
			height: auto;
			min-height: 80rpx;
			padding: 20rpx 0;

			.code-item-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
			}

			.code-item-header__left {
				font-weight: bold;
				font-size: 28rpx;
				color: #999999;
			}

			.code-item-header__right {
				font-size: 28rpx;
				color: #999999;
			}
		}
	}

	.code-item__left {
		font-weight: bold;
		font-size: 28rpx;
		color: #333333;
	}

	.code-attr {
		font-size: 24rpx;
		color: #999999;
	}

	// 核销码信息 end
	// 没数据提示
	.no-data-card {
		padding-top: 260rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.cNoDataVisible__img {
		width: 500rpx;
		height: 290rpx;
	}
	.cNoDataVisible__text {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #999999;
	}
	.cNoDataVisible__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 64rpx;
		padding: 0 47rpx;
		margin-top: 30rpx;
		font-size: 24rpx;
		color: #333333;
		border: 1px solid #CCCCCC;
		border-radius: 6rpx;
	}
	// 没数据提示 end
	// 核销确认弹窗
	.confirm-card {
		box-sizing: border-box;
		width: 540rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.confirm-card-content {
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
		text-align: center;
	}
	.confirm-card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 32rpx;
	}
	.confirm-card__btn-op {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 225rpx;
		height: 70rpx;
		font-size: 26rpx;
		color: #333;
		border: 1px solid #ccc;
		border-radius: 4rpx;
		&.is-confirm {
			border-color: #FFD940;
			background-color: #FFD940;
		}
	}
	// 核销确认弹窗 end
</style>
