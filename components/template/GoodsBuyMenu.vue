<!--
	商品购买菜单
	submit 确认选择
 -->
<template>
	<view>
		<!-- 购买菜单 -->
		<popup-view :show="showBuyMenu" type="bottom" @clickmask="onToggleTrade">
			<view class="goods-buy-menu" :style="{'height':buyMeunHeight}">
				<!-- 关闭按钮 -->
				<view class="iconfont icon-roundclose" @click="onToggleTrade"></view>
				<!-- 主体信息-->
				<view class="trade-main">
					<!-- 购买信息 -->
					<view class="buy-info dis-flex flex-y-center">
						<view class="buy-images" @click="previewSkuImage">
							<image :src="image_path"></image>
						</view>
						<view class="buy-content">
							<view class="buy-money price-font-family dis-flex flex-y-line">
								<text class="money-label">{{settingData.currency}}</text>{{goods_price}}
								<text v-if="line_price != 0" class="money-label" style="margin-left: 16rpx;color: #999999;text-decoration: line-through;">{{settingData.currency}}{{line_price}}</text>
								<view class="dis-flex flex-y-center member-coupon-view" v-if="goodsDetail.is_member_price === 1 && !!goodsDetail.member_price">
									<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
									<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.discount_font}}<text class="member-coupon-price">{{sku_coupon_price}}</text>元</view>
								</view>
								<!-- 规格对应的返利价格 -->
								<view v-if="rebatePrice" class="sku-rebate">
									<view class="sku-rebate__prefix">佣</view>
									<view class="sku-rebate__price">返¥{{rebatePrice}}</view>
								</view>
								<!-- 规格对应的返利价格 end -->
							</view>
							<view class="buy-stock" v-if="!isHideStock">库存{{stock_num}}件</view>

							<view class="buy-spec" v-if="!!specData">
								<scroll-view style="height:100upx" scroll-y>
									选择 {{selectSpec}}
								</scroll-view>
							</view>
						</view>
					</view>
					<!-- 商品规格 -->
					<scroll-view scroll-y class="buy-spec-list" :style="{'height':'calc('+buyMeunHeight+' - 200rpx)'}">
						<block v-if="!!specData&&specData.length>0">
							<block v-for="(attr,attr_idx) in specData" :key="attr.signid">
								<view class="buy-spec-item">
									<view class="spec-item-title">{{attr.spec_item}}</view>
									<view class="spec-items dis-flex flex-dir-row" v-if="attr.spec_item_list.length>0">
										<block v-for="(item,item_idx) in attr.spec_item_list" :key="item.signid">
											<view class="spec-item" :class="{'active':item.checked,'disabled':item.disabled}" @click="modelTap"
											 :data-attr-idx="attr_idx" :data-item-idx="item_idx" :data-item-check="item.checked" :data-item-disabled="item.disabled">{{item.spec_title}}</view>
										</block>
									</view>
								</view>
							</block>
						</block>
						<!-- 表单 -->


						<!-- <view class="buy-number dis-flex flex-y-center flex-x-between">
							<view class="buyNumber f-28">
								<text>购买数量</text>
							</view>
							<view class="selectNumber dis-flex flex-y-center">
								<button @click="down" class="default" :class="[goods_num>1?'':' default-active']" type="default">-</button>
								<input type="number" :value="goods_num" disabled></input>
								<button @click="up" class="default" :class="{'default-active':goods_num>=stock_num || (limit_buy === 10 && goods_num>=surplus_quantity)}"
								 :disabled="goods_num>=stock_num || isMaxBuyLimit || isDisabledTally" type="default">+</button>
							</view>
						</view> -->
					</scroll-view>
					<!-- 按钮 -->
					<view class="buy-button-box dis-flex flex-y-center">
						<block v-if="isSelectSpec">
							<button v-if="appointmentCountDownStr" class="buy-button" @click="$emit('on-btn-appointment-click')">
									<view class="iconfont is-inline icon-naozhong" style="margin-right: 8rpx;"></view>
									<text v-if="!booked">我要预约</text>
									<text v-else-if="booked">预约成功</text>
									<text style="font-size: 20rpx;color:#fff;font-weight: lighter;margin-top: 10rpx;">（距离开始{{appointmentCountDownStr}}）</text>
							</button>
							<button v-else-if="!goodsActivity.group_id" class="buy-button" :disabled="stock_num == 0" @click="btnClick(btnType)">
								<block v-if="stock_num == 0">暂无库存</block>
								<block v-else>
									<text>确定</text>
									<text v-if="cLimitBuyNum" style="font-size: 20rpx;color:#fff;font-weight: lighter;margin-top: 10rpx;">（限购{{cLimitBuyNum}}件）</text>
								</block>
							</button>
							<block v-if="!!goodsActivity.group_id || !!goodsActivity.spike_id">
								<button v-if="hasGroups && !isMaxBuyLimit && isShowJoinGroups && groupBuyType === '2'" class="buy-button join-btn main-bg-color auxiliary-color"
								 :disabled="stock_num == 0 || isMaxBuyLimit" @click="btnClick('joinGroups')">{{stock_num == 0?"暂无库存":"去参团"}}</button>
								<button v-if="hasGroups" class="buy-button " :disabled="stock_num == 0 || isMaxBuyLimit" @click="btnClick(groupBuyType === '1'?'confirm':'groups')">{{stock_num == 0?"暂无库存":!isMaxBuyLimit?groupBuyType === '1'?"确定":!isShowJoinGroups?"确定":"开团":'您已到达购买上限'}}</button>
							</block>
						</block>
						<block v-else>
							<button class="buy-button " disabled>请选择商品规格</button>
						</block>
					</view>
				</view>
			</view>
		</popup-view>
		<!-- 购买提醒 -->
		<block v-if="showBuytips">
			<view class="buy-tips">
				<view class="tips-contnet b-f">
					<view class="tips-title col-f"></view>
					<text class="tips-text f-26">{{buy_tip}}</text>
					<view class="tips-btn col-f f-28 t-c help-bg-color " @click="tipsKnow">我知道了</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import PopupView from '@/components/template/PopManager.vue'
