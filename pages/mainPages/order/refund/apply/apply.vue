<template>
	<!-- 申请售后 -->
	<view :style="themeColor">
		<form @submit="onSubmit" report-submit>
			<!-- 商品详情 -->
			<form @submit="onGoodsDetail" :report-submit="true">
				<button class="btn-normal" formType="submit">
					<!-- 售后商品 -->
					<view class="refund-goods b-f dis-flex flex-dir-row flex-y-center" v-if="goodsData">
						<list-goods-item :goods-data="goodsData"></list-goods-item>
					</view>
				</button>
			</form>

			<view class="refund-detail">
				<!-- 售后类型 -->
				<view class="refund-content b-f" v-if="[1,6].indexOf(express_type) != -1">
					<view class="refund-type-title f-28 col-3">服务类型</view>
					<view class="refund-type-list">
						<radio-group @change="typeChange" name="type" class="dis-flex flex-x-between flex-y-center ">
							<label class="refund-type-item" :class="{ 'active main-bg-color auxiliary-color ': refundType === '10' }" v-if="receipt_status === 20">
								<radio class="radio" value="10" :checked="refundType === '10'" />
								退货退款
							</label>
							<label class="refund-type-item" :class="{ 'active main-bg-color auxiliary-color ': refundType === '20' }" v-if="receipt_status === 20">
								<radio class="radio" value="20" :checked="refundType === '20'" />
								换货
							</label>
							<label class="refund-type-item" :class="{ 'active main-bg-color auxiliary-color ': refundType === '30' }">
								<radio class="radio" value="30" :checked="refundType === '30'" />
								退款
							</label>
						</radio-group>
					</view>
				</view>

				<!-- 核销码 -->
				<view class="refund-check m-top20 b-f" v-if="order_vercode.length > 0">
					<view class="refund-check-title f-28 col-3 border-line border-bottom">
						核销码
						<text class="col-9">(可多选)</text>
					</view>
					<checkbox-group class="refund-check-list" name="vercode_id" @change="checkChange">
						<label class="refund-check-item dis-flex flex-dir-row flex-x-between flex-y-center" v-for="(item, index) in orderVercode"
						 :key="index">
							<view class="refund-check-code f-24 col-3">
								核销码
								<text class="col-9">{{ item.code }}</text>
							</view>
							<checkbox class="checkbox" :value="item.vercode_id+''" :checked="item.checked"/>
							<!-- <view class="iconfont" :class="[index === 0?'icon-squarecheckfill':'icon-square']"></view> -->
						</label>
					</checkbox-group>
				</view>

				<!-- 申请原因 -->
				<view class="refund-content b-f m-top20 dis-flex flex-dir-row flex-x-between flex-y-center">
					<view class="col-3 f-28">申请原因</view>
					<view class=" dis-flex flex-dir-row flex-x-between flex-y-center" @click="selectReason">
						<view class="col-9 f-24">{{ !!reasonText ? reasonText : '请选择申请原因' }}</view>
						<view class="iconfont icon-jinrujiantou1 col-9"></view>
					</view>
				</view>

				<!-- 问题列表 -->
				<pop-manager :show="isShowReason" type="bottom" @clickmask="selectReason">
					<view class="reason-content b-f">
						<form @submit="reasonSelect" report-submit="">
							<view class="module-title module-title1">
								申请退款
								<view class="iconfont icon-close" @click="selectReason"></view>
							</view>
							<scroll-view scroll-y class="reason-list module-content">
								<radio-group-list :radio-list="reasonList" @radioChange="reasonChange"></radio-group-list>
							</scroll-view>
							<view class="reason-btn module-content"><button form-type="submit" class="main-bg-color auxiliary-color">确定</button></view>
						</form>
					</view>
				</pop-manager>

				<!-- 问题描述 -->
				<view class="refund-content b-f m-top20">
					<view class="col-3 f-28">问题描述</view>
					<view class="refund-type-list">
						<block v-if="isFocus">
							<textarea :focus="textareaFocus" @blur="isFocus = false" name="problem_desc" v-model="problem_desc" maxlength="500"
							 placeholder="请详细填写申请原因，注意保持商品完好，建议您先于卖家沟通" placeholder-class="simulation-text" />
							</block>
						<block v-else>
							<view class="simulation-text" :style="{ color: problem_desc.length > 0 ? '#333' : '#888' }" @click="isFocus = true">
								{{ problem_desc.length > 0 ? problem_desc : '请详细填写申请原因，注意保持商品完好，建议您先于卖家沟通' }}
							</view>
						</block>
					</view>
				</view>

				<!-- 上传凭证 -->
				<view class="refund-content b-f m-top20">
					<view class="col-3 f-28">上传凭证</view>
					<view class="refund-type-list">
						<view class="imgs-list dis-flex flex-y-center">
							<view class="img-item" v-for="(item, index) in imageList" :key="index">
								<view class="delete-img" @click.stop="deleteImage" :data-image-index="index">×</view>
								<image :src="item"></image>
							</view>
							<!-- 上传图片 -->
							<form v-if="imageList.length < 9" @submit="chooseImage" report-submit="true">
								<button class="btn-normal" formType="submit">
									<view class="img-item upload dis-flex flex-dir-column flex-x-center flex-y-center"><view class="iconfont icon-paizhao"></view></view>
								</button>
							</form>
						</view>
					</view>
				</view>
			</view>

			<view class="footer-fixed flex-x-between" v-if="refundType !== 20">
				<view class="col-3 f-28">
					售后金额:
					<text class="col-m">{{settingData.currency}}{{express_type === 3 && details.is_ticket != 1?order_vercode_money : total_pay_price }}</text>
				</view>
				<button class="btn-normal refund-btn main-bg-color auxiliary-color" formType="submit" @click="saveFormId('aftersale',{'order_id':order_id})">提交</button>
			</view>
		</form>
		<page-loading v-if="!goodsData" ref="loading"></page-loading>
		<!-- 退款确认弹窗 -->
		<PopManager :show="refundTipsPopupVisible">
			<view class="refund-tips-card">
				<view class="refund-tips-card__header">是否同意继续申请？</view>
				<view class="refund-tips-card__content">
				 	<view v-if="refundTipsRes.money" class="refund-tips-card__text" >当前申请退款金额为：￥{{refundTipsRes.money}}</view>
					<view v-if="refundTipsRes.service_charge" class="refund-tips-card__text" >扣除对应手续费：￥{{refundTipsRes.service_charge}}</view>
					<view v-if="refundTipsRes.refund_root" class="refund-tips-card__text">退款去向：{{refundTipsRes.refund_root}}</view>
				</view>
				<view class="refund-tips-card__footer">
					<button class="refund-tips-card__btn is-cancel btn-normal" @click="refundTipsPopupVisible = false">取消</button>
					<button class="refund-tips-card__btn is-confirm btn-normal" @click="doReallySubmit">同意</button>
				</view>
			</view>
		</PopManager>
		<!-- 退款确认弹窗 end -->
	</view>
