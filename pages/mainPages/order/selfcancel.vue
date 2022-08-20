<template>
	<view :style="themeColor" class="page-selfcancel">
		<view v-if="cIsGiftCode && isshow" class="container is-gift app-clearfix p-top-30">
			<GiftCodeCancel :logo="cGiftCode.logo" :title="cGiftCode.title" :goodsList="cGiftCode.goodsList" :storeList="cGiftCode.storeList" :order="cGiftCode.order" :customer="cGiftCode.customer" @on-btn-go-click="handleBtnGiftGoClick"></GiftCodeCancel>
		</view>
		<view v-else-if="!cIsGiftCode && isshow" class="container p-left-right-30">
			<view class="goodsItem-box m-top-btm20 b-f bor-radius-20">
				<view class="dis-flex b-b m-btm15">
					<image style="height: 40rpx;width: 40rpx;margin-right:10rpx;" src="../../../static/images/order/he.png"></image>
					<view class="col-3 f-28 m-btm15">{{bus_name?bus_name:''}}</view>
					<view class="iconfont icon-jinrujiantou1 col-9" style="font-size: 36rpx;"></view>
				</view>
				<view class="goods-item dis-flex flex-y-center m-btm20" v-for="(gooditem,godidx) in goods" :key="godidx">
					<view class="goods-left bor-radius-10" :style="'background-image:url('+ (gooditem.image && gooditem.image.file_path) +')'"></view>
					<view class="goods-right flex-box dis-flex flex-dir-column flex-x-around">
						<view class="goods-title col-3 f-28 twolist-hidden">{{gooditem.goods_name}}</view>
						<view class="goods-title col-9 f-24 dis-flex flex-x-between flex-y-center">
							<view class="">规格：{{!!gooditem.goods_attr?gooditem.goods_attr:"无"}}</view>
							<view class="">x{{gooditem.total_num}}</view>
						</view>
					</view>
				</view>
			</view>
			<form @submit="formSubmit">
				<view class="cancel-list b-f bor-radius-20 m-btm20 cancel-store" v-if="order_type==='store' && storeList.length > 0">
					<view class="cancel-title dis-flex flex-x-between flex-y-center">
						<view class="right-text f-28 col-3">{{express_type === 3 || express_type === 4?"核销":"自提"}}门店</view>
						<picker mode="selector" name="store_id" value="0" :range="storeList" @change="storeName = storeList[$event.detail.value].name"
						 range-key="name">
							<view class="cancel-store-name f-26 col-9">{{!!storeName?storeName:"点击选择"+(express_type === 3 || express_type === 4?"核销":"自提")+"门店"}}</view>
						</picker>
					</view>
				</view>
				<view class="cancel-list b-f bor-radius-20 m-btm20">
					<view class="cancel-title dis-flex flex-x-between flex-y-center">
						<view class="right-text f-28 col-3">{{(express_type===3 || express_type === 4)?'核销码':'自提码'}}</view>
						<view class="select-all dis-flex f-24 col-3" v-if="vercode.length > 1">
							<checkbox class="checkbox" @click="selectAll" :checked="isSelectAll" />
							<view class="list-item-right">全选</view>
						</view>
					</view>

					<view class="cancel-list-box">
						<checkbox-group :name="(express_type===3 || express_type === 4)?'vercode_id':'selfcode_id'" :style="{'height':vercodeHeight}"
						 style="overflow: hidden;" @change="checkboxChange">
							<label v-for="(cancelItem,cancelIdx) in vercode" :key="cancelIdx">
								<view class="cancel-list-item dis-flex flex-x-between f-24 col-3">
									<view class="list-item-left">
										<checkbox class="checkbox" :value="cancelItem.vercode_id+''" :checked="cancelItem.checked" />
									</view>
									<view class="list-item-right dis-flex flex-box">
										<view class="cancel-list-item__title" v-if="cancelItem.gift_title">{{cancelItem.gift_title}}</view>
										<view class="m-left12">{{cancelItem.code}}</view>
										<text v-if="cancelItem.is_give&&cancelItem.is_give==1">(赠送)</text>
									</view>
								</view>
							</label>
						</checkbox-group>
						<block v-if="(express_type===3 || express_type === 4)&&vercode.length>5">
							<view class="more f-24 col-9" @click="more">{{!ismore?'查看更多':'已显示全部核销码'}}
								<text class="more-icon iconfont" :class="!ismore?'icon-unfold':'icon-fold'"></text>
							</view>
						</block>
					</view>
				</view>

				<block v-if="order_type==='user' && express_type === 3">
					<view class="pasword-cancel bor-radius-20 b-f m-btm20">
						<view class="col-3 f-28 m-btm40 pasword-sale-title">请输入店员密码核销</view>
						<view class="cancel-input dis-flex flex-x-between" @click="focus = true">
							<view class="input-item col-3" >{{password[0]}}</view>
							<view class="input-item col-3" >{{password[1]}}</view>
							<view class="input-item col-3">{{password[2]}}</view>
							<view class="input-item col-3" >{{password[3]}}</view>
							<input  type="number"  :style="'padding-left:'+(password.length==0?'0%':(password.length==1?'25%':(password.length==2?'50%':(password.length==3?'75%':'85%'))))"  maxlength="4" :focus="focus" @input="cancelImport"  name="password" class="password-input" />
						</view>

					</view>
				</block>

				<view v-if="!!order">
					<view class="bor-radius-20 b-f m-btm20 center-info">
						<view class=" dis-flex flex-x-between flex-y-center center-number">
							<view class=" col-9 f-24">订单编号</view>
							<view class=" dis-flex flex-x-between flex-y-center">
								<view class="f-24 col-3">{{order.order_no}}</view>
							</view>
						</view>
						<view class=" dis-flex flex-x-between flex-y-center center-number">
							<view class=" col-9 f-24">购买日期</view>
							<view class=" dis-flex flex-x-between flex-y-center">
								<view class="f-24 col-3">{{order.create_time}}</view>
							</view>
						</view>
						<view class=" dis-flex flex-x-between flex-y-center center-number">
							<view class=" col-9 f-24">购买数量</view>
							<view class=" dis-flex flex-x-between flex-y-center">
								<view class="f-24 col-3">{{order.goods && order.goods[0] && order.goods[0].total_num}}</view>
							</view>
						</view>
						<view class=" dis-flex flex-x-between flex-y-center center-number">
							<view class=" col-9 f-24">商品总价</view>
							<view class=" dis-flex flex-x-between flex-y-center">
								<view class="f-24 col-3">{{order.total_price}}</view>
							</view>
						</view>
						<view class=" dis-flex flex-x-between flex-y-center center-number">
							<view class=" col-9 f-24">实付金额</view>
							<view class=" dis-flex flex-x-between flex-y-center ">
								<view class="f-24 col-3 col-m">{{order.pay_price}}</view>
							</view>
						</view>
					</view>
					<view class="bor-radius-20 b-f m-btm20 center-info">
						<view class=" dis-flex flex-x-between flex-y-center center-number">
							<view class=" col-9 f-24">姓名</view>
							<view class=" dis-flex flex-x-between flex-y-center">
								<view class="f-24 col-3">{{order.goods?order.goods[0].name:""}}</view>
							</view>
						</view>
						<view class=" dis-flex flex-x-between flex-y-center center-number">
							<view class=" col-9 f-24">手机</view>
							<view class=" dis-flex flex-x-between flex-y-center">
								<view class="f-24 col-3">{{order.goods?order.goods[0].mobile:""}}</view>
							</view>
						</view>
					</view>
				</view>


				<view class="sub-btn f-28 col-3 m-btm20 main-bg-color auxiliary-color">{{express_type===3 || express_type === 4?'确认核销':'确认自提'}}
					<bind-mobile-button v-if="isShowBindBtn"></bind-mobile-button>
					<button formType="submit"></button>
				</view>
			</form>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script scoped>