export default {
    data() {
        return {
            disabledTally: false, // 是否禁用选择数量
            hideStock: false, // 是否隐藏库存
            showBuyMenu: false, // 弹窗的显示与隐藏
            showBuytips: false,
            goods_price: '', // 商品价格
			line_price: '',
            goods_num: 1, // 商品数量
            stock_num: 0, // 库存数量
            limit_buy: 0, // 用户限购数量
            surplus_quantity: 0, // 用户可购数量
            goods_sku_id: '', // 选择规格id
            goods_spec_arr: [], // 子规格项id
            sku_coupon_price: 0, // 规格会员优惠
            specData: [], // 规格项列表
            image_path: null, // 规格图片
            skuItem: null, // 已选规格
            activityData: null, // 活动参数
            buy_tip: '', // 购买提醒
            btnType: '',
        }
    },
    props: {
		// 当前规格返利金额
		rebatePrice: {
			type: String,
			default: ''
		},
        goodsSpec: { // 商品规格项
            type: Array,
            default: () => null
        },
        // 要购买的商品规格id
        pGoodSkuId: {
            type: String,
            default: ''
        },
        goodsDetail: { // 商品详情
            type: Object,
            default: () => null
        },
        specDisabled: {
            type: Boolean,
            default: false
        },
        goodsActivity: { // 商品活动数据
            type: Object,
            default: () => null
        },
        groupBuyType: { // 商品活动数据
            type: String,
            default: ''
        },
		// 预约剩余时间，为空不显示
		appointmentCountDownStr: {
			type: String,
			default: ''
		},
		// 是否已经预约
		booked: {
			type: Boolean,
			default: false
		}
    },
    components: {
        PopupView
    },
    computed: {
		cActiveSku() {
			const spec_sku_id = (this.goods_spec_arr || []).join('_')
			return this.$util.deepGet(this.goodsDetail, 'sku', []).find(val => val.spec_sku_id == spec_sku_id)
		},
        // 确定按钮上显示的限购数 为假值就不显示 https://weliam.coding.net/p/lingdian/requirements/issues/6953/detail
        cLimitBuyNum() {
            // 当前选中的规格
            const spec_sku_id = (this.goods_spec_arr || []).join('_')
            const activeItem = this.$util.deepGet(this.goodsDetail, 'sku', []).find(val => val.spec_sku_id == spec_sku_id)
            if (!activeItem || activeItem.limit_buy != 20) {
                return ''
            }
            return activeItem.limit_num

        },
        isDisabledTally() {
            return this.disabledTally
        },
        isHideStock() {
            return this.hideStock
        },
        selectSpec() {
            let specData = this.specData,
                specTextArray = []
            if (!!specData && specData.length > 0) {
                specData.map(val => {
                    val.spec_item_list.map(item => {
                        if (item.checked) {
                            specTextArray.push(item.spec_title)
                        }
                    })
                })
            }
            return specTextArray.join(' · ')
        },
        isSelectSpec() {
            if (this.goodsDetail) {
                return this.goodsDetail.spec_type === 20 ? this.goods_spec_arr.filter(val => !!val).length === this.specData.length
                    : true
            }
        },
        buyMeunHeight() {
            if (this.goodsDetail) {
                return this.goodsDetail.spec_type === 20 ? (!!this.specData && this.specData.length > 1 ? '65vh' : '50vh')
                    : '40vh'
            }
        },
        hasGroups() {
            return this.goodsActivity && this.goodsActivity.group_id
        },
        hasBargain() {
            return this.goodsActivity && this.goodsActivity.bargain_id
        },
        groupsType() {
            return this.hasGroups && this.groupBuyType === '2'
        },
        isShowJoinGroups() {
            return this.activityData && this.activityData.is_show_groups === 1 && this.activityData.groupsNumber > 0
        },
        isMaxBuyLimit() {
            if (this.activityData) {
                let {
                        limit_buy, // 用户限购数量
                        surplus_quantity // 用户可购数量
                    } = this,
                    buyNumber = this.activityData.buyNumber
                console.log('isMaxBuyLimit', this.goods_num, buyNumber, surplus_quantity)
                if (typeof buyNumber === 'string') {
                    if (limit_buy === 10 && ((this.goods_num + Number(buyNumber)) >= surplus_quantity)) {
                        return !0
                    }
                    return !1
                }
            }
        }
    },
    watch: {
		cActiveSku(val) {
			this.$emit('on-active-sku-change',val)
		},
        goodsSpec(newValue) {
            if (!!newValue && newValue.length > 0) {
                this.specData.splice(0, newValue.length, ...newValue)
            }
        },
        goodsDetail(newValue) {
            if (!!newValue) {

					 this.initBuyMeunData(newValue)

            }
        },
        goodsActivity(newValue) {
            if (newValue) {
                if (!!newValue.group_id) {
                    this.activityData = newValue.groupData
                }
            }
        },
        groupBuyType(newValue) {
            if (!!newValue) {
                this.updateSpecGoods()
            }
        }
    },
    mounted() {
        // console.log('9999999999999999999',this.specData)
    },
    methods: {
        /**
			 * 初始化商品详情数据
			 */
        initBuyMeunData(detail) {
            let _this = this,
                data = {},
                {
                    group_id,
                    groupData
                } = this.goodsActivity
            // 规格id///
            data.goods_sku_id = detail.sku[0].spec_sku_id || ''
            // 商品价格
            data.goods_price = this.groupsType ? detail.sku[0].groups_price : detail.sku[0].goods_price
			data.line_price = detail.sku[0].line_price
            // 会员优惠
            data.sku_coupon_price = detail.sku[0].coupon_price
            // 库存
            data.stock_num = detail.sku_count
            // 是否限购
            data.limit_buy = !!group_id ? (groupData.is_limit === 1 ? 10 : 20) : detail.limit_buy
            // 剩余可购买数量
            data.surplus_quantity = !!group_id ? groupData.limit_num : detail.surplus_quantity
            // 单规格商品封面图
            data.image_path = detail.image[0]['file_path']
            // 多规格商品封面图
            if (detail.spec_type == 20 && detail.sku[0].image) {
                data.image_path = detail.sku[0].image.file_path || detail.image[0]['file_path']
            }
            // 初始化商品多规格
            if (detail.spec_type == 20) {
                // 默认选中规格第一项
                let specData = _this.initManySpecData(this.specData, this.specDisabled)
                // 查询默认规格的库存
                let checkedSpec = specData.map(item => {
                    let checked = ''
                    item.spec_item_list.map(val => {
                        if (val.checked) {
                            checked = val.signid
                        }
                    })
                    return checked
                })
                if (checkedSpec.length > 0) {
                    let spec_num = detail.sku.filter(val => val.spec_sku_id === checkedSpec.join('_'))
                    data.stock_num = spec_num.length > 0 ? spec_num[0].stock_num : detail.sku_count
                }
                data.specData = specData
            }
            // 购买提醒
            data.buy_tip = detail.buy_tip
            this.setData(data)
        },
        /**
			 * 商品规格默认不选中
			 */
        initManySpecData(data, isNoCheck) {
            console.log('isNoCheck', isNoCheck)
            for (let i in data) {
                for (let j in data[i].spec_item_list) {
                    if (j < 1) {
                        this.goods_spec_arr.splice(i, 1, data[i].spec_item_list[0].signid)
                    }
                    if (!isNoCheck) {
                        if (j < 1) {
                            data[i].spec_item_list[0].checked = true
                        } else {
                            data[i].spec_item_list[j].checked = false
                        }
                    }
                }
            }
            return data
        },
        /**
			 * 点击切换不同规格
			 */
        modelTap(e) {
            let _this = this,
                attrIdx = Number(e.currentTarget.dataset.attrIdx),
                itemIdx = Number(e.currentTarget.dataset.itemIdx),
                disabled = e.currentTarget.dataset.itemDisabled,
                checked = e.currentTarget.dataset.itemCheck,
                specItemList = null,
                {
                    group_id,
                    spike_id
                } = _this.goodsActivity
            // 活动商品判断不参与规格
            if (_this.specDisabled && disabled) {
                return
            }

            specItemList = _this.specData[attrIdx].spec_item_list.map((val, index) => {
                // 活动商品规格，可以取消选择 和 判断是否不参与活动
                if (_this.specDisabled) {
                    if (!disabled) {
                        if (!checked) {
                            val.checked = itemIdx === index
                        } else {
                            val.checked = false
                        }
                        if (itemIdx === index) {
                            _this.goods_spec_arr.splice(attrIdx, 1, val.signid)
                        }
                    }
                } else {
                    val.checked = itemIdx === index
                }

                if (itemIdx === index) {
                    _this.goods_spec_arr.splice(attrIdx, 1, val.checked ? val.signid : null)
                    if (_this.specDisabled) {
                        _this.filterDisabledSpec(val, attrIdx)
                    }
                }
                return val
            })

            _this.$set(_this.specData[attrIdx], 'spec_item_list', specItemList)
            // 更新商品规格信息
            _this.updateSpecGoods()
        },
        /**
			 * 拼团过滤不参与活动规格
			 * @param {Object} 当前子规格项
			 * @param {Number} 当前规格项index
			 */
        filterDisabledSpec(currentSign, attrIdx) {
            let _this = this,
                skuData = _this.goodsDetail.sku,
                specData = _this.specData,
                specLength = specData.length, // 规格数量
                disabledSignid = [] // 包含该规格切不参与活动的规格
            if (Array.isArray(specData) && Array.isArray(skuData)) {
                // 查找包含该子规格的所有规格是否参与拼团
                skuData.map(skuItem => {
                    const {
                        is_use,
                        title,
                        spec_sku_id = ''
                    } = skuItem
                    if (specLength === 1 && !is_use) {
                        disabledSignid.push(spec_sku_id)
                    } else if (!is_use && spec_sku_id.includes(currentSign.signid)) {
                        disabledSignid.push(spec_sku_id)
                    }
                })
                // 判断该项是否存在可选规格项
                if (specLength === 1) {

                } else {
                    specData.map((val, index) => {
                        let spec_item_list = val.spec_item_list
                        // 判断其他规格中，不参与拼团的规格项
                        if (index !== attrIdx) {
                            spec_item_list.map(item => {
                                let goodsSpec = _this.goods_spec_arr.map(val => val) // 已选子规格
                                goodsSpec[index] = item.signid
                                goodsSpec = goodsSpec.filter(val => !!val).join('_') // 可选规格
                                item.disabled = disabledSignid.includes(goodsSpec)
                            })
                        }
                    })
                }
            }

        },
        /**
			 * 更新商品规格信息
			 */
        updateSpecGoods() {
            let spec_sku_id = this.goods_spec_arr.join('_'),
                {
                    group_id,
                    spike_id
                } = this.goodsActivity
            // 查找skuItem
            let spec_list = this.goodsDetail.sku,
                {
                    is_member,
                    is_member_price
                } = this.goodsDetail,
                skuItem = null
            skuItem = spec_list.find(val => val.spec_sku_id == spec_sku_id)
            // 记录goods_sku_id
            // console.log("group_id", group_id);
            // console.log("spec_sku_id", spec_sku_id);
            // console.log("skuItem", skuItem);
            // 更新商品价格、划线价、库存
            if (typeof skuItem === 'object') {
                this.skuItem = skuItem
                this.setData({
                    goods_sku_id: skuItem.spec_sku_id,
                    goods_price: this.groupsType ? skuItem.groups_price : skuItem.goods_price,
                    line_price: skuItem.line_price,
                    stock_num: !!group_id ? skuItem.groups_stock : skuItem.stock_num,
                    image_path: skuItem.image && skuItem.image.file_path ? skuItem.image.file_path : this.goodsDetail.image[0].file_path,
                    goods_num: 1,
                    sku_coupon_price: skuItem.coupon_price
                })
            } else if (skuItem === undefined || skuItem === '') {
                let useSkuItem = this.skuItem ? this.skuItem : spec_list[0]
                if (!!group_id) {
                    this.goods_price = this.groupBuyType === '2' ? useSkuItem.groups_price : useSkuItem.goods_price
                    this.stock_num = useSkuItem.groups_stock
                } else {
                    this.goods_price = spec_list[0].goods_price
                    this.stock_num = spec_list[0].stock_num
                }
            }
        },

        /**
			 * 增加商品数量
			 */
        up() {
            let {
                stock_num,
                limit_buy, // 用户限购数量
                surplus_quantity // 用户可购数量
            } = this
            if (limit_buy === 10 && (this.goods_num >= surplus_quantity)) {
                uni.showToast({
                    icon: 'none',
                    title: surplus_quantity === 0 ? '购买数量已达上限' : `您最多可购买${surplus_quantity}件商品`
                })
                return
            }
            if (this.goods_num < stock_num) {
                ++this.goods_num
            }
        },

        /**
			 * 减少商品数量
			 */
        down() {
            if (this.goods_num > 1) {
                --this.goods_num
            }
        },
        /**
			 * 按钮操作
			 */
        btnClick(btnType) {
            console.log('btnClick', btnType)
            if (!!this.buy_tip) {
                this.showBuytips = true
                this.btnType = btnType
            } else {
                this.btnSubmit(btnType)
                // 关闭后重置规格数据
                if (this.goodsDetail.spec_type == 20 && this.goodsDetail.is_meal != 1) {
                    this.showBuyMenu = !this.showBuyMenu
                }
                // console.log(this.goodsDetail,'-----------------------------this.goodsDetail')
                // this.goodsDetail.spec_type !== 20 ||   (this.showBuyMenu = !this.showBuyMenu) ;
            }
        },
        tipsKnow() {
            this.showBuytips = false
            this.btnSubmit(this.btnType)
        },
        btnSubmit(btnType) {
            let {
                goods_num,
                goods_sku_id,
				goods_price
            } = this
            console.log('btnSubmit', this.pGoodSkuId, goods_sku_id)
            this.$emit('submit', {
                btnType,
                goods_num,
				goods_price,
                goods_sku_id: goods_sku_id || this.pGoodSkuId
            })
        },
        initProps() {
            this.setData({
                disabledTally: false,
                hideStock: false
            })
        },
        /**
			 * 活动购买菜单重置
			 */
        activeBuyMeuns(showBuyMenu) {

            let _this = this,
                {
                    groupBuyType,
                    specData,
                    goodsActivity: {
                        group_id,
                        spike_id
                    },
                    goodsDetail: {
                        spec_type
                    }
                } = _this,
                disabledSignid = _this.goodsDetail.sku.filter(val => !val.is_use)
            // 重置禁用参数
            showBuyMenu && this.initProps()
            // 不参与拼团活动的规格项
            if (disabledSignid.length > 0) {
                disabledSignid = disabledSignid.map(val => val.spec_sku_id)
            }
            (showBuyMenu && spec_type === 20) && this.updateSpecGoods()
            if (!this.specDisabled) {
                return
            }
            if (Array.isArray(specData) && specData.length > 0) {
                specData = specData.map((specItem, specIndex) => {
                    specItem.spec_item_list = specItem.spec_item_list.map((val, index) => {
                        if (specData.length === 1) {
                            val.disabled = disabledSignid.length > 0 ? disabledSignid.includes(val.signid) : false
                        } else {
                            val.disabled = false
                        }
                        if (showBuyMenu) { // 开
                            val.checked = false
                        } else { // 关
                            val.checked = false
                        }
                        _this.goods_spec_arr.splice(specIndex, 1, '')
                        return val
                    })
                    return specItem
                })
                this.specData = specData
            }
        },
        /**
			 * 购买菜单显示隐藏
			 */
        onToggleTrade(btnClickType = 'confirm') {
            console.log('btnType----------我回来了弹窗里面', btnClickType)
            let {
                goodsDetail: {
                    spec_type,
                    is_meal
                },
                goodsActivity: {
                    group_id,
                    spike_id
                },
                hasGroups, // 是否存在拼团
                isMaxBuyLimit, // 是否达到购买上线
                isShowJoinGroups, // 是否显示参团列表
                groupBuyType // 团购商品购买类型
            } = this

            console.log('btnClickType', btnClickType, !!btnClickType ? btnClickType : 'confirm')
            this.btnType = !!btnClickType ? btnClickType : 'confirm'
            if (spec_type === 20 && is_meal != 1) {
                // if (spec_type === 20 ) {
                // 关闭后重置规格数据
                this.showBuyMenu = !this.showBuyMenu
                this.activeBuyMeuns(!this.showBuyMenu)
            } else {
                if (!!group_id || !!spike_id) {
                    if (hasGroups) {
                        if (!isMaxBuyLimit && isShowJoinGroups && groupBuyType === '2') {
                            btnClickType = 'joinGroups'
                        } else {
                            btnClickType = groupBuyType === '1' ? 'confirm' : 'groups'
                        }
                    }
                }
                this.btnClick(this.btnType)
            }

        }
    }
}
</script>