</template>

<script>
import PopManager from '@/components/template/PopManager.vue'
import RadioGroupList from '@/components/template/RadioGroup.vue'
import ListGoodsItem from '@/components/template/ListGoodsItem.vue'
import App from '@/common/js/app.js'
let reasonIndex = ''
export default {
    data() {
        return {
			details: {},
            currentChecked: '-1',
            isShowReason: false,
            refundType: '', // 售后类型 10退货退款 20换货 30退款
            // 订单id
            order_id: '',
            // 订单商品id
            order_goods_id: '',
            // 用户收货状态
            receipt_status: '', // 10=未收，20=已收货
            // 订单商品id
            goods_id: null,

            // 图片列表
            imageList: [],
            localIds: [],
            // 订单类型
            express_type: 1,
            is_buy_and_give: '',
            // 判断是否重复提交
            disable: false,
            reasonText: '',
            textareaFocus: false,
            reason: [], // 申請原因
            order_vercode: [], // 核销码
            total_price: '', // 商品总价
            total_pay_price: '', // 退款金額
            goodsData: null,
            reasonList: [],
            problem_desc: '', // 问题描述
            isFocus: false, // textarea是否聚焦
            order_vercode_money: 0, // 核销码售后金额，
            // 退款提示弹窗是否显示
            refundTipsPopupVisible: false,
            // 弹窗信息的接口数据
            refundTipsRes: {},
            after_sales_detail: {},
            // 当前需要提交的表单数据
            postParams: {

            }
        }
    },
    components: {
        PopManager,
        RadioGroupList,
        ListGoodsItem
    },
    computed: {
        orderVercode() {
            if (this.order_vercode.length > 0) {
                return this.order_vercode.filter(val => val.check_status === 0)
            }
        }
    },
    watch: {
        isFocus(newValue, oldValue) {
            if (newValue) {
                setTimeout(() => {
                    this.textareaFocus = newValue
                }, 200)
            }
        }
    },
    onLoad(options) {
        App.showLoading()
        // 记录页面参数
        this.order_goods_id = options.order_goods_id
        this.order_id = options.order_id
        // 获取订单商品详情
        this.getGoodsDetail(options.order_goods_id)
    },
    methods: {
        selectReason() {
            this.isShowReason = !this.isShowReason
        },
        reasonChange(e) {
            reasonIndex = e.value
        },
        reasonSelect() {
            this.reasonText = this.reasonList[reasonIndex].title
            this.selectReason()
        },
        /**
		 * 售后类型切换
		 */
        typeChange(e) {
            this.refundType = e.detail.value
        },

        /**
		 * 核销码选择
		 */
        checkChange(e) {
			let order_vercode_money = 0,
			    vercode_id = e.detail.value
			// 是否开启多买赠送，或者售后规则为30时，点击一个选择框全部选中
			if (this.is_buy_and_give == 1 || this.after_sales_detail.status == 30) {
			    console.log('发达省份都是', e.detail.value.length)
			    if (e.detail.value.length != 1) {
			        this.order_vercode.map(item => this.$set(item, 'checked', false))
			    } else {
			        this.order_vercode.map(item => this.$set(item, 'checked', true))
			    }
				this.order_vercode.forEach(code => {
				
				    if (code.checked) {
				        order_vercode_money += Number(code.pay_money)
				    }
				})
			}else {
				this.order_vercode.forEach(code => {
					if (vercode_id.includes(String(code.vercode_id))) {
						order_vercode_money += Number(code.pay_money)
					}
				})
			}
			
            this.order_vercode_money = order_vercode_money
            

        },

        /**
		 * 获取订单商品详情
		 */
        getGoodsDetail(order_goods_id) {
            let _this = this
            App._get('User.Refund/getOrderDetail', {
                order_goods_id: order_goods_id
            }, result => {
                let { goods_name, goods_attr, total_price, image, total_num, is_buy_and_give, after_sales_detail } = result.data,
                    reasonList = result.data.reason.map((val, index) => {
                        let item = { id: String(index),
                            title: val }
                        if (index === 0) {
                            _this.reasonText = val
                        }
                        return item
                    })
                uni.$emit('dataList', reasonList)
                _this.goodsData = {
                    goods_name,
                    goods_attr,
                    image,
                    total_num,
                    is_buy_and_give,
                    after_sales_detail,
                    goods_price: total_price / total_num
                }
				this.details = result.data
                _this.reasonList.push(...reasonList)
                delete result.data.reason
                _this.refundType = result.data.receipt_status === 20 ? '10' : '30'
                _this.setData(result.data)
                App.hideLoading(1000)
            })
        },

        /**
		 * 切换标签
		 */
        onSwitchService(e) {
            // 记录formId
            App.saveFormId('pay', {
                type: 'normal'
            })
        },

        /**
		 * 跳转商品详情
		 */
        onGoodsDetail(e) {
            App.navigationTo({
                url: 'pages/subPages/goods/index/index?goods_id=' + this.goods_id
            })
        },

        /**
		 * 选择图片
		 */
        chooseImage(e) {
            let _this = this,
                index = e.currentTarget.dataset.index,
                imageList = _this.imageList
            // 选择图片
            App.chooseImage({
                count: 9 - imageList.length,
                sizeType: [
                    'original',
                    'compressed'
                ], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: [
                    'album',
                    'camera'
                ], // 可以指定来源是相册还是相机，默认二者都有
                success(res) {
                    console.log(res)
                    _this.imageList.push(...res.tempFilePaths)
                    if (_this.appClientType === '4') {
                        _this.localIds.push(...res.localIds)
                    }
                }
            })
        },

        /**
		 * 删除图片
		 */
        deleteImage(e) {
            let dataset = e.currentTarget.dataset,
                imageList = this.imageList
            imageList.splice(dataset.imageIndex, 1)
        },

        /**
		 * 表单提交
		 */
        onSubmit(e) {
            let _this = this,
                formVerify = {
                    verify: [
                        !!_this.reasonText,
                        !!_this.problem_desc
                    ],
                    errMsg: [
                        '申请原因不能为空',
                        '问题描述不能为空'
                    ]
                }
            if (formVerify.verify.includes(false)) {
                let errIndex = formVerify.verify.findIndex(val => val === false)
                App.showError(formVerify.errMsg[errIndex])
                return false
            }

            if (_this.express_type === 3 && e.detail.value.vercode_id && e.detail.value.vercode_id.length === 0 && this.details.is_ticket != 1) {
                App.showError('请选择申请售后的核销码')
                return false
            }

            // 判断是否重复提交
            if (_this.disable === true) {
                return false
            }
            // 表单提交按钮设为禁用 (防止重复提交)
            _this.disable = true
            // form参数
            let postParams = {
                order_goods_id: _this.order_goods_id,
                type: _this.express_type !== 1 ? '30' : _this.refundType,
                apply_desc: _this.reasonText,
                problem_desc: _this.problem_desc,
                image_id: [],
                vercode_id: (e.detail.value.vercode_id || []).join(',')
            }
            // 缓存数据
            this.postParams = postParams
            // 请求确认弹窗数据
            this.refundTipsRes = {}
            this.fetchRefundTipsRes({
                order_goods_id: postParams.order_goods_id,
                vercode_id: postParams.vercode_id,
                type: postParams.type
            })
            // 打开确认弹窗
            this.refundTipsPopupVisible = true


        },
        // 真的提交方法
        doReallySubmit() {
            const postParams = this.postParams
            const _this = this
            // form提交执行函数
            let formSubmit = function () {
                App._post_form('User.Refund/receiveApply', postParams, result => {
                    if (result.code === 1) {
                        uni.hideLoading()
                        // 跳转售后管理页面
                        App.navigationTo({
                            url: 'pages/mainPages/order/refund/index',
                            redirectTo: true
                        })
                    } else {
                        App.showError(result.msg)
                    }
                }, false, () => {
                    uni.hideLoading()
                    _this.disable = false
                })
            }

            // 图片上传
            let upLoadArray = _this.appClientType === '4' ? _this.localIds : _this.imageList
            uni.showLoading({
                title: '正在提交...',
                mask: true
            })
            if (upLoadArray.length > 0) {
                App._upLoadAll(upLoadArray).then(options => {
                    console.log(options)
                    let uploadData = options.map(val => val.file_id)
                    postParams.image_id = uploadData
                    formSubmit()
                })
            } else {
                formSubmit()
            }
        },

        /**
		 * 兼容textarea层级问题
		 */
        showTextarea() {
            this.isFocus = !this.isFocus
        },
        // 请求表单数据
        async fetchRefundTipsRes({
            order_goods_id,
            vercode_id,
            type
        }) {
            try {
                const res = await App._postP('User.Refund/receiveTips', {
                    order_goods_id,
                    vercode_id,
                    type
                })
                this.refundTipsRes = this.$util.deepGet(res, 'data', {})
            } catch (e) {
                // TODO handle the exception
            }
        }
    }
}
</script>