import App from '@/common/js/app.js'
import ListGoodsItem from '@/components/template/ListGoodsItem.vue'
import BindMobileButton from '@/components/template/BindMobileButton.vue'
import GiftCodeCancel from './components/GiftCodeCancel.vue'
export default {
    data() {
        return {
            order_id: null,
            order_type: null,
            orderDatadetail: {},
            ismore: false,
            password: '',
            moreNum: null,
            isshow: false,
            vercode: [],
            focus: false,
            express_type: null, // 2自提 3核销
            store_id: '',
            storeName: '',
            storeList: [],
            goods: [],
            order: '',
            bus_name: ''
        }
    },
    components: {
        ListGoodsItem,
        BindMobileButton,
		GiftCodeCancel
    },
    computed: {
		// 是否是礼包商品
		cIsGiftCode() {
			return !!this.$util.deepGet(this.order, `a_lbsp.title`, '')
		},
		// 礼包商品验证码的相关信息
		cGiftCode() {
			if(!this.cIsGiftCode) {
				return {}
			}
			const data = this.$util.deepGet(this.order, `a_lbsp`, {})
			const logo = this.$util.deepGet(this.order, `a_lbsp.logo`, '')
			const title = this.$util.deepGet(this.order, `a_lbsp.title`, '')
			const goodsList = (data.code_detail || []).map(item=>({
				id: item.vercode_id,
				title: item.gift_title,
				image: item.image,
				code: item.code,
				// 价值 多少钱
				price: item.value_price,
				// 仅需多少钱
				needPrice: item.need_pay_moeny,
			}))
			const storeList = this.storeList.map(item=>({
				id: item.id,
				busId: item.bus_id,
				name: item.name,
				logo: ''
			}))
			const order = {
				orderNo: data.order_no,
				time: data.create_time,
				num: this.$util.deepGet(this.order, 'goods.0.total_num', ''),
				price: this.$util.deepGet(this.order, 'total_price',''),
				paidIn:this.$util.deepGet(this.order, 'pay_price', ''),
			}
			const customer = {
				name: data.username,
				phone: data.mobile,
			}
			return {
				logo,
				title,
				goodsList,
				storeList,
				order,
				customer
			}
		},
        // 是否显示绑定手机号按钮
        isShowBindBtn() {
            let userInfo = this.$store.state.userInfo
            console.log('userInfo', userInfo)
            return (userInfo && this.settingData.bindmobile === '1' && this.$util.isEmptyMobile(userInfo.mobile)) || !userInfo
        },
        vercodeHeight() {
            let showNum = this.vercode.length > 5 ? (this.ismore ? this.vercode.length : 5) : this.vercode.length
            return uni.upx2px(82) * showNum + 'px'
        },
        isSelectAll: {
            get() {
                let vercode = this.vercode
                if (vercode.length > 0) {
                    return vercode.filter(val => val.checked).length === vercode.length
                }
            },
            set(newValue) {
                let vercode = this.vercode.map(val => {
                    val.checked = newValue
                    return val
                })
                this.vercode.splice(0, vercode.length, ...vercode)
            }

        }

    },
    onLoad(options) {
		console.log('onLoad pages/mainPages/order/selfcancel')
		// #ifdef MP
		App.userSilentLogin(() => {
			console.log('获取用户信息--------------userSilentLogin')
			this.getUserDetail()
		}, true)
		// #endif
		// #ifdef H5
		this.getUserDetail()
		// #endif
		let {
			order_type, // order_type
			bus_id, // bus_id
			order_id, // order_id
			code,
			flag
		} = options
		let _this = this;
		(!!options.isurl) && (_this.isurl = false)
		// !!options.isurl ? _this.isurl=false : '';
		if (options.q || options.scene) {
			let Base64 = new this.$util.Base64(),
				params = options.q || options.scene,
				queryData = null
			if (options.q) {
				queryData = this.$util.getParams('scene', decodeURIComponent(params), true)
				queryData = JSON.parse(Base64.decode(queryData))
			} else if (options.scene) {
				queryData = this.$util.scene_decode(params)
			}
			[
				order_type,
				bus_id,
				order_id,
				code = ''
			] = this.$util.objectValues(queryData)
			console.log(queryData)
		}
		this.getOrderDetail(order_id, bus_id, code || '', flag)
		this.order_type = order_type
    },
    onShow() {

    },
    mounted() {

    },
    methods: {
		handleBtnGiftGoClick(data) {
			this.storeName = data.storeName
			this.formSubmit({
				detail: {
					value: {
						...data,
						// 这里的store_id实际上索引
						store_id: data.storeIndex
					}
				}
			})
		},
        getUserDetail() {
            const _this = this
            App._get('user.index/detail', {
                no_login: 1
            }, function (result) {
                if (result.data && result.data.userInfo) {
                    App.setUserinfo('', result.data.userInfo.user_id, result.data.userInfo)
                } else {
                    _this.$store.commit('userInfo', {})
                    uni.removeStorageSync('userInfo')
                }
            })
        },
        /**
			 * 获取订单信息
			 */
        getOrderDetail(order_id = '', bus_id = '', code = '', flag = '') {
            App.showLoading()
            let _this = this,
                obj = flag ? {
                    order_id,
                    bus_id,
                    code,
                    bus_new: 1,
                    flag
                } : {
                    order_id,
                    bus_id,
                    bus_new: 1,
                    code
                }
            App._post_form('merchant.index/codeDetail', obj, result => {
                console.log(111, result,obj)
				if(+result.code === 1 && +result.data === 1){
					// 因为没有找到对应商家，所以需要跳转到商家中心页面重新扫码
					console.log('因为没有找到对应商家，所以需要跳转到商家中心页面重新扫码')
					uni.showModal({
						title: '提示',
						content: "请选择核销码指定的商家或门店后再重新扫码",
						showCancel: false,
						success() {
							App.navigationTo({
								url: 'pages/subPages/business/index',
								redirectTo: true
							})
						}
					})
					return
				}
                if (result.code === 1) {
                    let {
                        vercode,
                        goods,
                        storeList,
                        order,
                        bus_name
                    } = result.data
                    console.log(vercode, 'vercode===============')
                    vercode.map(val => {
                        val.checked = false
                    })
                    uni.setNavigationBarTitle({
                        title: result.data.express_type === 3 ? '核销' : '自提'
                    })

                    if (storeList && storeList.length > 0) {
                        _this.storeName = storeList[0].name
                        _this.store_id = 0
                    }

                    _this.setData({
                        ...result.data,
                        isshow: true
                    })
                } else if (result.code === 0) {
                    uni.navigateBack({
                        delta: 1
                    })
                }
            }, false, () => {
                App.hideLoading()
            })
        },
        checkboxChange(e) {
            let selectCode = e.detail.value,
                vercode = this.vercode
            if (selectCode.length > 0) {
                vercode = vercode.map(val => {
                    val.checked = selectCode.includes(String(val.vercode_id))
                    return val
                })
                this.vercode.splice(0, vercode.length, ...vercode)
            }
        },
        /**
			 * 提交
			 */
        formSubmit(e) {
            let _this = this,
                fromData = {}
            fromData = e.detail.value
            if (this.storeList.length > 0 && this.order_type === 'store') {
                if (!!this.storeName) {
                    fromData.store_id = this.storeList[fromData.store_id].id
                } else {
                    App.showError(`请选择${_this.express_type === 3 || _this.express_type === 4 ? '核销' : '自提'}门店`)
                    return false
                }
            }
            if (_this.express_type === 3 || _this.express_type === 4) {
                if (fromData.vercode_id.length === 0) {
                    App.showError('请选择核销码')
                    return false
                }
                if (_this.order_type === 'user') {
                    if (fromData.password.length < 4) {
                        App.showError('请输入四位正确密码')
                        return false
                    }
                }
            } else if (fromData.selfcode_id.length === 0) {
                App.showError('请选择自提码')
                return false
            }
            App.showError('请确认操作', res => {
                if (res.errMsg === 'showModal:ok' && res.confirm === true) {
                    _this.submitcancel(fromData)
                }
            }, true)
        },
        /**
			 * 输入密码
			 */
        cancelImport(e) {
            this.password = e.detail.value
        },

        /**
			 * 查看更多
			 */
        more() {
            this.ismore = !this.ismore
        },

        /**
			 * 提交核销
			 */
        submitcancel(fromData, isurl = true) {
            if (this.isurl === false) {
                isurl = this.isurl
            }
            uni.showLoading({})
            let _this = this,
                order_type = _this.order_type,
                url = order_type === 'user' ? 'user.order/checkBySelf' : 'merchant.index/checkCode',
                checkCodeData = {
                    check_type: _this.express_type,
                    user_id: App.getUserId(),
                    ...fromData
                },
                BySelfCodeData = {
                    check_type: '2',
                    ...fromData
                },
                requestData = _this.express_type === 3 || _this.express_type === 4 ? checkCodeData : BySelfCodeData
				requestData.vercode_id = (requestData.vercode_id || []).join(',')
            App._post_form(url, requestData, result => {
                if (result.code === 1) {
                    uni.hideLoading()
                    App.showSuccess(_this.express_type === 3 || _this.express_type === 4 ? '核销成功' : '自提成功', () => {
                        let pages = getCurrentPages(),
                            url = '/pages/subPages/business/index'
                        if (pages.length === 1) {
                            // #ifdef H5
                            url += `?i=${App.getUniacid()}`
                            // #endif
                            uni.redirectTo({
                                url
                            })
                        } else {
                            uni.navigateBack({
                                delta: 1
                            })
                            if (isurl) {
                                App.showError('是否前往评论', res => {
                                    if (res.confirm === true) {
                                        App.navigationTo({
                                            url: 'pages/mainPages/order/comment/comment?order_id=' + this.order_id
                                        })
                                    }
                                }, true)

                            }

                        }

                    })
                }
            })
        },

        /**
			 * 全选
			 */
        selectAll(e) {
            this.isSelectAll = !this.isSelectAll
        }
    }
}
</script>

