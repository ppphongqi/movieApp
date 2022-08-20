<template>
	<view class="page-aid-city">
		<!-- sticky header -->
		<u-sticky h5-nav-height="0" bg-color="#FFFFFF">
			<!-- 搜索 -->
			<view class="search-wrapper">
				<view class="search-wrapper__left">
					<view class="search-wrapper__icon-search iconfont icon-search"></view>
					<input class="search-wrapper__input" placeholder-class="is-placeholder" placeholder="输入城市名或拼音查询" type="text" />
				</view>
				<view class="search-wrapper__right" @click="handleBtnSearchClick">搜索</view>
			</view>
			<!-- 搜索 end -->
		</u-sticky>
		<!-- sticky header end -->
		<!-- 当前位置 -->
		<view class="cities-list">
			<view class="cities-list__header">
				当前位置
			</view>
			<view class="cities-list__content">
				<view class="cities-item is-active">
					<view class="cities-item__icon iconfont iconfont icon-dingweixiao"></view>
					<view class="cities-item__text">成都</view>
				</view>
			</view>
		</view>
		<!-- 当前位置 end -->
		<!-- 热门城市 -->
		<view class="cities-list">
			<view class="cities-list__header">
				{{cHotCitiesData.title}}
			</view>
			<view class="cities-list__content">
				<view v-for="item in cHotCitiesData.list" :key="item.id" class="cities-item">
					<view class="cities-item__text">{{item.name}}</view>
				</view>
			</view>
		</view>
		<!-- 热门城市 end -->
		<!-- 索引列表 -->
		<view class="index-list-wrapper">
			<u-index-list :scrollTop="scrollTop" :sticky="true" :offset-top="116" z-index="1" active-color="#FFD940">
				<view v-for="(item, index) in cIndexListData" :key="index">
					<u-index-anchor :index="item" />
					<view class="index-item">
						列表1
					</view>
					<view class="index-item">
						列表2
					</view>
					<view class="index-item">
						列表3
					</view>
				</view>
			</u-index-list>
		</view>
		<!-- 索引列表 end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0
			}
		},
		computed: {
			// 热门城市的数据（和接口字段保持一致）
			cHotCitiesData() {
				return {
					title: '热门城市',
					list: [{
							id: 510116,
							pid: 510100,
							name: '双流区',
							visible: 2,
							displayorder: 0,
							level: 3,
							lat: '30.57447',
							lng: '103.92377',
							pinyin: 'shuangliuqu',
							initial: 'S',
							agent_id: 152,
							only_id: '0cb4b18d21e5b70d2e7f5a97232119d8'
						},
						{
							id: 110108,
							pid: 110100,
							name: '海淀区',
							visible: 2,
							displayorder: 0,
							level: 3,
							lat: '39.95933',
							lng: '116.29845',
							pinyin: 'haidianqu',
							initial: 'H',
							agent_id: 155,
							only_id: '13f18566f5b274ffd3e224f3315989fc'
						},
						{
							id: 510117,
							pid: 510100,
							name: '郫都区',
							visible: 2,
							displayorder: 0,
							level: 3,
							lat: '30.79589',
							lng: '103.90256',
							pinyin: 'pidouqu',
							initial: 'P',
							agent_id: 154,
							only_id: '1d434b52bf16b1d87d927b10c4bef64e'
						},
						{
							id: 510114,
							pid: 510100,
							name: '新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区新都区',
							visible: 2,
							displayorder: 0,
							level: 3,
							lat: '30.82404',
							lng: '104.15801',
							pinyin: 'xinduqu',
							initial: 'X',
							agent_id: 153,
							only_id: '734d65ef5d47e24edc5366242e0416e5'
						}
					]
				}
			},
			// 索引列表的数据
			cIndexListData() {
				return [
					'A',
					'B',
					'C',
					'D',
					'E',
					'F',
					'G',
					'H',
					'I',
					'J',
					'K',
					'L',
					'M',
					'N',
					'O',
					'P',
					'Q',
					'R',
					'S',
					'T',
					'U',
					'V',
					'W',
					'X',
					'Y',
					'Z'
				]
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			handleBtnSearchClick() {
				console.log('点击了搜索按钮')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-aid-city {
		min-height: 100vh;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #fff;
	}

	.search-wrapper {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff;
	}

	.search-wrapper__left {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: 1;
		height: 76rpx;
		border-radius: 38rpx;
		background-color: #F6F6F6;
		padding: 0 30rpx;
	}

	.search-wrapper__icon-search {
		color: #959595;
	}

	.search-wrapper__input {
		flex: 1;
		margin-left: 20rpx;
		font-size: 26rpx;
		color: #333333;

		/deep/ {
			&.is-placeholder {
				color: #999999;
			}
		}
	}

	.search-wrapper__right {
		margin-left: 30rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #333;
	}

	// 城市列表
	.cities-list {
		box-sizing: boder-box;
		padding: 0 30rpx;
		margin-top: 30rpx;
	}

	.cities-list__header {
		font-size: 24rpx;
		color: #999999;
		margin-bottom: 18rpx;
	}

	.cities-list__content {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -15rpx;
	}

	.cities-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		min-width: 197rpx;
		max-width: 100%;
		margin: 15rpx;
		padding: 28rpx;
		height: 64rpx;
		font-size: 28rpx;
		color: #333333;
		border-radius: 32rpx;
		background-color: #F6F6F6;

		&.is-active {
			background-color: #FFD940;
		}
	}

	.cities-item__icon {
		margin-right: 10rpx;
	}

	.cities-item__text {
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	// 城市列表 end
	// 索引列表
	.index-list__content {
		box-sizing: border-box;
		padding: 0 30rpx;
	}
	.index-item {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 20rpx 24rpx;
		overflow: hidden;
		color: #333333;
		font-size: 28rpx;
		line-height: 48rpx;
		background-color: #fff;
		&+& {
			border-top: 1px solid #F0F0F0;
		}
	}

	.anchor-text {
		color: red;
	}

	// 索引列表end
</style>