<style lang="scss" scoped >
/* 售后商品 */
.refund-goods {
	padding: 0 30upx;
}

.refund-goods .refund-goods-img {
	margin-right: 20upx;
}

.refund-goods .refund-goods-img image {
	width: 170upx;
	height: 170upx;
	display: block;
	border-radius: 6upx;
}

/* 售后详情 */
.refund-detail {
	padding: 30upx;
	padding-bottom: 150upx;
}

.refund-content {
	border-radius: 6upx;
	padding: 30upx 36upx;
}

.refund-type-list {
	margin-top: 30upx;
}

.refund-type-item {
	font-size: 24upx;
	color: #999999;
	border: 1upx solid #eeeeee;
	border-radius: 6upx;
	padding: 18upx 58upx;
	position: relative;
}

.refund-type-item .radio {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	z-index: 1;
}

.refund-type-item.active {
	background: #ffd940;
	color: #333333;
	border: 1upx solid transparent;
}

/* 核销码 */
.refund-check {
	border-radius: 6upx;
}

.refund-check-title {
	padding: 30upx 0;
	margin: 0 30upx;
}

.refund-check-list {
	padding: 24upx 36upx;
}

.refund-check-item {
	margin-bottom: 18upx;
	position: relative;
}

.refund-check-list .refund-check-item:last-child {
	margin-bottom: 10upx;
}

