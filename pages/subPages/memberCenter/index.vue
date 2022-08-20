<template>
	<view class="page-memberCenter">
		<!-- 搜索框 -->
		<u-sticky h5-nav-height="0" bg-color="transparent" z-index="199">
			<SearchHeader :address="agentMixin_cLocationName" @on-search="handleSearch"></SearchHeader>
		</u-sticky>
		<!-- 搜索框 end -->
		<!-- 会员卡片 -->
		<MemberCard :isMember="cMember.isMember" :bgUrl="cMember.bgUrl" :avatar="cMember.avatar" :name="cMember.name"
			:no="cMember.no" :expire="cMember.expire" :expireVisible="cMember.expireVisible" :times="cMember.times"
			:timesVisible="cMember.timesVisible" :membersNum="cMember.membersNum" :save="cMember.save"
			@on-rule-click="handleRuleClick" @on-open-member-click="handleOpenMemberClick"
			@on-renew-member-click="handleRenewMemberClick">
		</MemberCard>
		<!-- 会员卡片 end -->
		<!-- main -->
		<view class="page-memberCenter__main">
			<!-- 专属权益 -->
			<NavGridList :list="cNavGridList" @on-item-click="handleNavGridItemClick"></NavGridList>
			<!-- <image class="page-memberCenter__privilege" :src="cPrivilege.imgSrc" mode="widthFix"></image> -->
			<!-- 专属权益 end -->
			<!-- 广告位 -->
			<image class="page-memberCenter__ad" :src="cAd.imgSrc" mode="aspectFill" @click="navigationTo(cAd.link)"></image>
			<!-- 广告位 end -->
			<!-- tab导航 -->
			<view style="margin: 0 -30rpx;">
				<page-nav-bar class="page-nav" :nav-list="cTopCateData" :current="cTopCateActiveItem.id"
					@on-nav-item-click="handleTopCateItemClick"></page-nav-bar>
			</view>
			<!-- tab导航 end -->
			<!-- 类别导航 -->
			<view v-if="['drink','store','discount'].includes(cTopCateActiveItem.id)" style="margin: 0 -30rpx;">
				<scroll-view scroll-x="true">
					<view>
						<view class="radio-nav-list">
							<view class="radio-nav-item" v-for="item in cSubNavList" :key="item.id"
								:class="{'is-active': item.id == subNavListActiveId}"
								@click="handleSubNavListClick(item)">
								{{item.title}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 类别导航 end -->
			<!-- 商品分类 -->
			<view v-if="['goods'].includes(cTopCateActiveItem.id)" style="margin: 0 -30rpx;">
				<scroll-view scroll-x="true">
					<view>
						<view class="radio-nav-list">
							<view class="radio-nav-item" v-for="item in cGoodsCateList" :key="item.id"
								:class="{'is-active': item.id == goodsCateActiveId}"
								@click="handleGoodsCateListClick(item)">
								{{item.title}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 商品分类 -->
		</view>
		<!-- main end -->
		<!-- 列表些 -->
		<view style="min-height: 50vh;">
			<!-- 免费喝酒 -->
			<AlcoholStoreList v-if="cTopCateActiveItem.id === 'drink'" :list="cDrinkList"
				@on-btn-appoint-click="handleBtnAppointClick" @on-logo-click="goToStoreDetail"></AlcoholStoreList>
			<!-- 免费喝酒 end -->
			<!-- 商家信息 -->
			<StoreList v-else-if="cTopCateActiveItem.id === 'store'" :list="cStoreList" @on-logo-click="goToStoreDetail">
			</StoreList>
			<!-- 商家信息 end -->
			<!-- 商家折扣 -->
			<DiscountStoreList v-else-if="cTopCateActiveItem.id === 'discount'" :list="cDiscountList">
			</DiscountStoreList>
			<!-- 商家折扣 end -->
			<!-- 商品列表 -->
			<DiyGoodsV2 v-else-if="cTopCateActiveItem.id === 'goods'" :params="{}"
				:itemStyle="{ display: '2', buybtn: '1', btntext: '立即购买',charges:'1',commission:'赚',distanceVisible:'1' }" :item-data="cGoodsList">
			</DiyGoodsV2>
			<!-- 商品列表 end -->
			<!-- 加载更多提示 -->
			<LoadMore :showLoadmore="cTopCateActiveItem.listRes && !cTopCateActiveItem.listRes.hasMore"></LoadMore>
			<!-- 加载更多提示 end -->

		</view>
		<!-- 列表些 end -->
		<!-- 规则弹窗 -->
		<DescPopup v-model="descPopupVisible" :text="cMember.explain"></DescPopup>
		<!-- 规则弹窗 end -->
		<!-- 预约弹窗 -->
		<AppointPopup v-model="appointPopupVisible" :title="appointPopupTarget.name"
			:desc="appointPopupTarget.store_introduce" @on-btn-go-click="handleBtnGoClick"></AppointPopup>
		<!-- 预约弹窗 end -->
		<!-- 开通会员提示弹窗 -->
		<OpenMemberPopup v-model="openMemberPopupVisible" @comfirm="handleOpenMemberClick"></OpenMemberPopup>
		<!-- 开通会员提示弹窗 end -->
		<!-- 底部导航 -->
		<tab-bar zIndex="100" />
		<!-- 底部导航 end -->
		<!-- h5分享提示 -->
		<!-- #ifdef H5 -->
		<share-guide ref="shareGuide"></share-guide>
		<!-- #endif -->
		<!-- h5分享提示 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading -->
	</view>
</template>

<script>
	import PageNavBar from '@/components/template/PageNavBar2.vue'
	import App from "@/common/js/app.js";
	import LoadMore from '@/components/template/Loadmore.vue'
	import DiyGoodsV2 from "@/components/page/pageComponents/GoodsV2.vue";
	import SearchHeader from './components/SearchHeader.vue'
	import MemberCard from './components/MemberCard.vue'
	import NavGridList from './components/NavGridList.vue'
	import AlcoholStoreList from './components/AlcoholStoreList.vue'
	import StoreList from './components/StoreList.vue'
	import DiscountStoreList from './components/DiscountStoreList.vue'
	import DescPopup from './components/DescPopup.vue'
	import AppointPopup from './components/AppointPopup.vue'
	import OpenMemberPopup from './components/OpenMemberPopup.vue'
	import agentMixin from '@/mixins/agentMixin'
	import TabBar from '@/components/template/TabBar'
	import pageShare from "@/common/js/pageShareMixin.js"

	export default {
		mixins: [agentMixin, pageShare],
		components: {
			SearchHeader,
			MemberCard,
			NavGridList,
			PageNavBar,
			AlcoholStoreList,
			StoreList,
			DiscountStoreList,
			DescPopup,
			AppointPopup,
			LoadMore,
			TabBar,
			DiyGoodsV2,
			OpenMemberPopup
		},
		data() {
			return {
				options: {},
				// 当前选中的顶部tab索引
				topCateAvtive: 0,
				// 二级导航当前选中的id
				subNavListActiveId: '',
				// 商品分类选中的id
				goodsCateActiveId: 'all',
				// 当前的纬度
				lat: 30.57447,
				// 当前的经度
				lng: 103.92377,
				// 开通会员弹窗是否显示
				openMemberPopupVisible: false,
				// 预约弹窗是否显示
				appointPopupVisible: false,
				// 预约弹窗的目标数据
				appointPopupTarget: {},
				// 用卡说明弹窗是否显示
				descPopupVisible: false,
				// 会员信息的接口数据
				memberInfoRes: {},
				// 当前搜索的值
				search: '',
				// 免费喝酒列表的接口数据
				drinkListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					listRow: 10,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false,
				},
				// 商家信息列表的接口数据
				storeListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					listRow: 10,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false,
				},
				// 商圈折扣列表的接口数据
				discountListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					listRow: 10,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false,
				},
				// 周边商品列表的接口数据
				goodsListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					listRow: 10,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false,
				},
				// 商圈分类的接口数据
				circleRes: [],
				// 商品分类的接口数据
				goodsCateRes: []
			}
		},
		computed: {
			// 格式化商品列表
			cGoodsList() {
				const list = this.$util.deepGet(this.goodsListRes, "data", []);
				return list.map((item) => {
					return {
						...item,
						goods_image: item.image && item.image[0] ?
							item.image[0].file_path : "",
						goods_price: item.display ?
							item.goods_price : item.spec_type === 20 ?
							item.goods_min_price : item.sku[0] ?
							item.sku[0].goods_price : "",
						line_price: item.sku[0] ? item.sku[0].line_price : "",
						member_price: item.coupon_price || 0,
						priceEarn: item.dealer_money || 0,
						commission: "返",
						charges: "1",
					};
				});
			},
			// 格式化的专属权益
			cNavGridList() {
				const list = this.$util.deepGet(this.memberInfoRes, 'memberSet.icon') || []
				return list.map((item, index) => ({
					id: item.text + index,
					image: item.img,
					text: item.text,
					link: item.link
				}))
			},
			// 格式化的免费喝酒列表
			cDrinkList() {
				const data = this.drinkListRes.data || []
				return data.map((item) => {
					return {
						id: item.id,
						// 店铺logo
						logo: this.$util.deepGet(item, 'logo.0.file_path') || '',
						// 地址
						address: item.address,
						// 距离
						distance: `距${item.width}km`,
						// 经纬度信息
						location: {
							name: item.name,
							address: item.address,
							longitude: item.lng,
							latitude: item.lat,
						},
						name: item.name,
						// 标题
						title: item.store_introduce,
						// 描述
						desc: item.dis_info,
						// 已预订多少桌
						bookedNum: +item.booked || 0,
						// 限制多少桌
						limit: +item.reservation || 0,
						// 预订百分比，0-100，
						bookedPercent: item.booked / item.reservation * 100,
						// 预约人员列表
						userList: (item.reservation_user || []).slice(0, 5).map((user, index) => ({
							id: `user${index}`,
							avatar: user.avatarUrl
						})),
						// 多少人已经预约
						bookedUserNum: +item.reservation_record_count,
						// 在线买单id
						pay_online_business_id: item.pay_online_business_id,
						// 本店特色
						store_introduce: item.characteristic,
						bus_id: item.bus_id,
						store_id: item.id
					}
				})
			},
			// 格式化的商家信息列表
			cStoreList() {
				const data = this.storeListRes.data || []
				return data.map(item => {
					return {
						id: item.id,
						// 店铺logo
						logo: this.$util.deepGet(item, 'logo.0.file_path') || '',
						// 地址
						address: item.address,
						// 距离
						distance: `距${item.width}km`,
						// 经纬度信息
						location: {
							name: item.name,
							address: item.address,
							longitude: item.lng,
							latitude: item.lat,
						},
						// 电话
						phone: item.mobile,
						// 标题
						title: item.business_name,
						// 描述
						desc: item.store_info,
						// 图片列表
						images: (item.quaimg || []).map((img, imgIndex) => ({
							id: `img${imgIndex}`,
							url: this.$util.deepGet(img, 'file.0.file_path') || ''
						})),
						bus_id: item.bus_id,
						store_id: item.id
					}
				})
			},
			// 格式化的商家信息列表
			cDiscountList() {
				const data = this.discountListRes.data || []
				return data.map(item => {
					return {
						id: item.id,
						// 店铺logo
						logo: this.$util.deepGet(item, 'logo.0.file_path') || '',
						// 地址
						address: item.address,
						// 距离
						distance: `距${item.width}km`,
						// 经纬度信息
						location: {
							name: item.name,
							address: item.address,
							longitude: item.lng,
							latitude: item.lat,
						},
						// 电话
						phone: item.mobile,
						// 标题
						title: item.business_name,
						// 描述
						desc: item.dis_info,
						// 折扣
						discount: item.vip_discount,
						// 在线买单id
						pay_online_business_id: item.pay_online_business_id,
					}
				})
			},
			// 专属特权
			cPrivilege() {
				return {
					imgSrc: this.$util.deepGet(this.memberInfoRes, 'memberSet.image_third.0.file_path') || '',
					link: ''
				}
			},
			// 广告的数据
			cAd() {
				const data = this.$util.deepGet(this.memberInfoRes, 'memberSet.advertisement') || {}
				return {
					imgSrc: this.$util.deepGet(data, 'img.0.file_path') || '',
					link: data.link || ''
				}
			},
			// 格式化的会员卡片的数据
			cMember() {
				const data = this.$util.deepGet(this.memberInfoRes, 'memberInfo') || {}
				// 是否开启了会员
				const isMember = data.is_member === 1
				// 会员卡类型，1:时长卡，2:次卡
				const type = this.$util.deepGet(this.memberInfoRes, 'memberSet.member_card_type')
				// 会员卡的背景图片
				let bgUrl = ''
				if (isMember) {
					bgUrl = this.$util.deepGet(this.memberInfoRes, 'memberSet.image_second.0.file_path') || this
						.getImageRoot('27.png')
				} else {
					bgUrl = this.$util.deepGet(this.memberInfoRes, 'memberSet.image_first.0.file_path') || this
						.getImageRoot('26.png')
				}
				return {
					isMember,
					avatar: data.avatarUrl,
					name: data.nickName,
					no: data.card_number,
					bgUrl,
					expire: data.card_end_time,
					expireVisible: isMember && type == 1,
					times: data.member_second_count || '-',
					timesVisible: isMember && type == 2,
					membersNum: this.$util.deepGet(this.memberInfoRes, 'memberSet.number') || 0,
					save: data.card_coupon_price || 0,
					explain: this.$util.deepGet(this.memberInfoRes, 'memberSet.explain') || '',
					mobile: data.mobile,
					buy_card_type: this.$util.deepGet(this.memberInfoRes, 'memberSet.buy_card_type')
				}
			},
			// 格式化的顶部tab的数据
			cTopCateData() {
				return [{
						id: 'drink',
						title: '免费喝酒',
						fetchListRes: this.fetchDrinkListRes,
						listRes: this.drinkListRes
					},
					{
						id: 'store',
						title: '商家信息',
						fetchListRes: this.fetchStoreListRes,
						listRes: this.storeListRes
					},
					{
						id: 'discount',
						title: '商家折扣',
						fetchListRes: this.fetchDiscountListRes,
						listRes: this.discountListRes
					},
					{
						id: 'goods',
						title: '周边商品',
						fetchListRes: this.fetchGoodsListRes,
						listRes: this.goodsListRes
					},
				]
			},
			// 当前选中的顶部分类的项
			cTopCateActiveItem() {
				return this.cTopCateData[this.topCateAvtive] || {}
			},
			// 二级分类
			cSubNavList() {
				return (this.circleRes || []).map((item) => ({
					id: item.circle_id || 'all',
					title: item.circle_name,
					value: item.circle_id
				}))
			},
			// 当前选中的二级分类
			cSubNavActiveItem() {
				return this.cSubNavList.find(item => item.id === this.subNavListActiveId) || {}
			},
			// 商品分类
			cGoodsCateList() {
				const list = (this.goodsCateRes || []).map((item) => ({
					id: item.category_id,
					title: item.name,
					value: item.category_id
				}))
				return [{
					id: 'all',
					title: '全部分类',
					value: ''
				}, ...list]
			},
			cGoodsCateActiveItem() {
				return this.cGoodsCateList.find(item => item.id === this.goodsCateActiveId) || {}
			}
		},
		watch: {
			cTopCateActiveItem(val) {
				if (val.listRes && !val.listRes.data.length && !val.listRes.isFetching) {
					console.log('请求数据')
					this.fetchTabListRes()
				}
			},
			cSubNavActiveItem() {
				this.fetchTabListRes({
					resetBeforeFetch: true
				})
			},
			cGoodsCateActiveItem() {
				this.fetchTabListRes({
					resetBeforeFetch: true
				})
			},
			memberInfoRes(val) {
				// 设置分享数据
				this.shareData = this.pageShareMixin_createShareData({
					title: this.$util.deepGet(val, 'setting.member_title') || '',
					desc: this.$util.deepGet(val, 'setting.member_describe') || '',
					imgUrl: this.$util.deepGet(val, 'setting.member_cover_image.0.file_path') || '',
				})
			},
			cSubNavList(val) {
				this.subNavListActiveId = val && val[0].id
			}
		},
		async onLoad(options) {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff",
			});
			this.options = options;
			try {
				await this.mainMixin_BeforeFetchPageData();
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#F8F8F8",
				});
				// 更新经纬度
				const location = await App.getLocation().catch(() => {}) || {}
				this.lat = location.latitude
				this.lng = location.longitude
				await Promise.all([
					this.fetchMemberInfoRes(),
					this.agentMixin_fetchLocationRes().catch(
						() => {}),
					this.fetchTabListRes().catch(
						() => {}),
					this.fetchCircleRes().catch(
						() => {}),
					this.fetchGoodsCateRes().catch(() => {})
				])
				App.hideLoading()
			} catch (e) {
				console.log("onLoad 报错", e);
				// TODO handle the exception
			}
		},
		async onPullDownRefresh() {
			try {
				await Promise.all([
					this.fetchMemberInfoRes(),
					this.fetchTabListRes({
						resetBeforeFetch: true
					}).catch(() => {})
				])
			} catch (e) {
				console.log('onPullDownRefresh 报错', e)
				// TODO handle the exception
			}
			uni.stopPullDownRefresh()
		},
		// 上拉加载
		onReachBottom() {
			if (this.cTopCateActiveItem.listRes && !this.cTopCateActiveItem
				.listRes.isFetching) {
				console.log('请求数据')
				this.fetchTabListRes().catch(() => {})
			}
		},
		methods: {
			// 跳转到店铺
			goStore(item) {
				App.navigationTo({
					url: `pages/subPages/store/index?bus_id=${item.bus_id}`
				})
			},
			goToStoreDetail({store_id,bus_id}) {
				if(store_id) {
					// 进新版详情页
					App.navigationTo({
						url: `pages/subPages/shopDetail/shopDetail?store_id=${store_id}&bus_id=${bus_id}`
					})
				}else {
					// 进老版详情页
					App.navigationTo({
						url: `pages/subPages/store/index?bus_id=${bus_id}`
					})
				}
				
			},
			handleNavGridItemClick(item) {
				this.navigationTo(item.link)
			},
			handleOpenMemberClick() {
				const card_type = this.cMember.isMember === 0 ? 2 : 1;
				const mobile = this.cMember.mobile;
				if (mobile === "0" || mobile === "") {
					App.showError('请前往【个人中心->设置】绑定手机号！', () => {
						this.navigationTo('pages/subPages/user/index')
					})
					return;
				}
				if (this.cMember.buy_card_type == "1") {
					App.navigationTo({
						url: `pages/subPages/member/memberpay/memberpay?card_type=${card_type}`
					});
				} else if (this.cMember.buy_card_type == "2") {
					App.navigationTo({
						url: 'pages/subPages/member/member_goods/member_goods'
					});
				}
			},
			handleRenewMemberClick() {
				const card_type = this.cMember.isMember === 0 ? 2 : 1;
				const mobile = this.cMember.mobile;
				if (mobile === "0" || mobile === "") {
					App.showError('请前往【个人中心->设置】绑定手机号！', () => {
						this.navigationTo('pages/subPages/user/index')
					})
					return;
				}
				if (this.cMember.buy_card_type == "1") {
					App.navigationTo({
						url: `pages/subPages/member/memberpay/memberpay?card_type=${card_type}`
					});
				} else if (this.cMember.buy_card_type == "2") {
					App.navigationTo({
						url: 'pages/subPages/member/member_goods/member_goods'
					});
				}
			},
			handleSearch(val) {
				this.search = val
				this.fetchTabListRes({
					query: val,
					resetBeforeFetch: true
				})
			},
			handleRuleClick() {
				this.descPopupVisible = true
			},
			async handleBtnGoClick(data) {
				// 如果正在请求或者不是以下操作 直接返回
				if (this.handleBtnGoClicking) {
					return
				}
				this.handleBtnGoClicking = true
				try {
					// 确认操作
					const modalRes = await uni.showModal({
						title: '提示',
						content: '请确认是否预约？'
					})
					if (modalRes[1].cancel) {
						this.handleBtnGoClicking = false
						return
					}
					uni.showLoading({
						title: '请稍候...',
						mask: true
					})
					// 请求接口
					const res = await App._postP('reservation.Reservation/userReservation', {
						...data.params,
						store_id: this.appointPopupTarget.id
					})
					uni.showToast({
						icon: 'none',
						title: '预约成功'
					})
					this.appointPopupVisible = false
					// 跳转到预约详情页面
					this.navigationTo(`pages/subPages/memberCenter/appointmentDetails?id=${res.data}`);
				} catch (e) {
					console.log(e)
				}
				this.handleBtnGoClicking = false
			},
			handleBtnAppointClick(item, index) {
				if (!this.cMember.isMember) {
					this.openMemberPopupVisible = true
					return
				}
				this.appointPopupTarget = item
				this.appointPopupVisible = true
			},
			// 顶部分类点击事件
			handleTopCateItemClick({
				index
			}) {

				this.topCateAvtive = index
			},
			// 二级分类点击事件
			handleSubNavListClick(item) {
				this.subNavListActiveId = item.id
			},
			// 二级分类点击事件
			handleGoodsCateListClick(item) {
				this.goodsCateActiveId = item.id
			},
			fetchTabListRes(...args) {
				if (this.cTopCateActiveItem && typeof this.cTopCateActiveItem.fetchListRes === 'function') {
					return this.cTopCateActiveItem.fetchListRes(...args).catch((e) => {
						console.log('fetchTabListRes', e)
					})
				}
			},
			// 请求免费喝酒列表的接口数据（分页）
			async fetchDrinkListRes({
				resetBeforeFetch = false
			} = {}) {
				console.log('fetchDrinkListRes', this.drinkListRes.hasMore)
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						console.log("重置数据");
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.drinkListRes = {
							...this.drinkListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false,
						};
					}
					// 如果没有更多就不必请求了
					if (!this.drinkListRes.hasMore) {
						return Promise.reject('没有更多了');
					}
					console.log('正在请求')
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.drinkListRes.isFetching = true;
					// 请求数据
					const res = await App._getP("reservation.Reservation/storeReservationList", {
						page: this.drinkListRes.page + 1,
						// 其他接口都是list_rows
						list_rows: this.drinkListRes.listRow,
						lng: this.lng,
						lat: this.lat,
						query: this.search,
						circle_id: this.cSubNavActiveItem.value
					});
					// 取得新的数据
					const newData = this.$util.deepGet(res, "data.data", []);
					// 判断是否有更多
					const hasMore = newData.length >= this.drinkListRes.listRow;
					// 设置新的数据
					// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
					if(resetBeforeFetch) {
						this.drinkListRes = {
							...this.drinkListRes,
							page: 1,
							data: newData,
							hasMore: true,
							isFetching: false,
						};
					}else {
						this.drinkListRes = {
							...this.drinkListRes,
							page: this.drinkListRes.page + 1,
							data: [...this.drinkListRes.data, ...newData],
							hasMore,
							isFetching: false,
						};
					}
				} catch (e) {
					this.drinkListRes.isFetching = false
					console.log('fetchDrinkListRes e', e)
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			// 请求商家信息列表的接口数据（分页）
			async fetchStoreListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						console.log("重置数据");
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.storeListRes = {
							...this.storeListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false,
						};
					}
					// 如果没有更多就不必请求了
					if (!this.storeListRes.hasMore) {
						return Promise.reject();
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.storeListRes.isFetching = true;
					// 请求数据
					const res = await App._getP("reservation.Reservation/busInfoList", {
						page: this.storeListRes.page + 1,
						// 其他接口都是list_rows
						list_rows: this.storeListRes.listRow,
						lng: this.lng,
						lat: this.lat,
						query: this.search,
						circle_id: this.cSubNavActiveItem.value
					});
					// 取得新的数据
					const newData = this.$util.deepGet(res, "data.data", []);
					// 判断是否有更多
					const hasMore = newData.length >= this.storeListRes.listRow;
					// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
					if(resetBeforeFetch) {
						this.storeListRes = {
							...this.storeListRes,
							page: 1,
							data: newData,
							hasMore: true,
							isFetching: false,
						};
					}else {
						this.storeListRes = {
							...this.storeListRes,
							page: this.storeListRes.page + 1,
							data: [...this.storeListRes.data, ...newData],
							hasMore,
							isFetching: false,
						};
					}
				} catch (e) {
					this.storeListRes.isFetching = false;
					console.log("ha", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			// 请求商圈折扣列表的接口数据（分页）
			async fetchDiscountListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						console.log("重置数据");
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.discountListRes = {
							...this.discountListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false,
							circle_id: this.cSubNavActiveItem.value
						};
					}
					// 如果没有更多就不必请求了
					if (!this.discountListRes.hasMore) {
						return Promise.reject();
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.discountListRes.isFetching = true;
					// 请求数据
					const res = await App._getP("reservation.Reservation/getPayOnlineBusList", {
						page: this.discountListRes.page + 1,
						// 其他接口都是list_rows
						list_rows: this.discountListRes.listRow,
						lng: this.lng,
						lat: this.lat,
						query: this.search,
						circle_id: this.cSubNavActiveItem.value
					});
					// 取得新的数据
					const newData = this.$util.deepGet(res, "data.data", []);
					// 判断是否有更多
					const hasMore = newData.length >= this.discountListRes.listRow;
					// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
					if(resetBeforeFetch) {
						this.discountListRes = {
							...this.discountListRes,
							page: 1,
							data: newData,
							hasMore: true,
							isFetching: false,
						};
					}else {
						this.discountListRes = {
							...this.discountListRes,
							page: this.discountListRes.page + 1,
							data: [...this.discountListRes.data, ...newData],
							hasMore,
							isFetching: false,
						};
					}
				} catch (e) {
					this.discountListRes.isFetching = false
					console.log("ha", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			async fetchGoodsListRes({
				resetBeforeFetch
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						console.log("重置数据");
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.goodsListRes = {
							...this.goodsListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false,
							circle_id: this.cSubNavActiveItem.value
						};
					}
					// 如果没有更多就不必请求了
					if (!this.goodsListRes.hasMore) {
						return Promise.reject();
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.goodsListRes.isFetching = true;
					// 请求数据
					const res = await App._getP("goods/lists", {
						page: this.goodsListRes.page + 1,
						// 其他接口都是list_rows
						list_rows: this.goodsListRes.listRow,
						lng: this.lng,
						lat: this.lat,
						search: this.search,
						isNeibor: 1,
						no_login: 1,
						category_id: this.goodsCateActiveId
					});
					// 取得新的数据
					const newData = this.$util.deepGet(res, "data.list.data", []);
					// 判断是否有更多
					const hasMore = newData.length >= this.goodsListRes.listRow;
					// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
					// 但如果前一个请求比后一个请求后返回，依然会出错
					if(resetBeforeFetch) {
						this.goodsListRes = {
							...this.goodsListRes,
							page: 1,
							data: newData,
							hasMore: true,
							isFetching: false,
						};
					}else {
						this.goodsListRes = {
							...this.goodsListRes,
							page: this.goodsListRes.page + 1,
							data: [...this.goodsListRes.data, ...newData],
							hasMore,
							isFetching: false,
						};
					}
				} catch (e) {
					this.goodsListRes.isFetching = false
					console.log("ha", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			// 请求详情的接口数据
			async fetchMemberInfoRes() {
				try {
					const res = await App._getP('member.Member/MemberInfo', {
						user_id: uni.getStorageSync('user_id'),
						no_login: 1
					})
					this.memberInfoRes = res.data || {}
					if (res.data.memberSet.member_card_type == 1) {
						// 跳转到版本页面
						App.navigationTo({
							url: 'pages/subPages/member/index/index',
							redirectTo: true
						})
						return {}
					}
				} catch (e) {
					console.log('fetchMemberInfoRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求商圈的接口数据
			async fetchCircleRes() {
				try {
					const res = await App._getP('reservation.Reservation/getMemberCircle', {})
					this.circleRes = res.data || []
				} catch (e) {
					console.log('fetchMemberInfoRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求商圈的接口数据
			async fetchGoodsCateRes() {
				try {
					const res = await App._getP('Category/getCateList', {})
					this.goodsCateRes = res.data || []
				} catch (e) {
					console.log('fetchGoodsCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-memberCenter {
		box-sizing: border-box;
		background-color: #F8F8F8;
		min-height: 100vh;
		padding-bottom: 100px;

		::v-deep .c-SearchHeader .u-search .u-content {
			border-radius: 20rpx !important;
		}

		::v-deep .nav-bar .select-nav-ft {
			font-size: 30rpx;
		}
	}

	.page-memberCenter__main {
		box-sizing: border-box;
		border-radius: 30rpx;
		background-color: #fff;
		margin-top: -20rpx;
		padding-top: 40rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.page-memberCenter__title {
		box-sizing: border-box;
		width: 342rpx;
		height: 43rpx;
		margin: 0 auto;
		font-size: 0;
		color: transparent;
		background-repeat: no-repeat;
		background-size: contain;
		background-image: url(./static/images/text-hyzsqy.png);
	}

	.page-memberCenter__ad {
		width: 690rpx;
		max-width: 100%;
		height: 100rpx;
		border-radius: 20rpx;
		margin: 20rpx auto;
	}

	.page-memberCenter__privilege {
		width: 690rpx;
		height: auto;
		max-width: 100%;
		margin: 20rpx auto;
		margin-top: 40rpx;
	}

	/* 二级选择器 */
	.radio-nav-list {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		padding: 0 30rpx 30rpx 30rpx;
		background-color: #fff;
	}

	.radio-nav-item {
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 100%;
		height: 54rpx;
		margin-right: 20rpx;
		padding: 0 16rpx;
		color: #333;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 10rpx;
		background-color: #F8F8F8;

		&.is-active {
			background-color: #FFD940;
			color: #333;
		}
	}

	/* 二级选择器 end */
</style>
