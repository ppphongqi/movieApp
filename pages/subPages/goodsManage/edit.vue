<template>
	<view class="" :style="themeColor">
		<form @submit='saveForm'>
			<view class="form-main">
				<view class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						商品类型
					</view>
					<view class="form-input">
						<!-- <input type="text" value="" /> -->
						<view v-if="options && options.goods_id">{{formData.transport_type.name}}</view>
						<block v-else>
							<picker mode="selector" :range="goodsType" range-key="name" @change="pickerChange">
								<view>{{formData.transport_type.name}}</view>
							</picker>
							<view class="col-9 f-22">
								<text v-if="!formData.transport_type.name">请选择</text>
								<text class="m-left12">></text>
							</view>
						</block>
					</view>
				</view>
				<view class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						商品名称
					</view>
					<view class="form-input">
						<input type="text" v-model="formData.goods_name" />
						<view class="col-9 f-22">
							<text class="iconfont icon-write f-22"></text>
							<text class="m-left12" v-if="!formData.goods_name">填写</text>
						</view>

					</view>
				</view>
				<view class="dis-flex flex-x-between flex-y-center form-item" @click="showPoint=true">
					<view class="col-3 f-28">
						商品卖点
					</view>
					<view class="form-input">
						<input type="text" disabled :value="formData.selling_point" />
						<view class="col-9 f-22">
							<text v-if="!formData.selling_point">请填写</text>
							<text class="m-left12">></text>
						</view>

					</view>
				</view>
				<view class="dis-flex flex-x-between flex-y-center form-item" @click="showCategory=true">
					<view class="col-3 f-28">
						商品分类
					</view>
					<view class="form-input">
						<input type="text" value="" v-model="category_name" />
						<view class="col-9 f-22">
							<text v-if="!category_name">请选择</text>
							<text class="m-left12">></text>
						</view>

					</view>
				</view>
				<view class="dis-flex flex-x-between flex-y-center form-item" @click="contentVisible=true">
					<view class="col-3 f-28">
						商品详情
					</view>
					<view class="form-input">
						<input type="text" disabled :value="formData.content" />
						<view class="col-9 f-22">
							<text v-if="!formData.content">请填写</text>
							<text class="m-left12">></text>
						</view>

					</view>
				</view>
				<view class="form-image">
					<view class="">
						<text class="f-28 col-3">商品图</text>
						<text class="f-22 col-9">(建议尺寸200X200)</text>
					</view>
					<view class="dis-flex flex-warp">
						<image src="../../../static/images/goods/jiahao.png" mode="" @click="addImage" class="m-top20">
						</image>
						<view class="image-part m-left20 m-top20" v-for="(item,index) in chooseImgArr" :key='index'>
							<image :src="item.file_path || item" mode="" class="" class="display-image"></image>
							<image src="../../../static/images/goods/del.png" mode="" class="del"
								@click="delImage(index)"></image>
							<!-- <text class="iconfont icon-close"></text> -->
						</view>

					</view>

				</view>
				<view class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						售卖价格
					</view>
					<view class="form-input">
						<input type="digit" v-model="formData.sku[0].goods_price" />
						<view class="col-9 f-22">
							<text class="iconfont icon-write f-22"></text>
							<text class="m-left12" v-if="!formData.sku[0].goods_price">填写</text>
						</view>

					</view>
				</view>

				<view class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						市场价
					</view>
					<view class="form-input">
						<input type="digit" value="" v-model="formData.sku[0].line_price" />
						<view class="col-9 f-22">
							<text class="iconfont icon-write f-22"></text>
							<text class="m-left12" v-if="!formData.sku[0].line_price">填写</text>
						</view>

					</view>
				</view>

				<view class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						商品库存
					</view>
					<view class="form-input">
						<input type="number" value="" v-model="formData.sku[0].stock_num" />
						<view class="col-9 f-22">
							<text class="iconfont icon-write f-22"></text>
							<text class="m-left12" v-if="!formData.sku[0].stock_num">填写</text>
						</view>

					</view>
				</view>

				<view class="dis-flex flex-x-between flex-y-center form-item"
					v-if="formData.transport_type.transport_type==20">
					<view class="col-3 f-28">
						配送方式
					</view>
					<view class="form-input" @click="showDelivery = true">
						<input type="text" v-model="deliveryName" disabled />
						<view class="col-9 f-22">
							<text v-if="!deliveryName">请选择</text>
							<text class="m-left12">></text>
						</view>

					</view>
				</view>

				<!-- <view class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						已出售数
					</view>
					<view class="form-input">
						<input type="text" value="" />
						<view class="col-9 f-22">
							<text class="iconfont icon-write f-22"></text>
							<text class="m-left12">填写</text>
						</view>

					</view>
				</view> -->

				<!-- <view class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						虚拟感兴趣人数
					</view>
					<view class="form-input">
						<input type="text" value="" />
						<view class="col-9 f-22">
							<text class="iconfont icon-write f-22"></text>
							<text class="m-left12">填写</text>
						</view>

					</view>
				</view> -->
				<!-- 
				<view class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						有效期
					</view>
					<view class="form-input">
						<input type="text" value="" />
						<view class="col-9 f-22">
							<text >请选择</text>
							<text class="m-left12">></text>
						</view>
						
					</view>
				</view> -->

				<!-- 门店 -->
				<view class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						门店
					</view>
					<!-- 这个if是想干个什么？？？ -->
					<view class="form-input" @click="getBusStore" v-if="store_id==-1 || !store_id">
						<view class="form-input__input">{{storeName}}</view>
						<view class="col-9 f-22">
							<text v-if="!storeName">请选择</text>
							<text class="m-left12">></text>
						</view>

					</view>
					<view class="form-input" v-else>
						<view class="form-input__input">{{storeName}}</view>
						<view class="col-9 f-22">
							<text v-if="!storeName">请选择2</text>
							<text class="m-left12">></text>
						</view>

					</view>
				</view>
				<!-- 门店 end -->
				<!-- 同城配送门店 -->
				<view v-if="deliveryData.run_errands == 1 && formData.store_id.length" class="dis-flex flex-x-between flex-y-center form-item">
					<view class="col-3 f-28">
						配送门店
					</view>
					<view class="form-input" @click="cityStorePopupVisible = true" v-if="store_id==-1 || !store_id">
						<input type="text" :value="cCurrentCityStore.name" disabled />
						<view class="col-9 f-22">
							<text v-if="!cCurrentCityStore.name">请选择</text>
							<text class="m-left12">></text>
						</view>
				
					</view>
					<view class="form-input" v-else>
						<input type="text" :value="cCurrentCityStore.name" disabled />
						<view class="col-9 f-22">
							<text v-if="!cCurrentCityStore.name">请选择</text>
							<text class="m-left12">></text>
						</view>
				
					</view>
				</view>
				<!-- 同城配送门店 end -->
				<view style="height: 400rpx;">
					<button class="save-btn main-bg-color auxiliary-color" form-type="submit"> 保存</button>
				</view>

			</view>




		</form>
		<!-- 门店弹窗 -->
		<popup-view :show="showStore" type="bottom" @clickmask="confirmStoreId">
			<view class="point-part b-f">
				<view class="col-3 f-32 t-c title">
					选择门店
					<label @click="checkALlStore">
						<checkbox color="#FFCC33" style="transform:scale(0.7)" :checked="checkAll" />全选
					</label>
				</view>
				<view class="">
					<checkbox-group class="dis-flex  flex-y-center flex-warp" @change="getStore" v-model="selectStore">
						<label style="width: 32%;overflow: hidden;display: inline-block;" class="f-28 m-top40 "
							v-for="(item,index) in storeData">
							<checkbox :value="(item.id+'')" :checked="item.check" color="#FFCC33"
								style="transform:scale(0.7)" />
							{{item.name.length>4?item.name.slice(0,4)+'...':item.name}}
						</label>
					</checkbox-group>
				</view>
				<button type="primary" class="main-bg-color f-28 auxiliary-color m-top30"
					@click="confirmStoreId(1)">确定</button>
			</view>
		</popup-view>
		<!-- 门店弹窗 end -->
		
		<!-- 配送门店弹窗 -->
		<popup-view :show="cityStorePopupVisible" type="bottom">
			<view class="point-part b-f">
				<view class="col-3 f-32 t-c title">
					选择配送门店
				</view>
				<view class="">
					<radio-group class="dis-flex  flex-y-center flex-warp" @change="handleCityStoreChange">
						<label style="width: 32%;overflow: hidden;display: inline-flex;" class="f-28 m-top40 "
							v-for="(item,index) in cCityStoreOptions">
							<view>
								<radio :value="''+item.id" color="#FFCC33" :checked="item.id == formData.delivery_store_id" />
							</view>
							<view>{{item.name}}</view>
						</label>
					</radio-group>
				</view>
				<button type="primary" class="main-bg-color f-28 auxiliary-color m-top30"
					@click="cityStorePopupVisible = false">确定</button>
			</view>
		</popup-view>
		<!-- 配送门店弹窗 end -->


		<!-- 配送方式弹窗 -->
		<popup-view :show="showDelivery" type="bottom" @clickmask="confirmDelivery(0)">
			<view class="podelivery-part b-f">
				<view class="title col-3 f-32 t-c">
					选择配送方式
				</view>
				<view class="uni-list">
					<view class="dis-flex flex-x-between item">
						<label class="dis-block col-3 f-28 " @click="deliveryData.isexpress= !deliveryData.isexpress">
							<checkbox :checked="deliveryData.isexpress" />物流发货

						</label>
						<picker mode="selector" v-if="deliveryData.isexpress" :range="mouldData" range-key="name"
							@change="mouldDataChange">
							<view class="col-9 f-28">
								{{deliveryData.delivery_id.name?deliveryData.delivery_id.name:'请选择运费模板'}}</view>
						</picker>
					</view>
					<label class="dis-block col-3 f-28 item" @click="deliveryData.iszt=!deliveryData.iszt">
						<checkbox :checked="deliveryData.iszt" />到店自提
					</label>
					<label class="dis-block col-3 f-28 item"
						@click="deliveryData.run_errands=!deliveryData.run_errands">
						<checkbox :checked="deliveryData.run_errands" />同城配送
					</label>
				</view>
				<button type="primary" class="main-bg-color auxiliary-color" @click="confirmDelivery(1)">确定</button>


			</view>

		</popup-view>
		<!-- 商品卖点弹窗 -->
		<popup-view :show="showPoint" type="bottom" @clickmask="showPoint = false">
			<view class="point-part b-f">
				<textarea v-if="showPoint" v-model="formData.selling_point" placeholder="请输入商品卖点..."
					placeholder-class="col-9 f-28" />
				<button type="primary" class="main-bg-color f-28 auxiliary-color m-top30"
					@click="showPoint = false">确定</button>

			</view>

		</popup-view>
		<!-- 商品卖点弹窗 end -->

		<!-- 商品详情弹窗 -->
		<popup-view :show="contentVisible" type="bottom" @clickmask="contentVisible = false">
			<view class="point-part b-f">
				<textarea v-if="contentVisible" v-model="formData.content" placeholder="请输入商品详情..."
					placeholder-class="col-9 f-28" />
				<button type="primary" class="main-bg-color f-28 auxiliary-color m-top30"
					@click="contentVisible = false">确定</button>

			</view>

		</popup-view>
		<!-- 商品详情弹窗 end -->

		<!-- 商品分类弹窗 -->
		<popup-view :show="showCategory" type="bottom" @clickmask="confirm(0)">
			<view class="categroy-part b-f">
				<scroll-view scroll-y="true" style="height: 53vh;" :show-scrollbar='false'>
					<view class="category-item m-top30" v-for="(item,index) in categoryData" :key='index'>
						<view class="dis-flex  flex-x-between f-30 col-3 flex-y-center">
							<view class="" @click="select('one',item)">
								<label class="radio">
									<text>{{item.name}}</text>
									<radio value="" :color="topColor" :checked="item.check ==true"
										v-if="(item.child && item.child.length==0) || !item.child" class="form-radio" />
								</label>


							</view>
							<view class="" @click="select('all',item)" v-if="item.child && item.child.length>0">
								<label class="radio">
									<radio class="form-radio" value="" :color="topColor" :checked="item.check ==true" />
									<text>选择全部</text>
								</label>
							</view>

						</view>
						<view class="f-28 col-3 dis-flex  flex-warp">
							<view class="two-category m-top20 m-left12"
								:class="{'category-active':category.check==true}"
								v-for="(category,cateIndex) in item.child" @click="select('one',category)">
								{{category.name}}
							</view>

						</view>
					</view>
				</scroll-view>
				<view class="btn-part dis-flex flex-x-center flex-y-center">
					<button type="primary" class="main-bg-color auxiliary-color" @click="confirm(1)">确定</button>
				</view>


			</view>

		</popup-view>

	</view>