.refund-check-code text {
	display: inline-block;
	margin-left: 30upx;
}

.refund-check-item .iconfont {
	font-size: 42upx;
	width: 1em;
	height: 1em;
	line-height: 1em;
	text-align: center;
	color: #eeeeee;
}

.refund-check-item .iconfont.icon-squarecheckfill {
	color: #ffd940;
}

/* 问题描述 */
.refund-type-list textarea,
.refund-type-list .simulation-text {
	width: 100%;
	height: 238upx;
	background: #f9f9f9;
	border-radius: 6upx;
	padding: 30upx 24upx;
	box-sizing: border-box;
	font-size: 28upx;
	color: #333333;
	line-height: 1.4;
}
.refund-type-list .simulation-text {
	/* line-height: 1.4; */
}

.textarea-place {
	font-size: 28upx;
	color: #333333;
}

/* 图片凭证 */
.imgs-list {
	flex-wrap: wrap;
}

.img-item {
	width: 133upx;
	height: 133upx;
	position: relative;
	margin: 0 20upx 20upx 0;
}

.img-item.upload {
	border: 1upx dashed #cccccc;
}

.img-item.upload .iconfont {
	font-size: 42upx;
	color: #999999;
}

.img-item .delete-img {
	position: absolute;
	top: -0.4em;
	right: -0.4em;
	font-size: 32upx;
	width: 1.2em;
	height: 1.2em;
	text-align: center;
	line-height: 1.15em;
	background: rgba(0, 0, 0, 0.8);
	color: #ffffff;
	font-weight: bold;
	border-radius: 50%;
	z-index: 2;
}
.img-item image {
	width: 100%;
	height: 100%;
	display: block;
	border-radius: 6upx;
	position: relative;
	z-index: 1;
}