<style lang="scss">
	.container.is-gift {
		background-color: #2A2A2A;
		padding-bottom: 200rpx;
	}
	.goodsItem-box {
		padding: 50rpx 24rpx;
	}

	.goodsItem-box .goods-left {
		width: 124upx;
		height: 124upx;
		background-size: 124upx 124upx;
		background-position: center;
		background-repeat: no-repeat;
		margin-right: 24upx;
	}

	.goods-right {
		height: 124upx;
	}

	.cancel-list {
		padding: 0 24upx;
	}

	.center-info {
		padding: 0 24rpx;
	}

	.center-number {
		height: 60rpx;
		line-height: 60rpx;
	}

	.cancel-list .cancel-title {
		height: 100upx;
		line-height: 100upx;
		border-bottom: 1px solid #EEEEEE;
		position: relative;
	}

	.cancel-store .cancel-title {
		border: 0;
	}

	.right-text {
		display: inline-block;
		/* border-left: 2px solid #FED83F; */
		padding-left: 26upx;
		height: 28upx;
		line-height: 28upx;
	}

	.cancel-list-item {
		height: 80upx;
		line-height: 80upx;
		border-bottom: 1px solid #EEEEEE;
	}

	.cancel-list-box label:last-child .cancel-list-item {
		border: 0;
	}

	/* checkbox样式重置 */
	/* #ifdef MP-WEIXIN */
	.checkbox .wx-checkbox-input {
		width: 30upx;
		height: 30upx;
	}

	.checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border-color: #ffd940 !important;
		background: #ffd940 !important;
	}

	.checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		border-radius: 50%;
		width: 30upx;
		height: 30upx;
		line-height: 30upx;
		text-align: center;
		font-size: 24upx;
		color: #000;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
	}

	/* #endif */

	/* #ifdef H5 */
	.refund-check-item .checkbox>>>.uni-checkbox-input {
		width: 30upx;
		height: 30upx;
	}

	.refund-check-item .checkbox>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border-color: #ffd940 !important;
		background: #ffd940 !important;
	}

	.refund-check-item .checkbox>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		width: 30upx;
		height: 30upx;
		line-height: 30upx;
		text-align: center;
		font-size: 24upx;
		color: #000;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
	}

	/* #endif */
	.more {
		text-align: center;
		height: 90upx;
		line-height: 90upx;
	}

	.more .more-icon {
		font-size: 22upx !important;
		margin-left: 10upx;
	}

	.pasword-cancel {
		padding: 40upx 26upx;
	}

	.cancel-input {
		position: relative;
		height: 80upx;
		line-height: 80upx;
		overflow: hidden;
	}

	.cancel-input .input-item {
		width: 120upx;
		height: 80upx;
		border-radius: 6upx;
		position: relative;
		z-index: 1;
		background: #EEEEEE;
	}

	.cancel-input .password-input {
		position: absolute;
		height: 80upx;
		width: 100%;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		// opacity: 0;
		color: transparent;
	    caret-color:#333;
		z-index: 2;
	}

	.cancel-input .input-item {
		text-align: center;
		line-height: 80upx;
		font-size: 52upx;
	}

	.sub-btn {
		background-color: #FFD940;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		border-radius: 45upx;
		position: relative;
	}

	.sub-btn button {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		opacity: 0;
	}

	.cancel-title::after {
		content: " ";
		position: absolute;
		top: 54%;
		transform: translateY(-50%);
		left: 0;
		bottom: 8upx;
		width: 8upx;
		height: 30upx;
		background: #FFD940;
		background: var(--theme-color);
		border-radius: 20upx
	}

	.pasword-sale-title {
		position: relative;
		padding-left: 26upx;
	}

	.pasword-sale-title::after {
		content: " ";
		position: absolute;
		top: 54%;
		transform: translateY(-50%);
		left: 0;
		bottom: 8upx;
		width: 8upx;
		height: 30upx;
		background: #FFD940;
		background: var(--theme-color);
		border-radius: 20upx
	}

	/*
	.input-write {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 80upx;
		height: 2upx;
		background-color: #f2f2f2;
	}

	.input-write-1 {
		left: 15%;
	}

	.input-write-2 {
		left: 44%;
	}

	.input-write-3 {
		left: 73%;
	} */

	.cancel-list-item__title {
		width: 0;
		flex: 1;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		text-align: right;
	}
</style>