</template>

<script>
	import PopupView from "@/components/template/PopManager.vue"
	import App from "@/common/js/app.js"
	export default {
		components: {
			PopupView
		},
		data() {
			return {
				options: {
					goods_id: ''
				},
				showDelivery: false, //是否展示配送弹框
				showStore: false, //是否弹出门店选择
				formdisabled: false,
				showPoint: false,
				showCategory: false,
				categoryData: [],
				chooseImgArr: [],
				bus_id: "",
				category_name: '',
				select_category: [],
				localIds: [],
				formData: {
					transport_type: {},
					goods_name: '', //商品名称,
					// 商品卖点
					selling_point: '',
					sku: [{
						goods_price: '',
						line_price: '',
						stock_num: ""

					}],
					category_id: [],
					store_id: [],
					delivery_id: "",
					isexpress: 0,
					iszt: 0,
					// 是否开启同城配送
					run_errands: 0,
					// 商品详情
					content: '',
					// 同城配送门店id
					delivery_store_id: '',
				},
				deliveryData: {
					delivery_id: {
						id: '',
						name: ''
					},
					isexpress: false,
					iszt: false,
					// 是否开启同城配送
					run_errands: false
				},
				goodsType: [{
						transport_type: 10,
						name: '核销商品'
					},
					{
						transport_type: 20,
						name: '实物商品'
					}
				],
				storeData: [], //门店数据
				selectStore: [],
				mouldData: [],
				storeName: '',
				deliveryName: '',
				checkAll: false,
				store_id: '',
				contentVisible: false,
				// 商品的接口数据（用于回显）
				goodsRes: {},
				// 配送门店弹窗是否显示
				cityStorePopupVisible: false
			}
		},
		async onShow() {
			try {
				await Promise.all([this.getGoodsCategory(), this.getmouldData()])
				this.fetchGoodsResIfNeeded()
			} catch (e) {
				//TODO handle the exception
			}
		},
		computed: {
			// 当前可以选择的同城配送门店
			cCityStoreOptions() {
				if(this.deliveryData.run_errands != 1 || !this.formData.store_id.length) {
					return []
				}
				const store_id = this.formData.store_id || []
				return store_id.map(id=>{
					return (this.storeData || []).find(store=>{
						return store.id == id
					})
				})
			},
			// 当前选中的同城配送门店信息
			cCurrentCityStore() {
				return this.cCityStoreOptions.find(item=>item.id == this.formData.delivery_store_id) || {}
			}
		},
		watch: {
			cCityStoreOptions(val) {
				if(!this.formData.delivery_store_id) return 
				if(!val.find(val => val.id == this.formData.delivery_store_id)) {
					this.formData.delivery_store_id = ''
				}
			}
		},
		onLoad(Option) {
			this.options = Option
			this.bus_id = Option.bus_id
			this.store_id = Option.store_id
		},
		methods: {
			handleCityStoreChange(e) {
				this.formData.delivery_store_id = e.detail.value
			},
			// 请求商品的接口数据
			async fetchGoodsResIfNeeded() {
				if (!this.options.goods_id || this.goodsResFetched) return
				this.goodsResFetched = true
				console.log('fetchGoodsResIfNeeded')
				try {
					const res = await App._getP('Goods/webGoodsInfo', {
						goods_id: this.options.goods_id
					})
					this.goodsRes = res.data
					// 改变表单的值
					this.formData.transport_type = (this.goodsType || []).find(item => item.transport_type == this
						.goodsRes.transport_type)
					this.formData.goods_name = this.goodsRes.goods_name
					this.formData.selling_point = this.goodsRes.selling_point
					this.formData.sku = this.goodsRes.sku
					this.formData.category_id = this.goodsRes.category_id
					this.formData.content = this.goodsRes.content
					this.formData.run_errands = this.goodsRes.run_errands
					this.formData.delivery_store_id = this.goodsRes.delivery_store_id
					this.category_name = this.goodsRes.category_id.map(id => {
						const cate = (this.categoryData || []).find(item => item.category_id == id) || {}
						console.log('cate', cate)
						return cate.name
					}).filter(item => item).join(',')
					this.selectStore = this.goodsRes.store_id
					this.confirmStoreId(1)
					this.confirmDelivery(0)
					this.chooseImgArr = this.goodsRes.image
					this.localIds = this.goodsRes.image 
				} catch (e) {
					console.log('fetchGoodsRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}

			},
			confirmDelivery(type) {
				if (type == 1) {
					const {
						deliveryData: {
							iszt,
							isexpress,
							delivery_id,
							run_errands
						}
					} = this
					this.formData.delivery_id = delivery_id &&　delivery_id.id
					this.formData.iszt = iszt ? 1 : 0
					this.formData.isexpress = isexpress ? 1 : 0
					this.formData.run_errands = run_errands ? 1 : 0
				} else {
					const {
						formData: {
							iszt,
							isexpress,
							delivery_id,
							run_errands,
						}
					} = this
					this.deliveryData.delivery_id = this.mouldData.filter(item => item.id == delivery_id)[0]
					this.deliveryData.iszt = iszt == 1
					this.deliveryData.isexpress = isexpress == 1
					this.deliveryData.run_errands = run_errands == 1
					console.log(this.deliveryData.delivery_id, 'delivery_id===========')
				}
				this.showDelivery = false
				let deliveryName = ''
				if(this.formData.iszt) {
					deliveryName += '到店自提,'
				}
				if(this.formData.isexpress) {
					deliveryName += `物流发货(${this.deliveryData.delivery_id.name})`
				}
				if(this.formData.run_errands) {
					deliveryName += '同城配送'
				}
				this.deliveryName = deliveryName

			},
			mouldDataChange(e) {
				this.deliveryData.delivery_id = this.mouldData[e.detail.value]
			},
			async getmouldData() {
				try {
					const res = await App._postP('Setting/goodsDeliveryAll')
					this.mouldData = res.data
				} catch (e) {
					//TODO handle the exception
				}

			},
			confirm(type) {
				let category_id = this.select_category,
					category_name = [];
				this.formData.category_id = []
				console.log(category_id, category_name)
				if (type == 0) {
					this.categoryData.forEach((item, index) => {
						category_id.indexOf(item.category_id) > -1 && this.$set(item, 'check', false)

						if (item.child && item.child.length) {
							item.child.forEach(item1 => {
								category_id.indexOf(item1.category_id) > -1 && this.$set(item1, 'check',
									false)
							})
						}
					})
					this.select_category = []
					category_id = []
					category_name = []

				}
				this.categoryData.forEach((item, index) => {
					item.check && this.formData.category_id.push(item.category_id)

					item.check && category_name.push(item.name)
					if (item.child && item.child.length) {
						item.child.forEach(item1 => {
							item1.check && this.formData.category_id.push(item1.category_id)
							item1.check && category_name.push(item1.name)
						})
					}
				})

				this.category_name = category_name.join(',')
				this.select_category = []
				this.showCategory = false

			},
			select(type, category) {
				if (type == 'one') {
					category.check ? this.$set(category, 'check', false) : this.$set(category, 'check', true)
					this.select_category.push(category.category_id)
				}

				if (type == 'all') {
					category.check ? this.$set(category, 'check', false) : this.$set(category, 'check', true)
					this.select_category.push(category.category_id)
					category.child.forEach(item => {
						category.check ? this.$set(item, 'check', true) : this.$set(item, 'check', false)
						this.select_category.push(item.category_id)
					})
				}
				this.select_category = [...new Set(this.select_category)]


			},
			// 获取商品分类 和商家门店
			async getGoodsCategory() {
				try {
					const res = await App._postP('Goods/categoryIndex',{
						bus_id: this.options.bus_id
					})
					const {
						code,
						data: data = [],
						msg
					} = res;
					this.categoryData = data
					this.categoryData.forEach((item, index) => {
						this.$set(item, 'check', false)

						if (item.child && item.child.length) {
							item.child.forEach(item1 => {
								this.$set(item1, 'check', false)
							})
						}
					})
				} catch (e) {
					//TODO handle the exception
				}

				try {
					const res = await App._postP('Goods/getStore', {
						bus_id: this.bus_id
					})
					this.storeData = res.data
					this.storeData.forEach(item => {
						this.$set(item, 'check', false)
						if (this.store_id == item.id) {
							this.$set(item, 'check', true)
							this.storeName = item.name
						}


					})
				} catch (e) {
					//TODO handle the exception
				}

			},
			pickerChange(e) {
				this.formData.transport_type = this.goodsType[e.detail.value]

			},
			addImage() {
				let _this = this;
				console.log('chooseImage0000', {
					chooseImgArr: _this.chooseImgArr,
					localIds: _this.localIds
				})
				App.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log('chooseImage:success', res)
						let tempFilePaths = res.tempFilePaths,
							chooseImgNum = tempFilePaths.length;
						if (_this.chooseImgArr.length < 9) {
							if (_this.chooseImgArr.length + chooseImgNum > 9) {
								console.log('chooseImage2222')
								_this.chooseImgArr.push(...tempFilePaths.splice(0, 9 - chooseImgNum));
								if (_this.appClientType === "4") {
									_this.localIds.push(...res.localIds.splice(0, 9 - chooseImgNum));
								}
							} else {
								console.log('chooseImage2222', {
									chooseImgArr: _this.chooseImgArr,
									localIds_this: _this.localIds,
									tempFilePaths,
									localIds: res.localIds
								})
								_this.chooseImgArr = [..._this.chooseImgArr, ...tempFilePaths]
								if (_this.appClientType === "4") {
									_this.localIds = [..._this.localIds, ...res.localIds]
								}
							}
						} else {
							App.showError('最多上传九张图')
						}
						console.log(_this.localIds, 'localIds======');
					}
				})
			},
			// 删除选择的照片
			delImage(index) {
				this.chooseImgArr = [...this.chooseImgArr]
				this.localIds = [...this.localIds]
				this.chooseImgArr.splice(index, 1)
				this.localIds.splice(index, 1)
			},
			// 上传图片
			saveForm() {
				let formData = JSON.parse(JSON.stringify(this.formData)),
					_this = this;
				formData.transport_type = formData.transport_type.transport_type
				// 验证表单
				if (!formData.transport_type) {
					App.showError('请选择商品类型(必填)')
					return
				}
				if (!formData.goods_name) {
					App.showError('请输入商品名称(必填)')
					return
				}
				if (!formData.category_id.length) {
					App.showError('请选择商品分类(必填)')
					return
				}
				if ((this.appClientType === "4" && !this.localIds.length) || (this.appClientType != "4" && !this
						.chooseImgArr.length)) {
					App.showError('请选择商品图(必填)')
					return
				}
				if (!formData.sku[0]["goods_price"]) {
					App.showError('请输入商品售卖价格(必填)')
					return
				}
				if (!formData.sku[0]["line_price"]) {
					App.showError('请输入商品市场价格(必填)')
					return
				}
				if (!formData.sku[0]["stock_num"]) {
					App.showError('请输入商品库存数量(必填)')
					return
				}
				if (!formData.store_id.length) {
					App.showError('请选择门店(必填)')
					return
				}
				if (formData.transport_type == 20 && (!formData.iszt && !formData.isexpress && !formData.run_errands)) {
					App.showError('请选择配送方式')
					return
				}
				if (formData.transport_type == 20 && formData.isexpress && !formData.delivery_id) {
					App.showError('请选择运费模板')
					return
				}
				if(formData.run_errands &&　!this.formData.delivery_store_id) {
					App.showError('请选择配送门店')
					return
				}
				formData.category_id = JSON.stringify(formData.category_id)
				formData.sku = JSON.stringify(formData.sku)
				App.showError('是否提交信息', (res) => {
					if (res.confirm) {
						let isUpLoad = _this.appClientType === "4" ? _this.localIds.length > 0 : _this.chooseImgArr
							.length > 0;
						uni.showLoading({
							title: "提交中..."
						})
						if (isUpLoad) {
							let image = [],
								upLoadList = _this.appClientType === "4" ? _this.localIds : _this.chooseImgArr;
							// 只能骚操作了
							const arr1 = upLoadList.filter(item => item.file_path)
							const arr2 = upLoadList.filter(item => !item.id)

							console.log({
								arr1,
								arr2
							})
							if (arr2.length) {
								App._upLoadAll(arr2).then(options => {
									image.push(...options);
									image.push(...arr1);
									Object.assign(formData, {
										image
									})
									_this.formDataUrl(formData)
								})
							} else {
								image.push(...arr1);
								Object.assign(formData, {
									image
								})
								_this.formDataUrl(formData)
							}

						} else {
							// if (_this.old_imgsData.length > 0) {
							// 	Object.assign(values, {
							// 		merchantImage: _this.old_imgsData
							// 	})
							// }
							// _this.formDataUrl(values)
						}
					}
				}, true)
			},
			formDataUrl(value) {
				value.image = JSON.stringify(value.image)
				value.store_id = JSON.stringify(value.store_id)
				value.bus_id = this.bus_id

				if (value.transport_type == 10) {
					delete value.delivery_id
					delete value.iszt
					delete value.isexpress
				}
				if (this.options.goods_id) {
					App._post_form('Goods/webEditGoodsInfo', {
						...value,
						goods_id: this.options.goods_id
					}, res => {
						const {
							code,
							msg
						} = res
						App[code == 1 ? 'showSuccess' : 'showError'](msg)
						code == 1 && uni.navigateBack()
					})
				} else {
					App._post_form('Goods/addGoods', value, res => {
						const {
							code,
							msg
						} = res
						App[code == 1 ? 'showSuccess' : 'showError'](msg)
						code == 1 && uni.navigateBack()
					})
				}


			},
			// 获取商家门店
			getBusStore() {
				this.showStore = true

			},
			getStore(e) {
				this.selectStore = e.detail.value
			},
			checkALlStore() {
				this.checkAll = !this.checkAll
				this.selectStore = []

				this.storeData.forEach(item => {
					if(this.checkAll) {
						this.selectStore.push(item.id + '')
						this.$set(item, 'check', true)
					}else {
						this.$set(item, 'check', false)
					}
					
				})
			},
			confirmStoreId(type) {
				this.showStore = false
				if (type) {
					this.formData.store_id = this.selectStore
				} else {
					this.selectStore = this.formData.store_id
					this.storeData.forEach(item => {

						this.formData.store_id.indexOf(item.id + '') > -1 ? this.$set(item, 'check', true) : this
							.$set(item, 'check', false)
					})
					console.log()
				}
				this.checkAll && (this.checkAll = false)
				let storeName = []
				this.storeData.forEach(item => {
					if (this.formData.store_id.indexOf(item.id + '') > -1) {
						storeName.push(item.name)
					}

				})
				this.storeName = storeName.join(',')
				this.selectStore = []
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
		height: 100vh;
	}

	/deep/ .uni-radio .uni-radio-input {
		width: 20rpx !important;
		height: 20rpx !important;
	}

	// 配送方式弹窗
	.podelivery-part {

		width: 100vw;
		padding: 30rpx;
		box-sizing: border-box;

		.uni-list-cell {
			justify-content: flex-start
		}

		.title {
			padding: 40rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #EEEEEE;
		}

		.item {
			padding: 40rpx 0;
			box-sizing: border-box;
			border-bottom: 1rpx solid #EEEEEE;

		}

		button {
			width: 100%;
			height: 80rpx;
			border-radius: 40rpx;
		}
	}

	// 商品分类弹窗
	.categroy-part {
		width: 100vw;
		height: 65vh;
		background: rgba(255, 255, 255, 1);
		padding: 30rpx;
		box-sizing: border-box;
		border-radius: 20rpx 20rpx 0px 0px;

		.category-item {
			background: rgba(244, 244, 244, 1);
			border-radius: 10rpx;
			padding: 30rpx;
			box-sizing: border-box;

			.form-radio {
				transform: scale(0.5);
			}

			.two-category {
				padding: 6rpx 23rpx;
				background: rgba(238, 238, 238, 1);
				border: 1rpx solid rgba(204, 204, 204, 1);
				border-radius: 30rpx;


			}

			.category-active {
				background: var(--theme-color);
				border: 1rpx solid var(--theme-color);
			}
		}

		.btn-part {
			height: 150rpx;
			line-height: 150rpx;
			background: rgba(255, 255, 255, 1);

			button {
				width: 80%;
				height: 80rpx;
				border-radius: 40rpx;
				font-size: 28rpx;
				color: #333333;
			}
		}
	}

	// 商品卖点弹框
	.point-part {
		width: 100vw;
		// height: 65vh;
		border-radius: 20rpx 20rpx 0px 0px;
		padding: 30rpx;
		box-sizing: border-box;

		.title {
			padding: 10rpx 40rpx 40rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #EEEEEE;
			position: relative;

			label {
				position: absolute;
				top: 10rpx;
				right: 0;
				font-size: 28rpx;
			}
		}

		textarea {
			font-size: 28rpx;
			width: 100%;
			height: 600rpx;
			padding: 30rpx;
			box-sizing: border-box;
			background: rgba(244, 244, 244, 1);
			border-radius: 10px;
		}

		button {
			margin-top: 65rpx;
			height: 80rpx;
			border-radius: 35rpx;
		}
	}

	.form-main {
		padding: 30rpx;
		box-sizing: border-box;
		margin-bottom: 150rpx;

		.save-btn {
			position: fixed;
			bottom: 30rpx;
			width: 80%;
			left: 10%;
			height: 90rpx;
			z-index: 20;
			border-radius: 50rpx;
		}

		.form-image {
			padding: 0 20rpx;
			margin-top: 40rpx;
			box-sizing: border-box;
			background-color: #fff;

			image {
				width: 200rpx;
				height: 200rpx;
			}

			.image-part {
				width: 200rpx;
				height: 200rpx;

				position: relative;

				.display-image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
					position: absolute;
					top: 0;
					left: 0;
				}

				.del {
					position: absolute;
					top: 0;
					right: 0;
					width: 40rpx;
					height: 40rpx;
				}

			}
		}

		.form-item {
			height: 80rpx;
			background: #FAFAFA;
			margin-top: 40rpx;
			padding: 0 20rpx;
			box-sizing: border-box;

			.form-input {
				width: 80%;
				height: 100%;
				position: relative;

				.m-left12 {
					margin-left: 10rpx;
				}
				
				
				view {
					width: 100%;
					height: 100%;
					line-height: 80rpx;
					text-align: right;
					position: absolute;
					top: 0;
					left: 0;
				}

				input,
				picker,
				.form-input__input {
					width: 94%;
					height: 100%;
					position: absolute;
					top: 0;
					color: #333333;
					font-size: 24rpx;
					left: 0;
					z-index: 2;
					text-align: left;
				}
			}

		}



	}
</style>