/* 底部提交 */
.footer-fixed {
	line-height: 100upx;
	padding-left: 38upx;
}
.refund-btn {
	width: 300upx;
	background: #ffd940;
	text-align: center;
	color: #333333;
	font-size: 28upx;
	line-height: 100upx;
}

/* 原因列表 */
.reason-content {
	width: 100vw;
	height: 55vh;
	border-radius: 10upx 10upx 0 0;
	overflow: hidden;
	position: relative;
}

.reason-content .icon-close {
	position: absolute;
	top: 50%;
	right: 5%;
	transform: translateY(-50%);
	font-size: 42upx;
	width: 1em;
	height: 1em;
	line-height: 1em;
	color: #999999;
}

.reason-list {
	height: calc(55vh - 240upx);
	box-sizing: border-box;
}

.reason-btn {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	box-sizing: border-box;
}
.reason-btn button {
	background: #ffd940;
	border-radius: 40upx;
	font-size: 26upx;
	height: 80upx;
	line-height: 80upx;
}
.module-title1::after {
	background-color: var(--theme-color);
}

/* checkbox样式重置 */
/* #ifdef MP */
.checkbox  .wx-checkbox-input {
	width: 30upx;
	height: 30upx;
}

.checkbox  .wx-checkbox-input.wx-checkbox-input-checked {
	border-color: #ffd940 !important;
	background: #ffd940 !important;
}

.checkbox  .wx-checkbox-input.wx-checkbox-input-checked::before {
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
.refund-check-item .checkbox  .uni-checkbox-input {
	width: 30upx;
	height: 30upx;
}

.refund-check-item .checkbox  .uni-checkbox-input.uni-checkbox-input-checked {
	border-color: #ffd940 !important;
	background: #ffd940 !important;
}

.refund-check-item .checkbox  .uni-checkbox-input.uni-checkbox-input-checked::before {
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
// 退款确认弹窗
.refund-tips-card {
	box-sizing: border-box;
	width: 540rpx;
	padding: 30rpx;
	background-color: #fff;
	border-radius: 10px;
}
.refund-tips-card__header {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
	padding: 20rpx 0;
}
.refund-tips-card__content {
	padding: 30rpx 0 50rpx 0;
}
.refund-tips-card__text {
	font-size: 28rpx;
	color: #333;
	text-align: center;
	&+& {
		margin-top: 8rpx;
	}
}
.refund-tips-card__footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.refund-tips-card__btn {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 70rpx;
	width: 225rpx;
	font-size: 26rpx;
	font-weight: bold;
	color: #333;
	border-radius: 4rpx;
	&.is-cancel {
		border: 1px solid #CCCCCC;
	}
	&.is-confirm {
		background-color: var(--theme-color,#FFD940);
	}
}
// 退款确认弹窗 end
</style>