<style lang="scss">
	/* 购买菜单 */
	.goods-buy-menu {
		width: 100vw;
		height: 65vh;
		background: #FFFFFF;
		border-radius: 12upx 12upx 0 0;
		position: relative;
	}

	.goods-buy-menu .icon-roundclose {
		position: absolute;
		top: 20upx;
		right: 20upx;
		font-size: 42upx;
		height: 1em;
		width: 1em;
		color: #999999;
	}

	.trade-main {
		padding: 20upx;
	}

	.buy-info .buy-images image {
		width: 180upx;
		height: 180upx;
		display: block;
		border-radius: 12upx;
	}

	.buy-content {
		margin-left: 30upx;
		font-size: 24upx;
	}

	.buy-money {
		font-size: 40upx;
		color: #fe504f;
	}

	.buy-money text {
		font-size: 24upx;
	}

	.buy-stock {
		// margin-top: 20upx;
		color: #999999;
	}

	.buy-spec {
		// margin-top: 24upx;
		margin-top: 12upx;
	}

	.buy-spec-list {
		margin-top: 30upx;
		height: calc(65vh - 336upx);
		box-sizing: border-box;
		padding-bottom: 200rpx;
	}

	.buy-spec-item:last-child {
		padding-bottom: 160upx;
		/* padding-bottom: 30upx; */
	}

	.spec-item-title {
		font-size: 28upx;
		line-height: 2em;
		margin-top: 12upx;
	}

	.spec-items {
		flex-wrap: wrap;
	}

	.spec-items .spec-item {
		font-size: 26upx;
		/* white-space: nowrap; */
		background: #F5F5F5;
		padding: 12upx 20upx;
		border-radius: 12upx;
		color: #333;
		margin: 20upx 20upx 0 0;
		border: 1upx solid transparent;
	}

	.spec-items .spec-item.active {
		// background: rgba(254, 80, 78, .3);
		// color: #FE504F;
		// border: 1upx solid #FE504F;
		// background: rgba(254, 80, 78, 0.3);
		background: #ffffff;
		color: #FE504F;
		color: var(--help-color);
		border: 1rpx solid #FE504F;
		border: 1rpx solid var(--help-color);

	}

	.spec-items .spec-item.disabled {
		background: rgb(245, 245, 245);
		color: rgb(208, 208, 208);
	}

	.buy-number {
		margin: 20upx 0;
	}

	.buy-button-box {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 140upx;
		background: #FFFFFF;
	}

	.buy-button-box .buy-button {
		color: #FFFFFF;
		border-radius: 50upx;
		width: 90%;
		margin: 16upx 5% 0;
		background: #FE504F;
		background: var(--help-color);
		font-size: 28upx;
		line-height: 2.8em;
	}

	.buy-button-box .buy-button.join-btn {
		background: #FFD940;
		background: var(--theme-color);
		color: #333333;
		color:var(--auxiliary-color)
	}

	.member-price-label {
		color: #333333;
		height: 0;
		line-height: 30upx;
		border-width: 0upx 10upx 30upx 0;
		border-style: none solid solid;
		border-color: transparent #000 #efd68f;
		position: relative;
		left: 10upx;
		padding-left: 6upx;
		border-radius: 4upx 0 0 4upx;
		margin-left: -10upx;
	}

	.member-coupon-price {
		color: #efd68f;
	}

	.coupon-price-2 {
		padding: 0 10upx;
		height: 30upx;
		line-height: 30upx;
		border-radius: 0 4upx 4upx 0;
	}

	.member-coupon-view {
		position: relative;
		margin-left: 12upx;
		top: -6rpx;

	}

	/* 购买提现 */
	.buy-tips {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 210;
		background: rgba(0, 0, 0, .5);
	}

	.tips-contnet {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 70vw;
		min-height: 600rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.tips-title {
		position: relative;
		height: 140rpx;
		z-index: 1;
	}

	.tips-title::before {
		content: "购买提醒";
		color: #FFFFFF;
		font-size: 32rpx;
		text-align: center;
		line-height: 140rpx;
		position: absolute;
		top: 0;
		left: -10%;
		right: -10%;
		bottom: 0;
		background: #FE504F;
		background: var(--help-color);
		border-radius: 0 0 50% 50%;
	}

	.tips-text {
		display: inline-block;
		padding: 30rpx;
		min-height: 340rpx;
		width: 100%;
		box-sizing: border-box;
		word-break: break-all;
	}

	.tips-btn {
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 50px;
		margin-top: 20rpx;
		margin: 20rpx 30rpx;
		background: #FE504F;
	}
</style>

<style lang="scss" scoped>
	.sku-rebate {
		position: relative;
		top: -6rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 32rpx;
		margin-left: 20rpx;
		font-size: 20rpx;
		color: #FF4444;
		border: 1px solid #FF4444;
		border-radius: 4rpx;
		line-height: 1;
	}
	.sku-rebate__prefix {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		border-radius: 0 4rpx 4rpx 0;
		width: 30rpx;
		height: 100%;
		background-color: #FF4444;
	}
	.sku-rebate__price {
		padding: 0 6rpx;
	}
</style>
