<template>
	<!-- :style="{'background-image':getImageRoot('3.png','url')}" -->
	<view :style="themeColor" class="page-confirm">
		<view class="confirm-container main-bg-color" v-if="!!detail" :class="isGift">
			<view v-if="cIsGiftCode" class="confirm-hd dis-flex flex-dir-column flex-y-center flex-x-center p-b-20">
				<view class="confirm-hd-image confirm-hd-image--gift">
					<image :src="detail.a_lbsp && detail.a_lbsp.logo"></image>
				</view>
				<view class="confirm-name f-30 f-w">{{detail.a_lbsp.title}}</view>
			</view>
			<view v-else class="confirm-hd dis-flex flex-dir-column flex-y-center flex-x-center p-b-20">
				<view class="confirm-hd-image">
					<image :src="isGift? detail.a_lbsp && detail.a_lbsp.logo:detail.merchat.logo.file_path"></image>
				</view>
				<view class="confirm-name f-30 f-w">{{isGift? detail.a_lbsp && detail.a_lbsp.title: detail.merchat.name}}</view>
				<view class="confirm-title f-24 col-9" style="padding-left: 30rpx;padding-right: 30rpx;">{{isGift?  bus_data[0].goods_name:detail.goods[0].goods_name}}</view>
			</view>
			<view class="confirm-line dis-flex flex-dir-row flex-y-center">
				<view class="semicircle left"></view>
				<view class="semicircle-line flex-box"></view>
				<view class="semicircle right"></view>
			</view>
			<GiftCode v-if="cIsGiftCode" :list="cGiftCodeList" :instructions="cGiftCode.instructions" :time="cGiftCode.time" :expiration="cGiftCode.expiration" :orderNo="cGiftCode.orderNo" :orderId="cGiftCode.orderId"></GiftCode>
			<view v-if="!cIsGiftCode" class="confirm-bd dis-flex flex-dir-column flex-x-center flex-y-center">
				<view class="iconfont icon-back" :class="{'disabled':codeCurrent === 0}" v-if="swiperList.length>1" @click="swiperSwitch('previous')"></view>
				<swiper class="qr-swiper" @change="swiperChange" :current="codeCurrent">
					<swiper-item class="t-c p-r" v-for="(item,index) in swiperList" :key="index">
						<image :src="confirmStatusImg" class="confirm-status" v-if="(detail.express_type === 2 || detail.express_type === 5 ) ? detail.delivery_status.value === 20 : item.check_status !== 0 "></image>
						<image :src="getImageRoot('zengpin.png')" v-if="item && item.is_give==1 &&!((detail.express_type === 2 || detail.express_type === 5 ) ? detail.delivery_status.value === 20 : item.check_status !== 0)" style="width: 100rpx;height: 100rpx;" class="confirm-status confirm-code-number"></image>
						<view class="qr-code-wrapper" :class="{
							donated: item.my_donation == 1
						}">
							<!-- #ifdef H5 -->
							<image class="qr-code" :class="{'checked':(detail.express_type === 2 || detail.express_type === 5)?detail.delivery_status.value === 20:checkData.check_status !== 0}"
							 :src="'data:image/png;base64,'+ item.path" mode="aspectFit"></image>
							<!-- #endif -->
							<!-- #ifndef H5 -->
									<image class="qr-code" :class="{'checked':(detail.express_type === 2 || detail.express_type === 5)?detail.delivery_status.value === 20:checkData.check_status !== 0}" :src="item.path" mode="aspectFit"></image>
								<!-- <image :src="getImageRoot('zengpin.png')"  style="width: 100rpx;height: 100rpx;" class="confirm-code-number"></image> -->
							<!-- #endif -->
							<image v-if="item.my_donation == 1" class="icon-donated" :src="getImageRoot('icon-donated.png')"></image>
						</view>
					</swiper-item>
				</swiper>

				<view class="iconfont icon-right" :class="{'disabled':codeCurrent === swiperList.length -1}" v-if="swiperList.length>1"
				 @click="swiperSwitch('next')"></view>
				 <view style="display: flex; align-items:center;">
						<!-- <image :src="getImageRoot('zengpin.png')" v-if="item.is_give==1" style="width: 100rpx;height: 100rpx;"></image> -->
						<image :src="getImageRoot('zengpin.png')" v-if="checkData && checkData.is_give==1 && checkData.check_status == 1" style="width: 100rpx;height: 100rpx;" class="confirm-code-number"></image>
						<view v-if="detail.express_type != 5" class="confirm-code-number" :class="{'checked':(detail.express_type === 2 || detail.express_type === 5)?detail.delivery_status.value === 20:checkData.check_status !== 0}">

						{{detail.express_type === 2?store.code:checkData.code}}</view>
				 </view>

				<view class="confirm-time-list" :class="{'checked':(detail.express_type === 2 || detail.express_type === 5)?detail.delivery_status.value === 20:checkData.check_status !== 0}">
					<block v-if="(detail.express_type === 2 || detail.express_type === 5)">
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3" v-if="detail.express_type === 5" style="height: 50rpx;">

						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">提货状态:</view>
							<view class="confirm-time-value col-s main-color">{{detail.delivery_status.value === 10?"待提货":"已收货"}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">下单时间:</view>
							<view class="confirm-time-value col-s main-color">{{store.create_time}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">提货时间:</view>
							<view class="confirm-time-value col-s main-color">{{store.check_time}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3" v-if="detail.goods[0] && detail.goods[0].goods_attr">
							<view class="confirm-time-label">自提规格:</view>
							<view class="confirm-time-value col-s main-color">{{detail.goods[0].goods_attr?detail.goods[0].goods_attr:"--"}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">{{detail.express_type === 2 ?'自提店铺:':'我的团长:'}}</view>
							<view class="confirm-time-value col-s main-color">{{detail.express_type === 2 ? store.detail.name : detail.bind_reg.name}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3" v-if="detail.express_type === 5">
							<view class="confirm-time-label">团长电话:</view>
							<view class="confirm-time-value col-s main-color ">{{detail.bind_reg.phone}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3" v-if="detail.express_type === 5">
							<view class="confirm-time-label">自提地址:</view>
							<view class="confirm-time-value col-s main-color ">{{detail.bind_reg.community}}</view>
						</view>
					</block>
					<block v-if="detail.express_type === 3">
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">平台名称:</view>
							<view class="confirm-time-value">{{settingData && settingData.name}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">订单编号:</view>
							<view class="confirm-time-value">{{detail.order_no}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">下单时间:</view>
							<view class="confirm-time-value">{{detail.create_time}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">数量:</view>
							<view class="confirm-time-value">{{detail.goods[0].total_num}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">过期时间:</view>
							<view class="confirm-time-value">{{checkData.end_time}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3" v-if="detail.goods[0] && detail.goods[0].goods_attr">
							<view class="confirm-time-label">核销规格:</view>
							<view class="confirm-time-value">{{detail.goods[0].goods_attr?detail.goods[0].goods_attr:"--"}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3" v-if="cGiftTitle">
							<view class="confirm-time-label">礼包名称:</view>
							<view class="confirm-time-value is-auto">{{cGiftTitle}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">核销状态:</view>
							<view class="confirm-time-value col-s main-color">{{checkData.check_status ===0?"未核销":checkData.check_status ===1?"已核销":"已退款"}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">核销时间:</view>
							<view class="confirm-time-value col-s main-color">{{checkData.check_time}}</view>
						</view>
						<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
							<view class="confirm-time-label">核销人员:</view>
							<view class="confirm-time-value col-s main-color">{{checkData.record?(checkData.record.user===null?'管理员操作':checkData.record.user.name):"--"}}</view>
						</view>
					</block>
				</view>
				<view class="btn-box">
					<button class="confirm-btn main-bg-color auxiliary-color" v-if="detail.express_type === 3 && checkData.is_refund === 0 && checkData.check_status === 0 && !isGift"
					 :disabled="check_code_num === 0" @click="selfCheck">自助核销</button>
				</view>
			</view>
			<view v-if="!cIsGiftCode" class="confirm-line dis-flex flex-dir-row flex-y-center">
				<view class="semicircle left"></view>
				<view class="semicircle-line flex-box"></view>
				<view class="semicircle right"></view>
			</view>
			<view v-if="!cIsGiftCode" class="confirm-ft">
				<view class="confirm-need border-line border-bottom">
					<view class="confirm-ft-title">使用须知</view>
					<view class="confirm-need-know col-9">
						<parse :html="detail.goods[0].goods.by_know"></parse>
					</view>
				</view>
				<view class="confirm-store" v-if="!isGift">
					<view class="confirm-ft-title dis-flex flex-y-center flex-x-between" v-if="store.length > 0 ">
						<text>商家信息</text>
						<button @click="moreStore(detail.bus_id)" >更多分店</button>
					</view>
					<view class="confirm-store-info" v-if="!!store && index<2" v-for="(store,index) in store" :key="index">
						<view class="store-detail dis-flex flex-y-center flex-x-between">
							<view class="store-detail-left flex-box dis-flex flex-y-center flex-x-between">
								<view class="store-info">
									<view class="store-name f-30">{{store.name}}</view>
									<view class="store-addres col-9 f-26 m-top10  dis-flex flex-y-center"> <text class="iconfont icon-location">
											<!-- 1.3km --></text>
										<text class="onelist-hidden flex-box" style="width:150px;">{{store.address}}</text></view>
								</view>
							</view>
							<store-nav :mobile="store.mobile" :address="store"></store-nav>
						</view>
					</view>
				</view>
				<!-- 多商家 -->
				<view class="confirm-store" v-if="isGift">
					<view class="confirm-ft-title dis-flex flex-y-center flex-x-between" >
						<text>商家信息</text>
					</view>
					<view class="" v-for="(busitem,busIndex) in cGiftBus" :key='busIndex'>
						<view class="">
							<view class="col-3 f-28  m-top20" >商家名称：{{busitem.name}}</view>

							<block v-if="busitem.showAll">
								<view class="store-address dis-flex  flex-y-center flex-x-between border-line border-bottom" v-for="(store,storeIndex) in busitem.store" :key='storeIndex' style="padding-bottom: 30rpx;">
									<view class="store-address-info">
										<view class="col-3 f-30 ">{{store.name}}</view>
										<!-- 店铺电话 -->
										<view class="store-addres-text col-9 twolist-hidden f-24">商家电话:{{store.mobile}}</view>
										<!-- 店铺地址 -->
										<view class="f-24 col-9 m-top10 dis-flex flex-y-center">
											<view class="onelist-hidden" style="width:220px;"> {{store.detailed_address}}</view>
										</view>
									</view>
									<store-nav :mobile="store.mobile" :address="store"></store-nav>
								</view>

							</block>

							<view class="check-item check-more no-bor dis-flex flex-x-center flex-y-center col-9 f-24" >
								<view class="" @click="checkMore(busitem)">{{busitem.showAll?"收起":"查看更多"}}</view>
								<view class="iconfont" :class="busitem.showAll?'icon-fold':'icon-unfold'"></view>
							</view>

						</view>

					</view>
				</view>
			</view>
			<view v-if="cIsGiftCode" class="confirm-ft" style="height: 40rpx;"></view>
			<view v-if="cIsGiftCode" class="confirm-fixed-footer app-wrapper--safe-fixed-bottom">
				<view class="app-flex app-flex--column app-flex--align-center app-flex--justify-center padding-box-all">
					<view class="app-flex-item">
						<image class="confirm-fixed-footer__logo" :src="cGiftCode.businessLogo"></image>
					</view>
					<view class="app-flex-item m-top-18 f-28 f-w">{{cGiftCode.businessName}}</view>
				</view>
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import Parse from '@/components/threeComponents/jyf-Parser/index'
import StoreNav from '@/components/template/StoreNav.vue'
import GiftCode from './components/GiftCode.vue'
export default {
    data() {
        return {
            codeCurrent: 0,
            order_id: '',
            detail: null,
            store: null,
            codeList: null,
            code_path: null,
            check_code_num: 0,
            bus_data: []
        }
    },
    components: {
        Parse,
        StoreNav,
		GiftCode
    },
    computed: {
		cIsGiftCode() {
			return !!this.$util.deepGet(this.detail, `a_lbsp.title`, '')
		},
		cGiftCode() {
			const data = this.$util.deepGet(this.detail, `a_lbsp`, {})
			return {
				time: data.create_time,
				orderId: this.detail && this.detail.order_id,
				orderNo: data.order_no,
				expiration: data.should_over_time,
				instructions: data.by_know,
				businessLogo: this.$util.deepGet(this.detail, `merchat.logo.file_path`, []),
				businessName: this.$util.deepGet(this.detail, `merchat.name`, [])
			}
		},
		cGiftCodeList() {
			if(!this.cIsGiftCode) {
				return []
			}
			const list = this.$util.deepGet(this.detail, `a_lbsp.code_detail`, [])
			return list.map(item=> {
				// 0:待使用，1:已使用 2:已转赠
				let status = ''
				if(item.my_donation == 1) {
					status = 2
				}else {
					status = item.check_status
				}
				return {
					id: item.vercode_id,
					orderId: this.detail.order_id,
					title: item.gift_title,
					image: item.image,
					code: item.code,
					qrcode: item.qrcode,
					price: item.value_price,
					needPrice: item.need_pay_moeny,
					storeNum:item.store_num,
					status,
					operator: item.check_clerk,
					writeOffTime: item.check_time,
					storeList: (item.store_info || {}).map((store,index)=>({
						id: store.name+index,
						name: store.name,
						address: store.address,
						phone: store.mobile,
						latitude: store.lat,
						longitude: store.lng,
					})),
					content: item.content,
					// 是否显示转赠按钮
					show_button: item.show_button == 1
				}
			})
		},
        cGiftBus() {
            return this.$util.deepGet(this.swiperList, `${this.codeCurrent}.bus_info`, {})
        },
        checkData() {
            if (!!this.detail && this.detail.express_type === 3) {
                return this.swiperList[this.codeCurrent] || {}
            }
            return {}
        },
        swiperList() {
            if (!!this.detail) {
                return (this.detail.express_type === 2 || this.detail.express_type === 5) ? [
                    {
                        path: this.code_path
                    }
                ] : this.detail.vercode.filter(val => !(val.check_status === 0 && val.is_refund === 30))
            }
        },
        confirmStatusImg() {
            if (!!this.detail && this.detail.express_type === 2) {
                return '/static/images/order/self.png'
            }
            if (this.checkData && this.checkData.check_status !== '0') {
                return `/static/images/order/${this.checkData.check_status == '1' ? 'checked' : 'refund'}.png`
            }


        },
        isGift() {
            return !!(this.detail && this.detail.gift_business && this.detail.gift_business.length > 0)
        }
    },
    watch: {
        async codeCurrent(newValue, oldValue) {
            if (this.detail.vercode_model === '2') {
                let codeData = this.swiperList[newValue]
                if (!codeData.path) {
                    uni.showLoading({
                        title: '加载中...'
                    })
                    let code = codeData && codeData.code,
                        codePath = await this.getOrderQrcode(this.order_id, code)
                    this.$set(this.swiperList[newValue], 'path', codePath)
                }

            }
        }
    },
    onLoad(options) {
        App.showLoading()
        this.order_id = options.order_id
    },
    onShow() {
        this.getOrderInfo(this.order_id)
    },
    methods: {
        getOrderDetail(order_id) {
            return new Promise((resolve, reject) => {
                App._get('user.order/detail', {
                    order_id
                }, res => {
                    resolve(res.data)
                })
            })
        },
        getOrderQrcode(order_id, code) {
            return new Promise((resolve, reject) => {
                App._get('user.order/qrcode', {
                    order_id,
                    code
                }, res => {
                    uni.hideLoading()
                    resolve(res.data)
                })
            })
        },
        checkMore(item) {
            this.$set(item, 'showAll', !item.showAll)
        },
        /**
			 * 获取订单信息
			 */
        async getOrderInfo(order_id) {
            let _this = this,
                orderInfo = await _this.getOrderDetail(order_id),
                {
                    vercode = [],
                    vercode_model = '1'
                } = orderInfo,
                code = ''
            console.log('getOrderInfo++++', orderInfo)
            // if (orderInfo.express_type === 5) {
            // 	// orderInfo.express_type = 2;
            // }
            // 核销模式 1-多码核销 2-单码核销
            if (vercode_model === '2' && vercode.length > 0) {
                // 核销码显示顺序整理
                if (orderInfo.express_type !== 2) {
                    vercode.sort((a, b) => a.check_status - b.check_status)
                }
                code = vercode[0].code
            }


            let codePath = await _this.getOrderQrcode(order_id, code)
            if (orderInfo.express_type === 2 || orderInfo.express_type === 5) {
                let store = orderInfo.store
                store.check_time = store.check_time === '0' ? '--' : _this.$util.formatTime(store.check_time, 'info', '-')
                _this.store = store
                _this.code_path = codePath
                console.log('_this.code_path', _this.code_path)
            } else {
                let check_code_num = 0
                _this.store = orderInfo.merchat.store

                _this.codeList = vercode.map((val, index) => {
                    val.end_time = val.end_time == '-1' ? '永久有效' : _this.$util.formatTime(val.end_time, 'info', '-')
                    val.check_time = val.check_time === 0 ? '--' : _this.$util.formatTime(val.check_time, 'info', '-')
                    val.path = vercode_model === '2' ? (index === 0 ? codePath : '') : codePath
                    if (val.is_refund === 0 && val.check_status === 0) {
                        check_code_num++
                    }
                    return val
                })

                _this.check_code_num = check_code_num
            }

            orderInfo.gift_business && orderInfo.gift_business.forEach(item => {
                _this.$set(item, 'showAll', false)
            })
            _this.detail = orderInfo
            this.isGift && this.getBusData(0)
            App.hideLoading(1000)
        },

        /**
			 * 更多门店
			 */
        moreStore(bus_id) {
            App.navigationTo({
                url: 'pages/subPages/store/list?bus_id=' + bus_id
            })
        },
        getBusData(index = 0) {
            let bus_id = this.swiperList[index].bus_ids[0],
                bus_data = this.detail.gift_business.filter(item => {
                    if (item.id == bus_id) {
                        return item
                    }
                })
            console.log(bus_data, 'bus_data============')
            this.setData({ bus_data })

        },

        /**
			 * 核销码切换
			 */
        swiperChange(e) {
            this.codeCurrent = e.detail.current
            console.log(this.codeCurrent)
	            this.getBusData(this.codeCurrent)


        },
        swiperSwitch(type) {
            if (type === 'previous') {
                (this.codeCurrent !== 0) && --this.codeCurrent
            } else if (type === 'next') {
                (this.codeCurrent !== this.swiperList.length - 1) && ++this.codeCurrent
            }
        },

        /**
			 * 自助核销
			 */
        selfCheck() {
            let {
                detail: {
                    vercode_model,
                    express_type,
                    bus_id
                },
                checkData: {
                    code = ''
                },
                order_id
            } = this
            App.navigationTo({
                url: `pages/mainPages/order/selfcancel?code=${express_type !== 2 && vercode_model === '2' ? code : ''}&order_type=user&order_id=${order_id}&bus_id=${bus_id}&flag=1`
            })
        }
    }
}
</script>

<style lang="scss">
	.page-confirm {
		background-color: var(--theme-color,#FFD940);
		padding-bottom: 210rpx;
	}
	.confirm-container {
		padding: 80upx 30upx 30upx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.confirm-hd {
		background: #FFFFFF;
		border-radius: 18upx 18upx 0 0;
	}

	.confirm-name {
		margin-top: 12upx;
	}

	.confirm-hd-image {
		box-sizing: border-box;
		position: relative;
		margin-top: -65upx;
		background-color: #FFFFFF;
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
	}
	

	.confirm-hd image {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}
	
	
	.confirm-hd-image--gift {
		position: relative;
		margin-top: -50upx;
		width: 100upx;
		height: 100upx;
		border-radius: 20rpx;
		image {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 100upx;
			height: 100upx;
			border-radius: 20rpx;
		}
	}
	
	.confirm-line {
		height: 34upx;
		overflow: hidden;
	}

	.confirm-line view {
		height: 34upx;
	}

	.semicircle {
		width: 34upx;
		height: 34upx;
		background: radial-gradient(transparent 0, transparent 50%, #FFFFFF 50%);
	}

	.semicircle.left {
		margin-left: -17upx;
	}

	.semicircle.right {
		margin-right: -17upx;
	}

	.confirm-line view.semicircle-line {
		background: #FFFFFF;
		position: relative;
	}

	.semicircle-line::after {
		content: " ";
		position: absolute;
		top: calc(50% - 1upx);
		left: 0;
		right: 0;
		transform: scaleY(0.5);
		height: 2upx;
		background-image: linear-gradient(to right, #FFD52C 0%, #FFD52C 50%, transparent 50%);
		background-image: linear-gradient(to right, var(--theme-color) 0%, var(--theme-color) 50%, transparent 50%);
		background-size: 24upx 2upx;
		background-repeat: repeat-x;
	}

	.confirm-bd {
		background: #FFFFFF;
		padding: 0 0 40upx;
		position: relative;
	}

	.confirm-bd .confirm-status {
		width: 119upx;
		height: 102upx;
		display: block;
		position: absolute;
		top: 10upx;
		right: 62upx;
		transform: scale(1.2);
	}

	.confirm-bd .qr-swiper {
		width: 100%;
		height: 400upx !important;
		position: relative;
		z-index: 10;
	}

	.confirm-bd .iconfont {
		position: absolute;
		top: 22%;
		font-size: 52upx;
		width: 1em;
		height: 1em;
		line-height: 1em;
		color: #333333;
		z-index: 15;
	}

	.confirm-bd .iconfont.disabled {
		color: #999999;
	}

	.confirm-bd .iconfont.icon-back {
		left: 20upx;
	}

	.confirm-bd .iconfont.icon-right {
		right: 20upx;
	}

	.confirm-bd .qr-code {
		width: 300upx;
		height: 300upx;
		border-radius: 15upx;
		display: inline-block;
		margin-top: 100upx;
	}

	.confirm-bd .qr-code.checked {
		opacity: .5;
	}

	.confirm-bd .confirm-code-number {
		font-size: 50upx;
		color: #FE504F;
		font-weight: bold;
		margin: 38upx 0;
	}

	.confirm-time-list {}

	.confirm-bd .confirm-code-number.checked,
	.confirm-time-list.checked .confirm-time-label,
	.confirm-time-list.checked .confirm-time-value {
		color: #999999 !important;
	}

	.confirm-time-item {
		margin-bottom: 20upx;
	}

	.confirm-time-value {
		padding-left: 12upx;
		width: 300upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		&.is-auto {
			overflow: auto;
			white-space: normal;
		}
	}

	.btn-box {
		height: 74rpx;
		margin-top: 40rpx;
	}

	.confirm-btn {
		width: 330upx;
		height: 74upx;
		font-size: 30upx;
		line-height: 74upx;
		background: #FFD940;
		border-radius: 50upx;
	}

	.confirm-ft {
		background: #FFFFFF;
		border-radius: 0 0 18upx 18upx;
	}

	.confirm-need {
		padding: 24upx 0;
		background: #FFFFFF;
		margin: 0 30upx;
	}

	.confirm-ft-title {
		font-size: 28upx;
		padding-left: 16upx;
		position: relative;
	}

	.confirm-ft-title::after {
		content: " ";
		position: absolute;
		top: 50%;
		left: -4upx;
		transform: translateY(-50%);
		width: 8upx;
		height: 30upx;
		background: var(--theme-color);
		border-radius: 20upx;
	}

	.confirm-need-know {
		padding-left: 16upx;
		font-size: 26upx;
		line-height: 2em;
		overflow-x: hidden;
	}

	.confirm-store {
		padding: 30upx;
		background: #FFFFFF;
		border-radius: 0 0 18upx 18upx;
	}

	.confirm-ft-title button {
		border: 1upx solid #FFD940;
		border: 1upx solid var(--theme-color);
		font-size: 24upx;
		width: 160upx;
		height: 54upx;
		border-radius: 50upx;
		line-height: 54upx;
		color: #999999;
		background: #FFFFFF;
		margin: 0;
	}

	.confirm-store-info {
		margin-top: 20upx;
	}

	.confirm-store-info .iconfont.col-9 {
		font-size: 42upx;
	}

	.confirm-store-info .store-addres text.iconfont {
		display: inline-block;
		padding-right: 20upx;
		font-size: 26upx;
	}

	.store-detail-right {
		margin-left: 20upx;
		padding-left: 20upx;
		border-left: 1upx solid #EEEEEE;
	}
</style>

<style lang="scss" scoped>
	.confirm-fixed-footer {
		color: var(--auxiliary-color,#333);
		background-color: var(--theme-color,#FFD940);
		box-shadow: 0rpx -10rpx 24rpx 1rpx var(--theme-color,#FFD940);
		padding-top: 47rpx;
	}
	.confirm-fixed-footer__logo {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 94rpx;
		height: 94rpx;
		border: 2px solid #fff;
		border-radius: 100%;
		box-shadow: 0 -5rpx 10rpx var(--theme-color,#FFD940);
		
	}
	.qr-code-wrapper{
		position: relative;
		display: inline-flex;
		margin-top: 100rpx;
		.qr-code {
			margin-top: 0;
		}
		.icon-donated {
			position: absolute;
			left: 50%;
			top: 50%;
			width: 160rpx;
			height: 160rpx;
			transform: translate(-50%,-50%);
		}
		&.donated {
			.qr-code {
				filter: blur(10rpx);
			}
		}
	}
	
</style>
