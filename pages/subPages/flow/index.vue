<template>
	<view :style="themeColor">
		<page-nav-bar @navItemClick="expressType" :nav-list="navList" :default_check="default_check" :current="dataType"
		 fixed="1" v-if="navList.length>0"></page-nav-bar>
		 <!-- margin: 100rpx 30rpx 206rpx; -->
		 <!-- <view class="">{{JSON.stringify(navList)}}</view> -->
		<view class="container">
			<block v-if="goods_list.length > 0 && goods_list[0]['goods_list'].length > 0">
				<view class="list-edit dis-flex flex-x-between flex-y-center">
					<view class="col-9 f-26">共{{order_total_num}}件商品</view>
					<view class="cart-change f-28 col-9" @click="switchAction">{{action === 'complete'?"编辑":"完成"}}</view>
				</view>
				<view class="cart-goods-list">
					<view class="cart-item b-f" v-for="(storeItem,storeIndex) in goods_list" :key="storeItem.id">
						<label class="goods-store dis-flex flex-y-center">
							<!-- 店铺全选 -->
							<radio value="" style="zoom: .7;width: 60rpx;height: 40rpx;line-height: 40rpx;" :color="topColor"
							 @click="itemSelectAll(storeIndex,isSelectAll(storeItem.goods_list))"
							 :checked="isSelectAll(storeItem.goods_list)" />
							<!-- 进入商家页面 -->
							<view class="col-3 f-26 m-left12 onelist-hidden" @click.stop="toBusiness(storeItem.id)">{{storeItem.name?storeItem.name:"全选"}}</view>
						</label>
						<view class="goods-list" v-for="(goods,gIndex) in storeItem.goods_list" :key="goods.goods_id">
							<view class="goods-item dis-flex flex-y-center">
								<!-- 选择框选中 -->
								<radio value="" style="zoom: .7;width: 60rpx;height: 40rpx;line-height: 40rpx;" :color="topColor" 
								@click="radioChecked(storeIndex,gIndex)"
								 :checked="goods.checked" />
								<view class="goods-detail dis-flex flex-y-center m-left12">
									<image :src="goods.image && goods.image[0] && goods.image[0].file_path" class="goods-image"></image>
									<view class="goods-info dis-flex flex-dir-column flex-x-between flex-box">
										<view class="goods-title f-28 col-3 twolist-hidden">{{goods.goods_name}}</view>
										<view class="col-9 f-26 twolist-hidden" v-if="goods.spec_type === 20">
											规格：{{goods.goods_sku && goods.goods_sku.goods_attr}}</view>
										<view class="dis-flex flex-x-between flex-y-center">
											<view class="price-font-family col-m f-28 dis-flex flex-y-line">
												{{settingData.currency}}{{goods.goods_price}}
												<!-- <text class="m-left12 t-through col-9 f-24">{{settingData.currency}}75.00</text> -->
											</view>
											<view class="goods-num dis-flex flex-x-between flex-y-center f-24 b-f">
												<view class="num-btns-box dis-flex flex-y-center">
													<view class="num-btn iconfont icon-move f-w " :class="{disabled:goods.total_num===1}" 
													@click="countChange('sub',storeIndex,gIndex)"></view>
													<view class="num-btn">{{goods.total_num}}</view>
													<view class="num-btn iconfont icon-add  f-w" :class="{disabled:goods.total_num>=goods.goods_sku.stock_num}"
													 @click="countChange('add',storeIndex,gIndex)"></view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<block v-else>
				<view class="no-data">
					<Abnor :abnor="'GOODS'" :title="'亲，购物车还没有商品哦'"></Abnor>
					<view @click="goShopping" class="flow-btn-min">去购物</view>
				</view>
			</block>
			<recommend-goods :isShowCopyRight="false"></recommend-goods>
		</view>
		<view>
			<view class="footer-bottom dis-flex flex-y-center b-f" :class="{'footer-bottom-ipx':isIphoneX}" :style="!cart()?'bottom:0':''">
				<view class="flex-box dis-flex flex-y-center flex-x-between">
					<view class="dis-flex flex-y-center">
						<radio value="" style="zoom: .7;width: 60rpx;height: 40rpx;line-height: 40rpx;" :color="topColor" :checked="isCheckedAll"
						 @click="isCheckedAll = !isCheckedAll" />
						<view class="col-3 f-28 m-left12">全选</view>
					</view>
					<view class="f-34 col-3" v-if="action === 'complete'">合计：<text class="col-m price-font-family">{{settingData.currency}}{{cartTotalPrice}}</text></view>
				</view>
				<view class="footer-btn f-30 help-bg-color auxiliary-color" :class="{'disabled':checkedGoodsNum === 0}" v-if="action === 'complete'" @click="submit">{{`结算(${checkedGoodsNum})`}}</view>
				<view class="footer-btn f-30 help-bg-color auxiliary-color" v-if="action === 'edit'" @click="deleteHandle">删除</view>
			</view>
			<DiyTab :cNum="cartTotal"></DiyTab>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import PageNavBar from "@/components/template/PageNavBar2.vue"
	import RecommendGoods from "@/components/template/RecommendGoods.vue"
	import DiyTab from "@/components/template/TabBar.vue"
	import Abnor from "@/components/template/Abnor.vue"
	export default {
		data() {
			return {
				goods_list: [], // 商品列表
				order_total_num: 0,
				// 商品总金额
				order_total_price: 0,
				action: 'complete',
				checkedAll: false,
				cartTotal: 0,
				// 商品总价格
				// cartTotalPrice: '0.00',
				type: "20",
				navList: [],
				cart_num: [0, 0, 0],
				stock_num: "",
				default_check: "",
				dataType:""
			};
		},
		components: {
			DiyTab,
			PageNavBar,
			RecommendGoods,
			Abnor
		},
		computed: {
			// cgp() {
			// 	let appSetting = this.$store.state.appSetting;
			// 	return appSetting.cgp.open;
			// },
			isSelectAll() {
				return goods => {
					let checkedNum = goods.filter(val => val.checked).length;
					return checkedNum === goods.length;
				}
			},
			checkedGoodsNum() {
				let checkedNum = 0;
				if (this.goods_list.length > 0) {
					this.goods_list.map(store => {
						store.goods_list.map(goods => {
							if (goods.checked) {
								checkedNum++;
							}
						})
					})
				}
				return checkedNum;
			},
			cartTotalPrice() {
				
				let goods_list = this.goods_list,
					cartTotalPrice = 0;
				goods_list.map(store => {
					store.goods_list.map(goods => {
						if (goods.checked) {
							cartTotalPrice += Number(goods.total_price);
						}
					})
				});
				return cartTotalPrice.toFixed(2)
			},
			isCheckedAll: {
				get() {
					let goodsCount = 0,
						checkedNumber = 0;
					this.goods_list.map(store => {
						store.goods_list.map(goods => {
							goodsCount++;
							if (goods.checked) {
								checkedNumber++;
							}
						})
					});
					return goodsCount === checkedNumber;
				},
				set(newValue) {
					let goods_list = this.goods_list;
					goods_list.map(store => {
						store.goods_list.map(goods => {
							goods.checked = newValue;
						})
					});
					this.goods_list.splice(0, goods_list.length, ...goods_list);
				}
			},
			getTabBar(){
				return this.$store.getters.getTabBar
			}
		},
		watch: {
			navList(val) {
				console.log('navList123456navList123456',val)
			}
		},
		onLoad() {
			App.showLoading()
			
		},
		onShow() {
			this.$nextTick(()=>{
				this.getDefaultCheck()
				this.set()
				
			})
			App.customDefaultShare(this.globalSaveRefereeId,`${App.siteInfo.siteroot}h5/#/pages/subPages/flow/index`)
		},
		mounted() {

		},
		methods: {
			set(){
				App._get("setting/index", {},res=> {
					this.cgp = res.data.cgp.open
				})
			},
			cart(tabType = 'cart') {
				// this.$store.dispatch("getTabBarData")
				// 不存在底部菜单
				
				let navList = this.getTabBar.checkList,
					res_a = false;
					console.log(this.getTabBar.checkList,'navList===================')
				// 存在底部菜单
				if (navList) {
					navList.map(nav => {
						tabType === nav.name && (res_a = true)
					});
				}
				
				return res_a ;
			},
			getDefaultCheck() { 
				console.log('aaaa', this.cart());
				App._get('cart/defaultCheck', {}, (result) => {
					if (result.code === 1) {
						let _this = this;
						let id = _this.navList.filter(item => {
							if(item.id == result.data.default_check) {
								return item.id
							}
						})
						console.log(id,'id================')
						console.log(_this.navList,'_this.navList')
						console.log('aaa',!!_this.default_check ? _this.type : (id.length? result.data.default_check :_this.navList[0]));
						this.getCartList(!!_this.default_check ? _this.type : result.data.default_check);
						_this.setData({
							type: !!this.default_check ? this.type : result.data.default_check,
							// type:this.type=10,
							default_check: result.data.default_check,
						});
					}
				})
			},
			/**
			 * 获取购物车列表
			 */
			getCartList(type) {
				let _this = this;
				App._get('cart/lists', {
					type
				}, (result) => {
					let {
						goods_list: store_list,
						order_total_price,
						self_state,
						express_state,
						stock_num,
						cart_num: cart_num,
						default_check: default_check,
						cart_open,
					} = result.data
					if (cart_open !== '1') {
						App.showError('请联系管理员开启购物车', () => {
							uni.reLaunch({
								url: '/pages/mainPages/index/index'
							});
						})
					}
					if (store_list && store_list.length) {
						store_list.map(store => {
							store.goods_list.map(goods => {
								goods.checked = false;
							})
						})
					}
					_this.navShow(self_state, express_state, cart_num);
					_this.setData(result.data);
					App.hideLoading(1000); //努力加载更多关闭
				});
			},
			navShow(self_state, express_state, cartNum) {
				let _this = this;
				_this.cartTotal = 0;
				_this.navList = [];
				
				if (cartNum[0] > 0 && !this.cgp) {
					_this.navList.push({
						id: "70",
						title: "门店核销",
						num: cartNum[0],
					});
					// _this.cartTotal+=cartNum[0]
					_this.cartTotal = Number(_this.cartTotal) + Number(cartNum[0])
				}
				
				if (self_state === '1' && cartNum[1] > 0 && !this.cgp) {
					//开启自提
					_this.navList.push({
						id: "30",
						title: "门店自提",
						num: cartNum[1],
					})
					_this.cartTotal = Number(_this.cartTotal) + Number(cartNum[1])
				}
				
				if (express_state === '10' && cartNum[2] > 0 && !this.cgp) {
					//开启快递
					_this.navList.push({
						id: "20",
						title: "物流快递",
						num: cartNum[2],
					})
					_this.cartTotal = Number(_this.cartTotal) + Number(cartNum[2])
				}
				if(cartNum[3]>0) {
					_this.navList.push({
						id: "50",
						title: "同城配送",
						num: cartNum[3],
					});
				}
				console.log(_this.navList,'=======================_this.navList')

			},
			/**
			 * 收货方式切换
			 */
			expressType(e) {
				let {
					id: type
				} = e;
				this.type = type;
				this.getCartList(type);

			},

			/**
			 * 进入商家详情
			 */
			toBusiness(bus_id) {
				App.navigationTo({
					url: `pages/subPages/store/index?bus_id=${bus_id}`
				})
			},

			/**
			 * 选择框选中
			 */
			radioChecked(storeIndex, gIndex) {
				let storeData = this.goods_list[storeIndex],
					goodsData = storeData.goods_list[gIndex],
					checked = goodsData.checked;
				console.log("storeData", storeData)
				this.$set(goodsData, "checked", !checked);
			},

			/**
			 * 店铺商品全选
			 */
			itemSelectAll(storeIndex, checked) {
				let goods_list = this.goods_list[storeIndex].goods_list.map(val => {
					val.checked = !checked;
					return val;
				});
				this.goods_list[storeIndex].goods_list.splice(0, goods_list.length, ...goods_list);
			},
			/**
			 * 选择框全选
			 */
			radioCheckedAll(e) {
				// console.log(e)
				let _this = this,
					goodsList = this.goods_list;
				goodsList.forEach(function(item) {
					item.checked = !_this.checkedAll;
				});
				_this.setData({
					goods_list: goodsList,
					checkedAll: !_this.checkedAll
				});
			},

			/**
			 * 切换编辑/完成
			 */
			switchAction() {
				console.log(this.action === "complete");
				this.action = this.action === "complete" ? "edit" : "complete";
			},

			/**
			 * 删除商品
			 */
			deleteHandle() {
				let _this = this,
					cartIds = _this.getCheckedIds();
				if (!cartIds.length) {
					App.showError('您还没有选择商品');
					return false;
				}
				console.log("cartIds", cartIds);
				uni.showModal({
					title: "温馨提示",
					content: "您确定要移除选择的商品吗?",
					success(e) {
						e.confirm && App._post_form('cart/delete', {
							cart_key: cartIds
						}, function(result) {
							// 获取购物车列表
							_this.getCartList(_this.type);
						});
					}
				});
			},

			/**
			 * 获取已选中的商品
			 */
			getCheckedIds() {
				let arrIds = [];
				this.goods_list.map(store => {
					store.goods_list.map(goods => {
						if (goods.checked) {
							arrIds.push(goods.goods_id + '_' + goods.goods_sku_id);
						}
					})
				})
				return arrIds;
			},
			/**
			 * 商品数量修改
			 */
			countChange(changeType, sIndex, gIndex) {
				let _this = this;
				let goods = this.goods_list[sIndex].goods_list[gIndex],
					{
						total_num,
						goods_price,
						goods_id,
						goods_sku_id,
					} = goods;
				let stock_num = goods.goods_sku.stock_num;
				console.log('goods',goods)
				// let index = (goods.transport_type == "20") ? 2 :(goods.transport_type == "10" ? 0:1);
				let index = [];
				if (goods.transport_type == '10' || goods.transport_type == '30') {
					//核销
					index = [10];
				} else if (goods.transport_type == '20') {
					//快递或者自提
					if (goods.iszt == 1) {
						//有自提
						index = [30];
					}
					if (goods.isexpress == 1) {
						//有物流
						index.push(20);
					}
					if(goods.run_errands == 1) {
						// 有同城配送
						index.push(50);
					}
				}
				if (changeType === "sub") {
					if (total_num === 1) {
						return
					}
					total_num--;
					index.map(key => {
						this.navList.map(items => {
							if (items.id == key) {
								this.cartTotal--;
								items.num--;
							}
						})
					})
				} else {
					if (total_num >= stock_num) {
						return
					}
					total_num++;
					index.map(key => {
						this.navList.map(items => {
							if (items.id == key) {
								this.cartTotal++;
								items.num++;
							}
						})
					})
				}
				uni.showLoading({
					title: "加载中..."
				})
				// goods.total_num = total_num;
				// goods.total_price = Number(goods_price) * total_num;
				// this.goods_list[sIndex].goods_list.splice(gIndex, 1, goods);
				App._post_form(`cart/${changeType}`, {
					goods_id: goods_id,
					goods_num: 1,
					goods_sku_id: goods_sku_id,
				}, (res) => {
					const {code} = res
					if(code ==1) {
						goods.total_num = total_num;
						goods.total_price = Number(goods_price) * total_num;
						this.goods_list[sIndex].goods_list.splice(gIndex, 1, goods);
					}
					uni.hideLoading();
				});
			},

			/**
			 * 购物车结算
			 */
			submit() {
				console.log('this.type', this.type);
				let cartIds = this.getCheckedIds(),
					goodsList = this.goods_list,
					is_member_price = 2,
					params = {
						//type: 10门店核销 20物流快递 30门店自提 50同城配送
						// transport_type: this.type == "20" ? "20" : 10, 
						transport_type:this.cgp?40:( ['20','50'].includes(''+this.type) ? 20 : 10),
						cart_indexes: JSON.stringify(cartIds),
						isCart: "1",
						is_express: ['20'].includes(''+this.type) ? 1 : 0,
						is_zt: this.type == '30' ? 1 : 0,
						is_city: ['50'].includes(''+this.type) ? 1: 0,
						order_type: "1"
					};
				console.log("params", params)
				if (!cartIds.length) {
					App.showError('您还没有选择商品');
					return false;
				}
				goodsList.map(store => {
					store.goods_list.map(goods => {
						if (goods.is_member_price === 1 && goods.checked) {
							is_member_price = 1;
						}
					})
				})
				params.goods_type = is_member_price === 1 ? "member_goods" : "";
				App.navigationTo({
					url: `pages/subPages/flow/checkout?${App.urlEncode(params)}`
				});
			},

			/**
			 * 去购物
			 */
			goShopping() {
				App.navigationTo({
					url: "pages/mainPages/index/index",
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container-bz{
		margin: 0rpx 30rpx 206rpx;
		padding-top: 20rpx;
	}
	.container {
		margin: 100rpx 30rpx 320rpx;
		margin-top: 0;
		padding-top: 20rpx;
		overflow: hidden;
		box-sizing: border-box;

		.cart-goods-list {
			margin-bottom: 20rpx;
		}

		.cart-change {
			width: 100rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			border-radius: 50rpx;
			border: 1rpx solid #999;
			margin-bottom: 20rpx;
		}

		.cart-item {
			padding: 0 30rpx 20rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			margin-bottom: 10px;

			.goods-store {
				height: 72rpx;
				border-bottom: 1rpx solid #EEEEEE;

				.col-3 {
					height: 40rpx;
					line-height: 40rpx;
				}
			}

			.goods-list {
				padding-top: 20rpx;

				.goods-item {
					.goods-info {
						height: 170rpx;
					}

					.goods-detail {
						flex: 1;

						.goods-image {
							width: 170rpx;
							min-width: 170rpx;
							height: 170rpx;
							display: block;
							margin-right: 20rpx;
							border-radius: 10rpx;
						}

						.goods-num {
							border-radius: 10rpx;

							.num-btn {
								width: 50rpx;
								height: 50rpx;
								line-height: 50rpx;
								margin: 0 4rpx;
								background: #F8F8F8;
								text-align: center;
								font-size: 24rpx;

								&.disabled {
									color: #999999;
								}
							}
						}
					}

				}
			}
		}

		.no-data {
			/deep/ .abnor {
				padding-bottom: 60%;
			}

			.flow-btn-min {
				background: #fff;
				border: 1upx solid #ccc;
				height: 30px;
				line-height: 30px;
				font-size: 28rpx;
				width: 200rpx;
				margin: 0 auto;
				border-radius: 5px;
				text-align: center;
				color: #777;
				margin-bottom: 50rpx;
			}
		}
	}

	.footer-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 96rpx;
		z-index: 10;
		height: 100rpx;
		line-height: 100rpx;
		border-top: 1rpx solid #EEEEEE;

		&.footer-bottom-ipx {
			bottom: calc(96rpx + 20px);
		}

		.flex-box {
			padding: 0 30rpx;
		}

		.footer-btn {
			width: 235rpx;
			text-align: center;
			height: 100rpx;
			color: #FFFFFF;
			background-color: #FE504F;

			&.disabled {
				color: #333333;
				background-color: #DDDDDD;
			}
		}
	}
</style>
