<template>
	<view class="container" :style="themeColor">
		<view style="height: 100rpx;padding: 20rpx;" class="dis-flex flex-x-center  flex-y-center">
			<view class="search-input dis-flex flex-x-center  flex-y-center">
				<text class="iconfont icon-search m-right12"></text>
				<input class="input" :focus="searchFocus" placeholder="搜索商品" v-model="searchValue" placeholderStyle="color:#aba9a9;font-size:12px;"
				 confirm-type="search" @confirm="search" type="text" />
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goodsList-main dis-flex">
			<view class="goodsList-left">
				<scroll-view class="scrollView" :scroll-y="true" :style="{height:scrollHeight}">
					<view class="goodsList-class-main ">
						<view class="class-item f-24 t-c twolist-hidden" :class="curOneClassId===classItem.category_id?'curselectClass':'col-8'"
						 v-for="(classItem,index) in cOneClassList" :key="index" @click="selectClassOneid(classItem,index)">{{classItem.name}}
						 <view v-if="classItem.badgeNum" class="class-item__badge">{{classItem.badgeNum}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="goodsList-right dis-flex flex-box p-r">
				<view class="scrollView">
					<view class="goods-twoClass-main dis-flex" v-if="!isfilterGoods">
						<scroll-view :scroll-x="true" class="scolltwoClass-main b-f">
							<view class="scolltwoClass dis-flex">
								<view class="scolltwoClass-item f-24 col-3 m-right20 t-c" :class="curtwoClassId===twoClassItem.category_id?'main-bg-color auxiliary-color':'curTwoClass'"
								 v-for="(twoClassItem,index) in twoClassList" :key="index" @click="selectClassTwoid(twoClassItem.category_id)">{{twoClassItem.name}}</view>
							</view>
						</scroll-view>
						<view class="goods-twoClass-icon t-c" @click="isfilter">
							<view class="iconfont icon-unfold f-24"></view>
						</view>
					</view>
					<view class="goods-twoSelectClass-main" v-if="isfilterGoods">
						<view class="pop-mask" :style="{height:scrollHeight}" @click="isfilter"></view>
						<view class="b-f twoSelectClass-list dis-flex">
							<view class="twoSelectClass-item t-c f-24 m-right12 col-6" @click="selectClassTwoid(twoClassItem.category_id)"
							 v-for="(twoClassItem,index) in twoClassList" :key="index" :class="curtwoClassId===twoClassItem.category_id?'main-bg-color auxiliary-color':'curTwoClass'">{{twoClassItem.name}}</view>
							<view class="goods-selectTwoClass-icon iconfont icon-fold f-24 t-c" @click="isfilter"></view>
						</view>
					</view>
					<scroll-view :scroll-y="true" :show-scrollbar='true' class="goodsScoll " :style="{height:goodsScrollHeight}"
					 @scrolltolower="goodsListMore" :scroll-anchoring="true" :scroll-top="scrollTop" @scroll="scrollyTop" @touchmove="handletouchmove"
					 @touchstart="handletouchstart" @touchend="handletouchend">
						<view class="goodsDetail-list-main m-left-right-30" v-if="goodsList.length>0">
							<view class="goodsDetail-list-item p-top-bom-30" v-for="(goodsDetailItem,index) in cGoodsList" :key="index"
							 @click="todetial(goodsDetailItem.goods_id)">
								<view class="dis-flex">
									<view class="goodsDetail-left m-right20" :style="{'background-image':'url('+goodsDetailItem['image'][0]['file_path']+')'}"></view>
									<view class="goodsDetail-right dis-flex flex-dir-column flex-x-between p-r flex-box">
										<view class="goodsDetail-title f-28 col-3 twolist-hidden">{{goodsDetailItem['goods_name']}}</view>
										<label-member-price v-if="goodsDetailItem.priceSaveVisible" containerStyle="margin-top: 8rpx;" :label="memberDiyFont.member_font"
										 :pricePrefix="memberDiyFont.discount_font" :priceStr="goodsDetailItem.priceSaveStr" />
										<view class="goodsPrice dis-flex flex-y-center">
											<view class="goodsNowPrice">
												<text class="f-24 col-f4">¥</text>
												<text class="f-36 col-f4">{{goodsDetailItem.sku[0].goods_price}}</text>
											</view>
											<view class="col-9 f-24 goodsOldPrice">¥{{goodsDetailItem.sku[0].line_price}}</view>
										</view>
										<view class="shoppIng-main">
											<view :style="{
												opacity: goodsDetailItem.is_sales == 1 ? 1 : 0
											}" class="col-9 f-24 t-r" style="margin-bottom: auto;">已售{{goodsDetailItem['goods_sales']}}件</view>
											<view v-if="goodsDetailItem.has_sale == 1" class="shoppIng-main_label-status is-disabled">已售罄</view>
											<view v-else-if="goodsDetailItem.cartNumVisible" class="p-r" @click.stop>
												<good-input-number :value="goodsDetailItem.cart_num" size="small" hideBtnReduceAtMin inputDisabled @input="handleGoodsNumChange($event,goodsDetailItem)" />
											</view>
											<view v-else-if="goodsDetailItem.sale_type" class="shoppIng-main_label-status">
												{{goodsDetailItem.sale_type==1?"秒杀中":goodsDetailItem.sale_type==2?'拼团中':goodsDetailItem.sale_type==3?"抽奖中":'砍价中'}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>

						<view v-if="!goodsList.length " :style="{width:'100%',height:'480rpx'}">
							<abnor :abnor="'GOODS'"></abnor>
						</view>
						<load-more :showLoadmore="!isMore" v-if="goodsList.length && !change"></load-more>
						<!-- <view class="t-c col-9 f-24 m-top30 m-btm30" v-if="isMore==false">
							{{tip}}
						</view> -->
						<view style="height: 300rpx;"></view>
					</scroll-view>

				</view>

			</view>
		</view>
		<diy-tab></diy-tab>
		<page-loading ref="loading"></page-loading>
		<!-- #ifdef H5 -->
		<FollowImgPopup v-if="settingData && settingData.qzgz" :visible="settingData.qzgz.indexOf('search') !== -1"></FollowImgPopup>
		<!-- #endif -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import abnor from '@/components/template/Abnor.vue'
	import loadMore from '@/components/template/Loadmore.vue'
	import LabelMemberPrice from './components/LabelMemberPrice.vue'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	import DiyTab from '@/components/template/TabBar.vue'
	import GoodInputNumber from './components/GoodInputNumber.vue'
	// #ifdef H5
	import FollowImgPopup from '@/components/page/pageComponents/FollowImgPopup.vue'
	// #endif

	export default {
		mixins: [pageShareMixin],
		components: {
			loadMore,
			abnor,
			LabelMemberPrice,
			DiyTab,
			GoodInputNumber,
			// #ifdef H5
			FollowImgPopup
			// #endif
		},
		data() {
			return { 
				change: false,
				tip: '上拉加载下一个分类',
				scrollHeight: '', // 滑动列表高度
				goodsScrollHeight: '', // 右边商品滑动高度
				isfilterGoods: false, // 是否打开筛选
				oneClassList: [], // 一级分类列表
				curOneClassId: '', // 当前一级分类Id
				twoClassList: [], // 二级分类列表
				curtwoClassId: '', // 当前二级分类Id
				current_page: 1, // 当前页数
				curTotal: '', // 总页数
				last_page: '',
				goodsList: [], // 商品列表
				isMore: true, // 商品是否下拉加载
				cartTotal: 0, // 购物车商品总数
				category_id: '', // 分类id,
				scrollTop: 0,
				searchValue: '', // 搜索文字
				flag: 0, // 1向左滑动,2向右滑动,3向上滑动 4向下滑动
				text: '', // 向哪里滑动
				lastX: 0,
				lastY: 0,
				index: 0,
				reg_id: '',
				// 已经加入购物车商品的接口数据
				cartRes: [],
				searchFocus: false
			}
		},
		computed: {
			// oneClassList
			cOneClassList() {
				return this.oneClassList.map(item => {
					// redude得到徽标数
					const badgeNum = (this.cartRes || []).reduce((total, cartGoods = {}) => {
						console.log('hahha11')
						if ((cartGoods.category || []).find(cartGoodsItem => cartGoodsItem.category_id == item.category_id)) {
							
							return total + cartGoods.total_num
						}
						return total
					}, 0)
					return {
						...item,
						badgeNum
					}
				})
			},
			// 格式化的商品列表数据 要从vuex里面取得购物车数据
			cGoodsList() {
				
				return this.goodsList.map(item => {
					const appSetting = this.$store.state.appSetting || {}
					const cartGoods = this.cartRes.find(cartItem => cartItem.goods_id == item.goods_id)
					const cartNumVisible = appSetting.share && appSetting.share.cart_open == '1' && item.sale_type == 0 && item.transport_type != 60 && item.spec_type == 10
					return {
						...item,
						cartGoods,
						// 购物车数量
						cart_num: cartGoods ? cartGoods.total_num : 0,
						// 是否显示加入购物车
						cartNumVisible,
						// 库存
						stock_num: this.$util.deepGet(item, 'sku.0.stock_num', 0),
						// 是否已售罄 0=未售罄1=已售罄
						has_sale: item.has_sale, 
						// 商品节省价格是否可见
						priceSaveVisible: this.$util.deepGet(item, 'sku.0.member_coupon_price', 0) > 0 && +item.is_member_price === 1,
						// 商品节省价格
						priceSaveStr: this.$util.deepGet(item, 'sku.0.member_coupon_price', 0)
					}
				})
			}
		},
		watch: {
			scrollTop: {
				handler(newData, oldData) {
					// console.log(newData, '==============newData')
				},
				immediate: true,
				deep: false
			},
			settingData: {
				handler(val) {
					console.log('哈哈哈哈哈哈哈哈', val)
					this.shareData = this.pageShareMixin_createShareData({
						title: this.$util.deepGet(val, 'cgp.share_title'),
						desc: this.$util.deepGet(val, 'cgp.share_text', ''),
						imgUrl: this.$util.deepGet(val, 'cgp.share_image', '')
					})
				},
				immediate: true
			}
		},
		onShow() {
			App.customDefaultShare(this.globalSaveRefereeId, `${App.siteInfo.siteroot}h5/#/pages/subPages/cgp/index/index`)
			this.fetchCartRes()
		},
		onLoad(options) {
			let getappSetting = this.$store.getters.getappSetting || {}
			let scene = App.getSceneData(options)
			this.reg_id = scene.reg_id ? scene.reg_id : options.reg_id
			let cgp = getappSetting.cgp
			// if (!!cgp && !cgp.open) {
			// 	console.log('跳转11111111111')
			// 	App.navigationTo({
			// 		url: 'pages/subPages/category/index',
			// 		redirectTo: true
			// 	});
			// 	return
			// }
			this.reg_id && this.bingLeader()
			App.showLoading()
			this.getScrollHeight()
			this.getClasslist()
			
		},
		mounted() {
			setTimeout(()=>{
				this.searchFocus = true
			},1000)
		},
		methods: {
			async fetchCartRes() {
				try{
					const res = await App._postP('cart/cartAll')
					this.cartRes = res.data || []
				}catch(e){
					console.log('fetchCartRes',e)
					//TODO handle the exception
				}
			},
			async handleGoodsNumChange(num,item) {
				console.log(num,item)
				if(num>item.cart_num) {
					this.doAdd({
						goods_id: item.goods_id,
						goods_num: num - item.cart_num,
						goods_sku_id: this.$util.deepGet(item,'sku.0.spec_sku_id')
					})
				}else if(num<item.cart_num) {
					this.doSub({
						goods_id: item.goods_id,
						goods_num: +item.cart_num - num,
						goods_sku_id: this.$util.deepGet(item,'sku.0.spec_sku_id')
					})
				}
			},
			async doAdd({
				goods_id,
				goods_num,
				goods_sku_id
			}={}) {
				uni.showLoading({
					mask: true,
					title: '请稍候'
				})
				try{
					await App._postP('cart/add',{
						goods_id,
						goods_num,
						goods_sku_id
					})
					await this.fetchCartRes()
					uni.hideLoading()
				}catch(e){
					//TODO handle the exception
				}
			},
			async doSub({
				goods_id,
				goods_num,
				goods_sku_id
			}={}) {
				uni.showLoading({
					mask: true,
					title: '请稍候'
				})
				try{
					await App._postP('cart/sub',{
						goods_id,
						goods_num,
						goods_sku_id
					})
					await this.fetchCartRes()
					uni.hideLoading()
				}catch(e){
					//TODO handle the exception
				}
			},
			bingLeader() {
				App._post_form('cgp.Reg/bindReg', {
					reg_id: this.reg_id
				}, res => {


				})
			},
			getScrollHeight() {
				let _this = this,
					SystemInfo = uni.getSystemInfoSync().windowHeight
				_this.scrollHeight = SystemInfo - 80 + 'px'
				_this.goodsScrollHeight = SystemInfo - 130 + 'px'
			},
			// 是否打开筛选
			isfilter() {
				this.isfilterGoods = !this.isfilterGoods
			},
			// 获取一级分类列表
			getClasslist() {
				let _this = this
				App._get('Category/getCateList', {
					fast: 1
				}, result => {
					if (result.code === 1) {
						// _this.getgoodsLists(result.data[ItemIndex]['category_id'])
						_this.setData({
							oneClassList: this.$util.deepGet(result, 'data', []),
							curOneClassId: this.$util.deepGet(result, 'data.0.category_id', ''),
							twoClassList: this.$util.deepGet(result, 'data.0.child', []),
							curtwoClassId: this.$util.deepGet(result, 'data.0.child.0.category_id', ''),
							category_id: this.$util.deepGet(result, 'data.0.child.0.category_id', '')
						})
						this.goodsList = []
						this.current_page = 1
						this.getgoodsLists()
					}
				})
			},
			// 选择一级分类
			selectClassOneid(item, index) {
				this.tip = '上拉加载下一个分类'
				this.current_page = 1
				this.searchValue = ''
				this.goodsList = []
				uni.showLoading()
				this.setData({
					curOneClassId: item.category_id,
					twoClassList: item.child,
					curtwoClassId: item.child[0].category_id,
					category_id: item.category_id,
					isfilterGoods: false,
					scrollTop: 0
				})
				this.goodsList = []
				this.current_page = 1
				this.getgoodsLists()
			},
			// 选择二级分类
			selectClassTwoid(curtwoClassId) {
				this.tip = '上拉加载下一个分类'
				this.current_page = 1
				this.searchValue = ''
				this.goodsList = []
				uni.showLoading()
				this.setData({
					curtwoClassId,
					category_id: curtwoClassId,
					scrollTop: 0
				})
				this.getgoodsLists()
			},
			// 获取商品列表
			getgoodsLists() {
				this.isMore = true
				let _this = this
				App._get('goods/fastGoodsLists', {
					page: this.current_page,
					category_id: this.category_id,
					search: this.searchValue
				}, res => {
					if (res.code === 1) {
						this.goodsList.push(...res.data.data)
						this.curTotal = res.data.total
						this.last_page = res.data.last_page
						console.log(res.data.last_page, 'res.data.last_page')
						if (this.current_page >= res.data.last_page || res.data.total == 0) {
							this.isMore = false
							this.change = true
						} else {
							this.change = false
						}
						// this.current_page >= res.data.last_page || res.data.total == 0 ? this.isMore = false  : '';

					}
				}, false, () => {
					uni.hideLoading()
					App.hideLoading()
				})
			},
			// 加入购物车
			addCart(goods_id, goods_sku_id, cartIndex) {
				let _this = this
				App._get('cart/add', {
					goods_id,
					goods_sku_id
				}, result => {
					if (result.code === 1) {
						_this.$set(_this.goodsList[cartIndex], 'cart_num', ++_this.goodsList[cartIndex]['cart_num'])
						_this.cartTotal = result.data.cart_total_num
						App.showSuccess('已加入购物车')
					}
				})
			},
			// 滚动到底部触发事件
			goodsListMore(e) {
				this.current_page++
				console.log(this.current_page, 'bottom')
				if (this.current_page <= this.last_page) {
					this.getgoodsLists()
				}
				console.log(this.isMore)


			},

			// 切换下一个分类（取消切换功能202012230948）
			getNextCate() {

				// if (!this.isMore) {
				// 	if (this.curtwoClassId == this.twoClassList[this.twoClassList.length - 1].category_id) {
				// 		let index = 0
				// 		this.oneClassList.forEach((item, index0, arr) => {
				// 			item.child.forEach((item1, index1, arr1) => {
				// 				if (item1.category_id == this.curtwoClassId) {
				// 					index = index0
				// 				}
				// 			})
				// 		})
				// 		if (index == this.oneClassList.length - 1) {
				// 			if (this.curtwoClassId == this.oneClassList[index].child[this.oneClassList[index].child.length - 1].category_id) {
				// 				this.tip = '这是最后一个分类，请查看其他分类'
				// 				return false
				// 			}
				// 		}
				// 		this.tip = '上拉加载下一个分类'
				// 		this.curOneClassId = this.oneClassList[index + 1].category_id
				// 		this.curtwoClassId = this.oneClassList[index + 1].child[0].category_id
				// 		this.category_id = this.oneClassList[index + 1].child[0].category_id
				// 		this.twoClassList = this.oneClassList[index + 1].child
				// 		this.goodsList = []
				// 		this.current_page = 1
				// 		this.getgoodsLists()
				// 	} else {
				// 		this.tip = '上拉加载下一个分类'
				// 		let index = 0
				// 		this.twoClassList.forEach((item, index0) => {
				// 			item.category_id == this.curtwoClassId ? index = index0 : ''
				// 		})
				// 		this.curtwoClassId = this.twoClassList[index + 1].category_id
				// 		this.category_id = this.twoClassList[index + 1].category_id
				// 		this.goodsList = []
				// 		this.current_page = 1
				// 		this.getgoodsLists()
				// 	}
				// }

			},
			// 控制滑动高度
			scrollyTop(e) {
				let _this = this
				_this.$util.debounce(200, () => {
					_this.scrollTop = e.detail.scrollTop
				})
				// _this.scrollTop = e.detail.scrollTop;
				console.log(_this.scrollTop)
			},
			/**
			 * 搜索提交
			 */
			search() {
				this.current_page = 1
				this.curOneClassId = ''
				// this.searchValue,
				this.category_id = ''
				this.curtwoClassId = ''
				this.goodsList = []

				this.getgoodsLists()
			},
			todetial(id) {
				App.navigationTo({
					url: 'pages/subPages/goods/index/index?&goods_id=' + id
				})
			},
			handletouchmove: function(event) {
				// console.log(event)
				if (this.flag !== 0) {
					return
				}
				let currentX = event.changedTouches[0].pageX
				let currentY = event.changedTouches[0].pageY
				let tx = currentX - this.lastX
				let ty = currentY - this.lastY
				let text = ''
				this.mindex = -1
				// 左右方向滑动
				if (Math.abs(tx) > Math.abs(ty)) {
					if (tx < 0) {
						text = '向左滑动'
						this.flag = 1
						//  this.getList();  //调用列表的方法
					} else if (tx > 0) {
						text = '向右滑动'
						this.flag = 2
					}
				}
				// 上下方向滑动
				else {
					console.log('向上滑动')
					if (ty < 0) {
						text = '向上滑动'

						this.flag = 3
						this.getNextCate() // 调用列表的方法
					} else if (ty > 0) {
						text = '向下滑动'
						this.flag = 4
					}
				}

				// 将当前坐标进行保存以进行下一次计算
				this.lastX = currentX
				this.lastY = currentY
				this.text = text
			},
			handletouchstart: function(event) {
				// console.log(event)
				this.lastX = event.changedTouches[0].pageX
				this.lastY = event.changedTouches[0].pageY
			},
			handletouchend: function(event) {
				this.flag = 0
				this.text = '没有滑动'
			}

		},

		onPullDownRefresh() {
			this.current_page = 1
			this.curOneClassId = ''
			this.searchValue = ''
			this.curtwoClassId = ''
			this.goodsList = []

			this.getgoodsLists()
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		onReachBottom() {
			// this.getNextCate()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
		height: 100vh;
		overflow: hidden;
	}

	.search-input {
		// text-align: center;
		background: #f8f8f8;
		border-radius: 35rpx;
		padding: 20rpx 240rpx 20rpx 40rpx;

		.input {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.goodsList-main {
		box-sizing: border-box;
		border-top: 1px solid #eee;

		.goodsList-left {
			width: 20%;
			border-right: 1px solid #eee;

			.scrollView {
				width: 100%;

				.goodsList-class-main {
					.class-item {
						box-sizing: border-box;
						padding: 30rpx 0;
						max-height: 100rpx;
					}
				}
			}
		}

		.goodsList-right {
			.scrollView {
				width: 100%;
			}

			// margin: 0 30rpx;
			.goods-twoClass-main {
				.scolltwoClass-main {
					white-space: nowrap;
					position: relative;
					width: 90%;
					right: 0;
					z-index: 2;
					padding: 20rpx 30rpx;
					box-sizing: border-box;

					.scolltwoClass {
						.scolltwoClass-item {
							display: inline-block;
							border-radius: 4px;
							padding: 4rpx 18rpx;
						}
					}
				}

				.goods-twoClass-icon {
					position: relative;
					right: 0%;
					width: 78rpx;
					height: 80rpx;
					line-height: 80rpx;
					background-color: #fff;
					z-index: 3;
				}
			}

			.goods-twoSelectClass-main {
				.pop-mask {
					position: fixed;
					background-color: #333333;
					opacity: .5;
					width: 100%;
					z-index: 2;
				}

				.twoSelectClass-list {
					position: fixed;
					z-index: 3;
					flex-wrap: wrap;
					padding: 20rpx 60rpx 20rpx 20rpx;
					width: 70%;

					.twoSelectClass-item {
						width: 30%;
						border: 1px solid #eee;
						height: 50rpx;
						line-height: 50rpx;
						border-radius: 10rpx;
						margin-bottom: 12rpx;
					}

					.goods-selectTwoClass-icon {
						position: fixed;
						right: 10rpx;
						width: 60rpx;
						height: 60rpx;
					}
				}
			}

			.goodsScoll {
				width: 100%;
				position: relative;
				margin-bottom: 69rpx;
				// margin-top: 60rpx;

				.goodsDetail-list-main {
					.goodsDetail-list-item {
						border-bottom: 1px solid #eee;

						.goodsDetail-left {
							width: 140rpx;
							height: 140rpx;
							border-radius: 10rpx;
							background-size: 140rpx 140rpx;
							background-repeat: no-repeat;
							flex-shrink: 0;
						}

						.goodsDetail-right {
							.goodsPrice {
								.goodsNowPrice {
									margin-right: 14rpx;
								}

								.goodsOldPrice {
									position: relative;
									margin-top: 2%;
									text-decoration: line-through;
								}
							}
						}

						.shoppIng-main {
							display: flex;
							flex-direction: column;
							position: absolute;
							right: 0;
							bottom: 0;
							top: 0;

							.shoppingIcon {
								width: 60rpx;
								height: 60rpx;
								background: linear-gradient(0deg, rgba(255, 220, 77, 1) 0%, rgba(255, 204, 0, 1) 100%);
								background: linear-gradient(0deg, var(--theme-color) 0%, var(--theme-color) 100%);
								border-radius: 50%;

								>image {
									display: block;
									margin: 0 auto;
									width: 30rpx;
									height: 30rpx;
									transform: translateY(50%);
								}

								.cart-num {
									position: absolute;
									right: -4px;
									top: -12px;
									background: #ff4444;
									border-radius: 50%;
									transform: scale(0.75);
									width: 20px;
									height: 20px;
									line-height: 20px;
									text-align: center;
								}
							}
						}
					}
				}
			}
		}

		.curselectClass {
			border-left: 8rpx solid #FFD940;
			border-left: 8rpx solid var(--theme-color);
			background-color: #F8F8F8;
		}

		.curTwoClass {
			border: 1px solid #eee;
			background-color: #FFF;
		}

		.curselectTwoClass {
			background-color: #FFD940;
		}
	}
</style>

<style lang="scss" scoped>
	.goodsDetail-title {
		width: 260rpx;
	}

	.class-item {
		position: relative;
	}

	.class-item__badge {
		position: absolute;
		top: 4rpx;
		right: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30rpx;
		min-width: 30rpx;
		padding: 0 4rpx;
		font-size: 20rpx;
		color: #fff;
		background-color: #FF4444;
		border-radius: 15rpx;
		transform: translateX(50%);
	}

	.shoppIng-main_label-status {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50rpx;
		padding: 0 8rpx;
		color: #333;
		font-size: 24rpx;
		font-weight: bold;
		background: linear-gradient(180deg, #FFDC4D 0%, #FFCC00 100%);
		border-radius: 8rpx;

		&.is-disabled {
			color: #fff;
			background: #C2C2C2;
		}
	}
</style>
