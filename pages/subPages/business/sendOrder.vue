<template>
	<view :style="themeColor">
		<lead-attention></lead-attention>
		<view class="container p-bottom" v-if="order.order_id">
			<view class="bor-10">
				<!-- 物流收货 -->
				<view class="flow-checkout-header b-f dis-flex flex-y-center p-r" v-if="!!order.address && order.express_type === 1">
					<view class="iconfont icon-location f-48"></view>
					<view class="flow-header-left padding-box">
						<view class="flow-checkout-admin f-28 col-3">{{order.address.name}} {{order.address.phone}}</view>
						<view class="flow-checkout-address f-26">
							{{order.address.region.province}} {{order.address.region.city}} {{order.address.region.region}}
							{{order.address.detail}}
						</view>
					</view>
					<view class="address-copy" @click="copyContent(addressCopyText,'text')">复制信息</view>
				</view>
				
				<image src="/static/images/order/address_line.png" class="address-line"></image>
				
			</view>
		

			

			<!-- 商品详情 -->
			<view class="padding-box b-f bor-10 m-top20">
				<view @click="goodsDetail" class="b-f" :data-id="item.goods_id" v-for="(item, key) in order.goods" :key="key">
					<list-goods-item :goods-data="item" :group-number="order.groups_group_id > 0? order.group_number : -1 " :refund="item.refund_status"
					 :goodscard="order.is_rebate === 1 && order.goods[0]['goods']['is_member_price']===1? 1:0"></list-goods-item>
				</view>
			</view>

			<!-- 订单金额 -->
			<view class="flow-all-money b-f padding-box m-top20 price-font-family bor-10">
				<view class="dis-flex flow-all-list-cont">
					<text class="flex-five col-3 f-26">商品金额:</text>
					<text class="flex-five t-r col-m">{{settingData.currency}}{{order.total_price}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.integral_rebate_money > 0">
					<text class="flex-five col-3 f-26">{{balanceSetting.integral_str}}抵扣:</text>
					<text class="flex-five t-r col-m">-{{settingData.currency}}{{order.integral_rebate_money}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.groups_group_id > 0 && order.commander_discount > 0">
					<text class="flex-five col-3 f-26">团长优惠:</text>
					<text class="flex-five t-r col-m">-{{settingData.currency}}{{order.commander_discount}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.member_coupon_price > 0">
					<text class="flex-five col-3 f-26">会员优惠:</text>
					<text class="flex-five t-r col-m">-{{settingData.currency}}{{order.member_coupon_price}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.coupon_price > 0">
					<text class="flex-five col-3 f-26">{{appCoupon.coupon_title}}抵扣:</text>
					<text class="flex-five t-r col-m">-{{settingData.currency}}{{order.coupon_price}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.express_price > 0">
					<text class="flex-five col-3 f-26">配送费用:</text>
					<text class="flex-five t-r col-m">+{{settingData.currency}}{{order.express_price}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.is_rebate === 1 && order.card_price ">
					<text class="flex-five col-3 f-26">会员卡费用:</text>
					<text class="flex-five t-r col-m">+{{settingData.currency}}{{order.card_price}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.update_price.value != '0.00'">
					<text class="flex-five col-3 f-26">后台改价:</text>
					<text class="flex-five t-r col-m">{{order.update_price.symbol}}{{settingData.currency}}{{order.update_price.value}}</text>
				</view>
			</view>

			<view class="select b-f">
				<view class="flow-num-box b-f border-line border-top select-flow-num-box">
					<text>实付: </text>
					<text class="flow-money col-m price-font-family">{{settingData.currency}}{{order.pay_price}}</text>
				</view>
			</view>

			<view class="order-info module-content m-top20 bor-10" style="padding-top: 0;padding-bottom: 0;">
				
				
				<view class="f-28 col-3 m-top20">
					<view class="dis-flex flex-x-between flex-y-center item">
						<text>配送方式</text>
						<text>物流配送</text>
					</view>
					<view class="dis-flex flex-x-between flex-y-center item">
						<text>物流公司</text>
						<view class="">
							<picker mode="selector" :range="companyData" @change="companyChange">
								<view :class="{'col-9':!express_company,'col-3':express_company}">{{express_company?express_company:'请选择物流公司 >'}}</view>
							</picker>
						</view>
					</view>
					
					<view class="dis-flex flex-x-between flex-y-center item" v-if="express_company=='京东快递'">
						<text>京东青龙编码</text>
						<input type="text" class="t-r col-3 f-28"  v-model="customerName" placeholder="请填写京东青龙编码" placeholder-class="col-9 f-28 t-r"/>
					</view>
					
					<view class="dis-flex flex-x-between flex-y-center item" style="border-bottom: none;">
						<text>物流编号</text>
						<input type="text" class="t-r col-3 f-28" v-model="express_no"  placeholder="请填写" placeholder-class="col-9 f-28 t-r"/>
					</view>
					
				</view>
			</view>
			
			<view class="main-bg-color auxiliary-color btn dis-flex flex-x-center flex-y-center m-top20" @click="sendOrder">
				确认发货
			</view>

			
		</view>
		

		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import ListGoodsItem from "@/components/template/ListGoodsItem.vue"
	import LeadAttention from "@/components/template/LeadAttention.vue"
	import PopupView from "@/components/template/PopManager.vue"
	import Parse from "@/components/threeComponents/jyf-Parser/index"
	import StoreNav from "@/components/template/StoreNav.vue"
	import App from "@/common/js/app.js"
	// import util from "@/common/js/util.js"
	let timer = null;
	export default {
		data() {
			return {
				order_id: null,
				order: {},
				showPayList: false, //支付组件显示隐藏
				lastPayTime: 0,
				options: {},
				isShowBtns: true,
				remainingTime: "",
				showAll: false,
				showAllCode: false, //显示全部核销码
				payEndTime: null, //结束时间
				cardUseDesc: false, //使用说明显示
				isIos: "",
				companyData:[],
				express_company:'',
				customerName:'',
				express_no:''
			};
		},
		components: {
			ListGoodsItem,
			PopupView,
			Parse,
			StoreNav,
			LeadAttention
		},
		watch: {
		},
		computed: {
			balanceSetting() {
				return this.settingData.balance || {}
			},
			addressCopyText() {
				let {
					address: addressData
				} = this.order;
				if (!!addressData) {
					let {
						name,
						phone,
						detail,
						region: {
							province,
							city,
							region
						}
					} = addressData;
					return `${name} ${phone}\n${province} ${city} ${region} ${detail}`;
				}
			}
		},
		onLoad(options) {
			this.options = options;
			App.showLoading();
		},
		onShow() {
			this.getCompany()
			this.getOrderDetail(this.options);
		},
		onUnload() {
			clearTimeout(timer);
			uni.removeStorageSync('orderDetail');
		},
		methods: {
			/**
			 * 获取订单详情
			 */
			getOrderDetail({
				order_id,
				showType
			}) {
				let _this = this,
					systemInfo = uni.getSystemInfoSync().model,
					isIos = systemInfo.indexOf('iPhone') !== -1;
				_this.isIos = isIos;
				App._get('user.order/detail', {
					order_id
				}, function(result) {
					_this.order_id = result.data.order_id;
					console.log(result.data.create_time, result.data.createtime)
					result.data.create_time = result.data.createtime;
					if (showType && showType === "business") {
						_this.isShowBtns = false;
					} else {
						_this.isShowBtns = result.data.app_show_button.filter(val => val.value === 1).length > 0;
					}

					_this.order = result.data;
					
				},res=>{},res=>{
					App.hideLoading();
				});
			},

			/**
			 * 跳转到商品详情
			 */
			goodsDetail(e) {
				let goods_id = e.currentTarget.dataset.id;
				App.navigationTo({
					url: "pages/subPages/goods/index/index?goods_id=" + goods_id
				});
			},

			

			/**
			 * 复制文本
			 */
			copyContent(content, copyType) {
				if (copyType === "content") {
					content = content.map(val => `${val.key}:${val.value}`).join("\n");
				}
				App.copyTextHandle(content);
			},
			// 获取物流公司
			getCompany(){
				App._post_form('Address/getAddressList',{},res=>{
				   this.companyData = res.data || []
				})
			},
			// 切换物流公司
			companyChange(e){
				this.express_company = this.companyData[ e.detail.value]
			},
			sendOrder(){
				const {order_id,customerName,express_company,express_no} = this;
				if(!express_company){
					App.showError('请选择物流公司！')
					return
				}
				if(express_company && express_company =='京东快递' && !customerName){
					App.showError('请填写京东青龙编码！')
					return
				}
				if(!express_no){
					App.showError('请填写物流编号！')
					return
				}
				
				App._post_form('Order/orderSend',{order_id,customerName,express_company,express_no},res => {
					const {code,msg} = res;
					App[code==1?'showSuccess':'showError'](msg)
					setTimeout(res=>{
						code == 1 && uni.navigateBack()
					},500)
					
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 30rpx;
	}
	.bor-10{
		border-radius: 10rpx;
	}
	.flow-checkout-header {
		padding: 30rpx;
	}
    .btn {
	 height: 90rpx;
	 border-radius: 6rpx;
	}
	.address-copy {
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		border-radius: 4px;
		border: 1rpx solid #ccc;
		padding: 4rpx 16rpx;
		font-size: 24rpx;
		color: #555;
	}

	.info-item {
		margin-bottom: 24rpx;
	}
	.item {
		padding: 40rpx 0 ;
		border-bottom: 2rpx solid #EEEEEE;
	}

	.order-info .info-item:last-child {
		margin-bottom: 0;
	}

	.info-copy-btn {
		font-size: 22rpx;
		padding: 8rpx 16rpx;
		border-radius: 40rpx;
		border: 1rpx solid #EEEEEE;
		margin-left: 12rpx;
	}

	.address-line {
		height: 6rpx;
		width: 100vw;
		display: block;
	}

	.select-flow-num-box {
		border: none !important;
	}
</style>
