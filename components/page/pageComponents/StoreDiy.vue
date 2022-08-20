<template>
	<view class="c-StoreDiy app-card app-card--fluid">
		<!-- header -->
		<view class="c-StoreDiy__header app-flex app-flex--align-center">
			<view class="app-flex-item app-flex-item--1">
				<view class="c-StoreDiy__title" :style="{
					color: itemStyle.maincolor
				}">{{params.maintext}}</view>
				<view class="c-StoreDiy__subtitle" :style="{
					color: itemStyle.subcolor
				}">{{params.subtext}}</view>
			</view>
			<view class="app-flex-item">
				<view class="c-StoreDiy__header__btns">
					<view v-for="(item, index) in cHeaderBtnsData" :key="item.id" class="c-StoreDiy__header__btn"
						:class="{'is-active':index === headerBtnsActive}" @click="handleHeaderBtnsClick(item,index)">
						{{item.text}}
					</view>
				</view>
			</view>
		</view>
		<!-- header end -->
		<!-- 商圈列表 -->
		<scroll-view scroll-x="true" :scroll-into-view="cCateActiveItem.id">
			<view class="c-StoreDiy-cate app-flex--inline-flex">
				<view v-for="(item,index) in cCateList" :key="item.id" :id="item.id"
					class="app-flex-item c-StoreDiy-cate-item" :class="{'is-active':index === cateActive}"
					@click="handleCateItemClick(item,index)">
					{{item.text}}
				</view>
			</view>
		</scroll-view>
		<!-- 商圈列表 end -->
		<!-- 好店列表 -->
		<view class="c-StoreDiy-list">
			<view v-for="(item,index) in cStoreList" :key="item.id" class="c-storeDiy-item" @click="goToStoreDetail(item)">
				<view class="c-StoreDiy-card app-card app-card--fluid app-flex">
					<!-- left -->
					<view class="c-StoreDiy-card__left app-flex-item app-flex-item--shrink-0">
						<image class="c-StoreDiy-card__logo" :src="item.logo" mode="aspectFill"></image>
					</view>
					<!-- left end -->
					<!-- center -->
					<view class="app-flex-item app-flex-item--1">
						<view class="c-StoreDiy-card__title">{{item.title}}</view>
						<view class="app-flex app-flex--align-center">
							<view calss="app-flex-item">
								<u-rate inactive-icon="star-fill" :count="5" :value="item.score" inactive-color="#DBDBDB"
									active-color="#FFD940"></u-rate>
							</view>
							<view calss="app-flex-item c-StoreDiy-card__text">{{item.score}}分</view>
							<view v-if="item.perCapitaPrice" class="app-flex-item c-StoreDiy-card__text">￥{{item.perCapitaPrice}}/人</view>
							<view class="app-flex-item c-StoreDiy-card__text" style="margin-left: auto;">{{item.distance}}km</view>
						</view>
						<view class="app-flex app-flex--align-center m-top16">
							<view class="app-flex-item c-StoreDiy-card__text">{{item.sortName}}</view>
							<view class="app-flex-item c-StoreDiy-card__text">{{item.circleName}}</view>
							<view class="app-flex-item c-StoreDiy-card__text is-active" style="margin-left: auto;">{{item.businessStatus}}
							</view>
						</view>
						<view class="c-StoreDiy-card__comment m-top16">{{item.intro}}</view>
						<view v-if="item.offerInfo" class="app-flex app-flex--align-center m-top16">
							<view class="c-StoreDiy-card__label app-flex-item app-flex-item--shrink-0">惠</view>
							<view class="app-flex-item c-StoreDiy-card__text">{{item.offerInfo}}</view>
						</view>
					</view>
					<!-- center end -->
				</view>
			</view>
		</view>
		<!-- 好店列表 end -->
		<!-- 查看更多按钮 -->
		<button class="c-StoreDiy__btn-more btn-normal" @click="navigationTo('pages/subPages/goodshop/goodshop')">查看更多</button>
		<!-- 查看更多按钮 end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	export default {
		props: {
			// 原始的接口数据(兼容以前组件的处理方式，所以这里只用传原始数据)
			params: {
			    type: Object,
			    default() {
			        return {}
			    }
			},
			// 商品列表
			itemData: {
			    type: Array,
			    default() {
			        return []
			    }
			},
			// 各元素的样式
			itemStyle: {
			    type: Object,
			    default() {
			        return {}
			    }
			}
		},
		data() {
			return {
				// 当前headers部分单选按钮选中项的索引
				headerBtnsActive: 0,
				// 当前选中商圈的索引
				cateActive: 0,
				// 门店的列表数据（只取前4个）
				storeListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					listRow: 4,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false
				},
				// 当前经纬度
				location: null
			}
		},
		computed: {
			cHeaderBtnsData() {
				return [{
					id: 'new',
					text: '最新'
				}, {
					id: 'nearby',
					text: '附近'
				}, ]
			},
			// 商圈列表
			cCateList() {
				const list = this.$store.state.storeDiy.cateListRes || []
				return list.map(item => ({
					id: item.circle_id,
					text: item.circle_name,
				}))
			},
			// 当前选中的商圈项
			cCateActiveItem() {

				return this.cCateList[this.cateActive] || {}
			},
			// 好店列表
			cStoreList() {
				const list = this.storeListRes.data || []
				console.log('cStoreList list',list)
				return list.map((item, index) => {
					return {
						id: item.id,
						busId: item.bus_id,
						storeId: item.store_id,
						title: item.name,
						logo: this.$util.deepGet(item,'image.file_path',''),
						// 评分
						score: item.store_score,
						// 人均
						perCapitaPrice: +item.per_capita || 0,
						// 距离km
						distance: item.width,
						// sort_name
						sortName: item.sort_name,
						// circle_name
						circleName: item.circle_name,
						// 营业状态
						businessStatus: item.week==1?'今日营业':'暂停营业',
						// 描述
						intro: item.store_introduce || item.describe,
						// 优惠信息
						offerInfo: item.dis_info
					}
				})
			},
			// 当这些值改变时 请求门店列表
			fetchStoreListResTrigger() {
				const trigger = {
					isNeibor: this.headerBtnsActive === 0 ? 1 : 2,
					recommend: this.headerBtnsActive === 1 ? 1 : 2,
					circle_id: this.cCateActiveItem.id
				}
				return JSON.stringify(trigger)
			}
		},
		watch: {
			fetchStoreListResTrigger(val) {
				const trigger = JSON.parse(val)
				if(trigger.circle_id !== undefined) {
					this.fetchStoreListRes({
						resetBeforeFetch: true
					})
				}
			}
		},
		mounted() {
			this.$store.dispatch('storeDiy/fetchCateListResIfNeeded')
		},
		methods: {
			/**
			 * 去店铺详情
			 */
			goToStoreDetail({storeId,busId}) {
				console.log('goToStoreDetail',{storeId,busId})
				if(storeId) {
					// 进新版详情页
					App.navigationTo({
						url: `pages/subPages/shopDetail/shopDetail?store_id=${storeId}&bus_id=${busId}`
					})
				}else {
					// 进老版详情页
					App.navigationTo({
						url: `pages/subPages/store/index?bus_id=${busId}`
					})
				}
				
			},
			// header部分单选按点击切换事件
			handleHeaderBtnsClick(item, index) {
				this.headerBtnsActive = index
			},
			// 商圈项点击事件
			handleCateItemClick(item, index) {
				this.cateActive = index
			},
			// 请求店铺列表的分页接口数据（注意业务中店铺列表不用分页）
			async fetchStoreListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					if (!this.location) {
						this.location = await App.getLocation()
					}
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch || !this.cTopCateActiveItem.id) {
						console.log('重置数据')
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.storeListRes = {
							...this.storeListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false
						}
					}
					// 如果没有更多就不必请求了
					if (!this.storeListRes.hasMore) {
						return Promise.reject()
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.storeListRes.isFetching = true
					// 请求数据
					const res = await App._getP('Business/storeInfo', {
						page: this.storeListRes.page + 1,
						// 其他接口都是list_rows
						list_rows: this.storeListRes.listRow,
						lng: this.location.longitude,
						lat: this.location.latitude,
						isNeibor: this.headerBtnsActive === 0 ? 1 : 2,
						recommend: this.headerBtnsActive === 1 ? 1 : 2,
						circle_id: this.cCateActiveItem.id
					})
					// 取得新的数据
					const newData = this.$util.deepGet(res, 'data.data', [])
					// 判断是否有更多
					const hasMore = newData.length >= this.storeListRes.listRow
					// 设置新的数据
					this.storeListRes = {
						...this.storeListRes,
						page: this.storeListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.storeListRes.data.concat(newData),
						hasMore,
						isFetching: false
					}
					console.log('this.storeListRes11111111111', this.storeListRes.data[0], res)
				} catch (e) {
					console.log('ha', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-StoreDiy {
		margin-top: 0;
		margin-bottom: 0;
	}

	.c-StoreDiy__title {
		box-sizing: border-box;
		position: relative;
		display: inline-block;
		max-width: 440rpx;
		padding-right: 16rpx;
		// #ifdef MP
		font-weight: bold;
		// #endif
		// #ifdef H5
		font-weight: 500;
		// #endif
		font-size: 40rpx;
		color: #333333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		&::after {
			position: relative;
			top: 4rpx;
			display: inline-block;
			margin-left: 8rpx;
			content: '\20';
			width: 0;
			height: 0;
			border-bottom: 18rpx solid var(--theme-color, #FFD940);
			border-left: 18rpx solid transparent;

			.is-header-type-2 & {
				display: none;
			}
		}
	}

	.c-StoreDiy__subtitle {
		margin-top: 2rpx;
		font-size: 24rpx;
		color: #999;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.c-StoreDiy__header__btns {
		display: flex;
		align-items: center;
	}

	.c-StoreDiy__header__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		height: 50rpx;
		min-width: 90rpx;
		padding: 0 8rpx;
		font-size: 24rpx;
		color: var(--auxiliary-color, #333333);
		border: 1px solid var(--theme-color, #FFD940);

		&.is-active {
			background-color: var(--theme-color, #FFD940);
		}
	}

	.c-StoreDiy-cate {
		padding: 10rpx 0;
	}

	.c-StoreDiy-cate-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40rpx;
		padding: 0 16rpx;
		border-radius: 9999rpx;
		font-size: 24rpx;
		white-space: nowrap;
		color: var(--auxiliary-color, #333333);
		background-color: #EEEEEE;

		&.is-active {
			background-color: var(--theme-color, #FFD940);
		}
	}

	.c-StoreDiy__btn-more {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		font-size: 26rpx;
		color: #999999;
		border: 1px solid currentColor;
		border-radius: 10rpx;
		margin-top: 16rpx;
	}

	.c-StoreDiy-card__left {
		border-radius: 10rpx;
		overflow: hidden;
	}

	.c-StoreDiy-card__logo {
		width: 150rpx;
		height: 150rpx;
	}

	.c-StoreDiy-card__title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 8rpx;
	}

	.c-StoreDiy-card__text {
		font-size: 24rpx;
		color: #666;

		&.is-active {
			color: #F28243;
		}
	}

	.c-StoreDiy-card__comment {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		max-width: 100%;
		padding: 4rpx 8rpx;
		font-size: 20rpx;
		color: #F28243;
		border-radius: 9999rpx 9999rpx 9999rpx 0rpx;
		background-color: #FFF4EE;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.c-StoreDiy-card__label {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4rpx;
		font-size: 20rpx;
		color: #fff;
		background-color: #F28243;
		border-radius: 4rpx;
		line-height: 1;
	}
</style>
