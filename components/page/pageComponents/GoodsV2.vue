<template>
	<view class="goods-v2" :class="cGoodsV2ClassStr">
		<!-- header -->
		<view v-if="cRefsVisible.titleWrapperVisible" class="goods-v2-header" :style="cTitleData.styleStr">
			<view v-if="cRefsVisible.titleVisible" class="goods-v2-header__left">
				<view v-if="cTitleData.title" class="goods-header__title" :style="cTitleData.titleStyle">{{cTitleData.title}}</view>
				<view v-if="cRefsVisible.subTitleVisible" class="goods-header__subTitle" :style="cTitleData.subTitleStyle">{{cTitleData.subTitle}}</view>
			</view>
			<view class="goods-v2-header__right">
				<view v-if="cRefsVisible.btnNearby" class="goods-v2-header__btns">
					<view v-for="(item, index) in cHeaderBtnsData" :key="item.id" class="goods-v2-header__btn" :class="{'is-active':index === headerBtnsActive}"
					 :style="index === headerBtnsActive ? cTitleData.btnOptionStyleActive : cTitleData.btnOptionStyle" @click="handleHeaderBtnsClick(item,index)">{{item.text}}</view>
				</view>
				<view v-else-if="cRefsVisible.btnMore" class="goods-v2-header__more" :style="cTitleData.btnMoreStyleStr" @click="navigationTo(params.link)">更多<view
					 class="iconfont icon-right" :style="cTitleData.btnMoreStyleStr"></view>
				</view>
			</view>
		</view>
		<!-- header -->
		<!-- 广告位 -->
		<view v-if="cRefsVisible.adVisible" class="goods-v2-ad-wrapper" @click="navigationTo(cAdData.link)">
			<image class="goods-v2-ad" :src="cAdData.imgUrl" lazy-load></image>
		</view>
		<!-- 广告位 end -->
		<!-- 筛选条 -->
		<SortBar v-if="cRefsVisible.sortBar" :containerStyle="{'backgroundColor':'transparent'}" @on-item-click="handleSortBarItemClick"></SortBar>
		<!-- 筛选条 end -->
		<!-- 商品列表 -->
		<view v-if="[1,2,3,4].indexOf(cGoodsType) !== -1" class="goods-v2-list">
			<!-- 商品项 -->
			<view class="goods-v2-item" v-for="item in cGoodsDataFinal" :key="item.id" @click="handleGoodsItemClick(item._source)">
				<view class="goods-v2-item__img-wrapper">
					<!-- 商品图 -->
					<image class="goods-v2-item__img" :src="item.imgUrl" lazy-load></image>
					<!-- 距离指示器 -->
					<view v-if="cRefsVisible.distanceVisible && item.distance" class="goods-v2-item__distance">{{item.distanceStr}}</view>
					<!--  赚多少钱 -->
					<view v-if="itemStyle.charges == '1' && item.priceEarnVisible && item.priceEarn>0" class="goods-v2-item__price-earn-v2 price-font-family">{{itemStyle.commission}}:¥{{item.priceEarn}}</view>
					<!-- 已售罄 -->
					<view v-if="item.saleOut" class="goods-v2-item__sale-out-wrapper">
						<image class="good-v2-item__img-sale-out" :src="getImageRoot('86.png')" mode="widthFix"></image>
					</view>
				</view>
				<view class="goods-v2-item__content">
					<!-- 标题 -->
					<view v-if="cRefsVisible.goodsTitleVisible" class="goods-v2-item__title">
						<!-- 会员标签 -->
						<!-- 						<view v-if="cRefsVisible.labelMember && item.priceMemberVisible" class="goods-v2-item__member m-right12">
							<view class="goods-v2-item__member-name">{{memberDiyFont.member_font}}</view>{{memberDiyFont.discount_font}}¥{{item.priceMemberSave}}
						</view> -->
						<!-- 推荐标签 -->
						<view v-if="cRefsVisible.labelRecommend" class="goods-v2-item__label-recommend">{{item.iconText}}</view>{{item.name}}
					</view>
					<view class="goods-v2-handle-wrapper">
						<view class="goods-v2-price-wrapper__left">
							<!-- 会员标签 -->
							<view v-if="cRefsVisible.labelMemberInHandle && item.priceMemberVisible" class="goods-v2-item__member">
								<view class="goods-v2-item__member-name">{{memberDiyFont.member_font}}</view>{{memberDiyFont.discount_font}}¥{{item.priceMemberSave}}
							</view>
							<!-- 赚多少钱 -->
							<!-- <view v-if="cRefsVisible.priceEarnUpper  && itemStyle.charges == '1' && item.priceEarn>0" class="goods-v2-item__price-earn">{{itemStyle.commission}}:¥{{item.priceEarn}}</view> -->
							<view class="goods-v2-price-row">
								<!-- 原价 -->
								<view class="goods-v2-price  price-font-family">￥<view class="goods-v2-price_num">{{item.price}}</view>
								</view>
								<!-- 阶梯价 -->	
								<view v-if="item.is_step_price === 1" class="f-18" style="color: #FF4444; position: relative;top: 1rpx;">起</view>
								<!-- 划线价 -->
								<view v-if="cRefsVisible.priceLineVisible && itemStyle.line_price === '2'" class="goods-v2-price is-del m-left12 price-font-family">￥<view
									 class="goods-v2-price_num">{{item.priceLine}}</view>
								</view>
								<!-- 赚多少钱 -->
								<!-- <view v-if="cRefsVisible.priceEarnAfter  && itemStyle.charges == '1' && item.priceEarn>0" class="goods-v2-item__price-earn m-left12" style="transform: translateY(-4rpx);">{{itemStyle.commission}}:¥{{item.priceEarn}}</view> -->
							</view>
						</view>
						<view class="goods-v2-price-wrapper__right">
							<!-- 销售数量 -->
							<view v-if="cRefsVisible.textSales && itemStyle.goods_sales === '2'" class="goods-v2-item__sales">已售{{item.sales}}</view>
							<!-- 购买按钮 -->
							<view v-if="cRefsVisible.btnBuy" class="goods-v2-item__btn-buy m-top12">{{item.btntext}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 商品项 end -->
		</view>
		<!-- 商品列表 end -->
		<!-- 水平滚动的商品列表 -->
		<scroll-view v-else class="goods-v2-list-scroll" scroll-x>
			<view class="goods-v2-list">
				<!-- 商品项 -->
				<view class="goods-v2-item" v-for="item in cGoodsDataFinal" :key="item.id" @click="handleGoodsItemClick(item._source)">
					<view class="goods-v2-item__img-wrapper">
						<!-- 商品图 -->
						<image class="goods-v2-item__img" :src="item.imgUrl" lazy-load></image>
						<!-- 距离指示器 -->
						<view v-if="cRefsVisible.distanceVisible && item.distance" class="goods-v2-item__distance">{{item.distanceStr}}</view>
						<!--  赚多少钱 -->
						<view v-if="itemStyle.charges == '1' && item.priceEarnVisible && item.priceEarn" class="goods-v2-item__price-earn-v2 price-font-family">{{itemStyle.commission}}:¥{{item.priceEarn}}</view>
						<!-- 已售罄 -->
						<view v-if="item.saleOut" class="goods-v2-item__sale-out-wrapper">
							<image class="good-v2-item__img-sale-out" :src="getImageRoot('86.png')" mode="heightFix"></image>
						</view>
					</view>
					<view class="goods-v2-item__content">
						<!-- 标题 -->
						<view v-if="cRefsVisible.goodsTitleVisible" class="goods-v2-item__title">
							<view v-if="cRefsVisible.labelRecommend" class="goods-v2-item__label-recommend">{{item.iconText}}</view>{{item.name}}
						</view>
						<view class="goods-v2-handle-wrapper">
							<view class="goods-v2-price-wrapper__left">
								<!-- 会员标签 -->
								<view v-if="cRefsVisible.labelMemberInHandle && item.priceMemberVisible" class="goods-v2-item__member">
									<view class="goods-v2-item__member-name">{{memberDiyFont.member_font}}</view>{{memberDiyFont.discount_font}}¥{{item.priceMemberSave}}
								</view>
								<!-- 赚多少钱 -->
								<!-- <view v-if="cRefsVisible.priceEarnUpper  && itemStyle.charges == '1' && item.priceEarn>0" class="goods-v2-item__price-earn">{{itemStyle.commission}}:¥{{item.priceEarn}}</view> -->
								<view class="goods-v2-price-row">
									<!-- 原价 -->
									<view class="goods-v2-price  price-font-family">￥<view class="goods-v2-price_num">{{item.price}}</view>
									</view>
									<!-- 划线价 -->
									<view v-if="cRefsVisible.priceLineVisible && itemStyle.line_price === '2'" class="goods-v2-price is-del m-left12 price-font-family">￥<view
										 class="goods-v2-price_num">{{item.priceLine}}</view>
									</view>
								</view>
							</view>
							<view class="goods-v2-price-wrapper__right">
								<!-- 销售数量 -->
								<view class="goods-v2-item__sales" v-if="cRefsVisible.textSales && itemStyle.goods_sales === '2'">已售{{item.sales}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 商品项 end -->
			</view>
		</scroll-view>
		<!-- 水平滚动的商品列表 end -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import SortBar from '@/components/page/pageComponents/SortBar.vue'

// 商品列表样式映射
const GOODS_LIST_TYPE = {
    // 大一列的样式
    COL1: 1,
    // 小一列的样式
    'COL1--S': 4,
    // 两列的样式
    COL2: 2,
    // 三列的样式
    COL3: 3,
    // 水平滚动的商品列表样式
    SCROLL: 5
}

export default {
	components: {SortBar},
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
            // 当前headers部分需要的单选按钮组
            headerBtnsData: [
                {
                    id: 'newest',
                    text: '最新'
                },
                {
                    id: 'nearby',
                    text: '附近'
                }
            ],
            // 当前headers部分单选按钮选中项的索引
            headerBtnsActive: 0,
			// 当前筛选条对应的值
			sortBarValue: {}
        }
    },
    computed: {
        // 当前headers部分需要的单选按钮组(根据后台字段排个先后)
        cHeaderBtnsData() {
            // 附近按钮在前还是在后 2在前 1在后
            const prior = this.$util.deepGet(this.params, 'prior', '1')
			// 最新按钮应该显示的文字
            const sortCustom = this.$util.deepGet(this.params, 'sortcustom', 'shelf_time')
            // 最新按钮应该显示的文字
            const sortCustomMap = {
                shelf_time: {
                    id: 'shelf_time',
                    text: '最新'
                },
                desc_price: {
                    id: 'desc_price',
                    text: '最新'
                },
                asc_price: {
                    id: 'asc_price',
                    text: '最新'
                },
                view_num: {
                    id: 'view_num',
                    text: '最新'
                },
                pay_num: {
                    id: 'pay_num',
                    text: '最新'
                },
                all: {
                    id: 'all',
                    text: '推荐'
                },
                sales: {
                    id: 'sales',
                    text: '最热'
                }
            }
            if (prior === '2') {
                return [
                    {
                        id: 'nearby',
                        text: '附近'
                    },
                    sortCustomMap[sortCustom]
                ]
            }
            return [
				sortCustomMap[sortCustom],
                {
                    id: 'nearby',
                    text: '附近'
                },
            ]
        },
        // 当前商品列表是否以附近顺序展示
        cSortGoodsByBearby() {
            const btn = this.cHeaderBtnsData[this.headerBtnsActive] || {}
            return btn.id === 'nearby'
        },
        // 商品列表的类型（对应的后台字段为style. ） 1:一列的样式，1-1:轮播，2:小一列的样式，3:两列的样式, 1-2:两列长方形样式，4:滚动列表，1-3滚动列表长方形样式，5：三列样式
        cGoodsType() {
            const display = this.itemStyle.display || '1'
            if (display === '1') {
                // 大一列的样式
                return GOODS_LIST_TYPE.COL1
            } else if (display === '2') {
                // 小一列的样式
                return GOODS_LIST_TYPE['COL1--S']
            } else if (display === '3' || display === '1-2') {
                // 两列的样式
                return GOODS_LIST_TYPE.COL2
            } else if (display === '5') {
                // 三列的样式
                return GOODS_LIST_TYPE.COL3
            } else if (display === '4' || display === '1-3') {
                // 可以滑动的样式
                return GOODS_LIST_TYPE.SCROLL
            } else if (display === '1-1') {
                // 轮播的样式（用不到这个组件，用的是老的组件）
                return GOODS_LIST_TYPE.COL1
            }
            // 默认的样式
            return GOODS_LIST_TYPE.COL1

        },
        // 标题的type，1:有主标题和副标题，2:只有主标题，3:背景图片标题
        cTitleType() {
            return this.$util.deepGet(this.params, 'titlestyle', '1')
        },
        /**
			 * 各元素是否显示 要根据style.display和其他字段进行综合判断显不显示
			 */
        cRefsVisible() {
            return {
                // 是否显示查看更多按钮
                btnMore: this.$util.deepGet(this.params, 'showmore') === '1',
                // 是否显示附近
                btnNearby: this.$util.deepGet(this.params, 'sortBar') !== '1' && this.$util.deepGet(this.params, 'newest') === '1',
				// 是否显示筛选条
				sortBar: this.$util.deepGet(this.params, 'sortBar') === '1',
                // 距离是否显示（且距离不能为空）（且附近按钮选中）
                distanceVisible: this.cSortGoodsByBearby && [
                    GOODS_LIST_TYPE.COL1,
                    GOODS_LIST_TYPE.COL2,
                    GOODS_LIST_TYPE.SCROLL,
                    GOODS_LIST_TYPE['COL1--S']
                ].indexOf(this.cGoodsType) !== -1 || this.$util.deepGet(this.itemStyle, 'distanceVisible') === '1',
                // 广告位是否显示
                adVisible: this.$util.deepGet(this.params, 'goodstitle') === '1' && +this.cTitleType !== 3 && this.cAdData.imgUrl &&
						this.$util.deepGet(this.params, 'advertisement') ===
						'1',
                // 整个标题是否显示
                titleWrapperVisible: this.$util.deepGet(this.params, 'goodstitle') === '1',
                // 文字标题是否显示（包括正副标题）（除了背景图片标题 都要要是文字标题）
                titleVisible: [
                    1,
                    2
                ].indexOf(+this.cTitleType) !== -1,
                // 是否显示副标题
                subTitleVisible: this.cTitleType === '1' && this.cTitleData.subTitle,
                // 购买按钮
                btnBuy: this.$util.deepGet(this.itemStyle, 'buybtn') === '1' && [
                    GOODS_LIST_TYPE.COL1,
                    GOODS_LIST_TYPE['COL1--S']
                ].
                    indexOf(this.cGoodsType) !== -1,
                // 已售数量（且后台开启了已售数量）
                textSales: [
                    GOODS_LIST_TYPE.COL1,
                    GOODS_LIST_TYPE.COL2,
                    GOODS_LIST_TYPE.SCROLL,
                    GOODS_LIST_TYPE['COL1--S']
                ].indexOf(this.cGoodsType) !== -1,
                // 标题里的推荐标签
                labelRecommend: this.$util.deepGet(this.itemStyle, 'icon') === '2',
                // 商品标题是否显示
                goodsTitleVisible: true,
                // 标题的会员标签(额外要求单个商品开启了会员价)
                labelMember: false,
                // 价格区域的会员标签(额外要求单个商品开启了会员价)
                labelMemberInHandle: [
                    GOODS_LIST_TYPE.COL1,
                    GOODS_LIST_TYPE.COL2,
                    GOODS_LIST_TYPE.SCROLL,
                    GOODS_LIST_TYPE['COL1--S']
                ].indexOf(this.cGoodsType) !== -1,
                // 划线价是否显示(额外要求单个商品开启了划线价)
                priceLineVisible: [
                    GOODS_LIST_TYPE.COL1,
                    GOODS_LIST_TYPE.COL2,
                    GOODS_LIST_TYPE.SCROLL,
                    GOODS_LIST_TYPE['COL1--S']
                ].indexOf(this.cGoodsType) !== -1,
                // 赚多少钱（在价格后面）(额外要求单个商品开启了赚多少钱)
                priceEarnAfter: [
                    GOODS_LIST_TYPE.COL1,
                    GOODS_LIST_TYPE['COL1--S'],
                    GOODS_LIST_TYPE.SCROLL
                ].indexOf(this.cGoodsType) !== -1,
                // 赚多少钱（在价格上面的）(额外要求单个商品开启了赚多少钱)
                priceEarnUpper: [
                    GOODS_LIST_TYPE.COL2,
                    GOODS_LIST_TYPE.SCROLL
                ].indexOf(this.cGoodsType) !== -1
            }
        },
        // 格式化的标题相关的数据
        cTitleData() {
            const obj = {
                // 标题的类型
                type: this.cTitleType,
                // 标题
                title: this.$util.deepGet(this.params, 'maintext', ''),
                // 副标题
                subTitle: this.$util.deepGet(this.params, 'subtext', ''),
                // 标题的背景（样式三有）
                styleStr: +this.cTitleType === 3 ? `background-image: url("${this.cAdData.imgUrl}");` : '',
                // 标题更多按钮的样式
                btnMoreStyleStr: +this.cTitleType === 3 ? `color: ${this.$util.deepGet(this.itemStyle, 'morecolor', '')};` : '',
                // 主标题样式
                titleStyle: `color: ${this.$util.deepGet(this.itemStyle, 'maincolor', '')};`,
                // 副标题样
                subTitleStyle: `color: ${this.$util.deepGet(this.itemStyle, 'subcolor', '')};`,
                //  单选按钮的选中样式
                btnOptionStyleActive: `color: ${this.$util.deepGet(this.itemStyle, 'selectcolor')};background-color: ${this.$util.deepGet(this.itemStyle, 'backgcolor')};border-color: ${this.$util.deepGet(this.itemStyle, 'backgcolor')};`,
                //  单选按钮的样式
                btnOptionStyle: `color: ${this.$util.deepGet(this.itemStyle, 'unselectcolor:')};background-color: ${this.$util.deepGet(this.itemStyle, 'unbackgcolor')};border-color: ${this.$util.deepGet(this.itemStyle, 'backgcolor')};`
            }
            return obj
        },
        // 格式化的广告位的相关数据
        cAdData() {
            const imgUrl = this.$util.deepGet(this.params, 'thumb.file_path', '')
            return {
                imgUrl: imgUrl === 'default_picture.png' ? '' : imgUrl,
                // 跳转地址
                link: this.$util.deepGet(this.params, 'adverlink', '')
            }
        },
        // 格式化的商品的相关数据
        cGoodsData() {
            return (this.itemData || []).map(item => ({
                // 原始数据，点击跳转会用到
                _source: item,
                id: item.goods_id,
                // 商品名称
                name: item.goods_name,
                // 商品图片
                imgUrl: item.goods_image,
                // 货币符号
                currency: this.$util.deepGet(this.settingData, 'currency', ''),
                // 商品显示价格
                price: item.goods_price,
				// 商品是否阶梯价
				is_step_price:item.is_step_price,
                // 商品显示划线价
                priceLine: item.line_price,
                // 会员省多少钱
                priceMemberSave: item.coupon_price,
                // 是否显示会员价
                priceMemberVisible: +item.is_member_price === 1,
                // 赚多少钱
                priceEarn: item.dealer_money,
                // 赚多少钱显不显示
                priceEarnVisible: item.dealer_tip,
                // 商品销量
                sales: item.goods_sales,
                // 距离多少千米
                distance: item.width || '',
                // 距离多少千米（要显示的文字）
                distanceStr: item.width && +item.width < 1 ? `${item.width * 1000}m` : `${item.width}km`,
                // 推荐标签的文字
                iconText: this.$util.deepGet(this.itemStyle, 'icontext', ''),
                // 收否已经售罄
                saleOut: +this.$util.deepGet(this.params, 'soldout', -1) === 1 && (item.stock_num || 0) <= 0,
                // 购买按钮的文字
                btntext: this.$util.deepGet(this.itemStyle, 'btntext', '')
            }))
        },
        // 按照附近排序的格式化的商品数据
        cGoodsDataSortedByNearby() {
            return [...this.cGoodsData].sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
        },
		// 当前筛选条对应的商品列表
		cGoodsSortBar() {
			// 最新降序
			if(this.sortBarValue.new === 'desc') {
				return this.cGoodsData
			}
			// 最新升序
			if(this.sortBarValue.new === 'asc') {
				return this.cGoodsData.reverse()
			}
			// 距离降序
			if(this.sortBarValue.distance === 'desc') {
				return this.cGoodsDataSortedByNearby.reverse()
			}
			// 距离升序
			if(this.sortBarValue.distance === 'asc') {
				return this.cGoodsDataSortedByNearby
			}
			// 价格降序
			if(this.sortBarValue.price === 'desc') {
				return [...this.cGoodsData].sort((a, b) => (b.price || Infinity) - (a.price || Infinity))
			}
			// 价格升序
			if(this.sortBarValue.price === 'desc') {
				return [...this.cGoodsData].sort((a, b) => (a.price || Infinity) - (b.price || Infinity)).reverse()
			}
			// 销量降序
			if(this.sortBarValue.sales === 'desc') {
				return [...this.cGoodsData].sort((a, b) => (b.sales || Infinity) - (a.sales || Infinity))
			}
			// 销量升序
			if(this.sortBarValue.sales === 'desc') {
				return [...this.cGoodsData].sort((a, b) => (a.sales || Infinity) - (b.sales || Infinity)).reverse()
			}
			return []
		},
        // 当前要显示的商品列表
        cGoodsDataFinal() {
			console.log('cGoodsDataFinal',this.cGoodsSortBar)
			if(this.cGoodsSortBar.length) {
				return this.cGoodsSortBar
			}
            return this.cSortGoodsByBearby ? this.cGoodsDataSortedByNearby : this.cGoodsData
        },
        // 最外层容器的classStr
        cGoodsV2ClassStr() {
            const display = this.itemStyle.display || '1'
            let str = ''
            // 是否没有整个标题
            str += this.cRefsVisible.titleWrapperVisible ? '' : ' is-no-header'
            // 标题的风格对应的
            str += ` is-header-type-${this.cTitleType}`
            // 商品列表的风格1：一列布局，2，两列布局
            str += ` is-goods-type-${this.cGoodsType}`
            // 商品图片是否是长方形（默认是正方形）
            str += [
                '1-2',
                '1-3'
            ].indexOf(display) !== -1 ? ' is-goods-rectangle' : ''
            // 是否有广告位
            str += this.cRefsVisible.adVisible ? ' has-ad' : ''
            return str
        }
    },
    methods: {
		// 筛选条点击事件
		handleSortBarItemClick({item,value}) {
			this.sortBarValue = value
		},
        // header部分单选按点击切换事件
        handleHeaderBtnsClick(item, index) {
            this.headerBtnsActive = index
        },
        // 商品项点击事件
        handleGoodsItemClick(goods) {
            // activity_type 1秒杀 2拼团
            const {
                goods_id,
                activity_type,
                spike_id,
                group_id,
                is_member_price
            } = goods
            const activityId = {
                '1': 'spike_id',
                '2': 'group_id',
                '4': 'bargain_id'
            }
            let goodsParams = {
                goods_id
            }
            if (activity_type !== 0) {
                goodsParams[activityId[activity_type]] = goods[activityId[activity_type]]
            } else if (is_member_price === 1) {
                goodsParams.goods_type = 'member_goods'
            }
            // console.log(goodsParams);
            goodsParams = this.$util.removeEmpty(goodsParams)
            App.navigationTo({
                url: 'pages/subPages/goods/index/index?' + App.urlEncode(goodsParams)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
	.goods-v2 {
		position: relative;
		box-sizing: border-box;
		padding: 0 30rpx;
		margin-top: 30rpx;
		margin-bottom: 30rpx;

		&.is-goods-type-3 {
			position: relative;
			width: 690rpx;
			margin: 30rpx auto;
			margin-top: 40rpx;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 0;

			&.has-ad {
				padding-top: 190rpx;
			}
		}

		&.is-goods-type-5 {
			padding: 0;
		}

		&.is-header-type-3 {
			position: relative;
			padding-top: 126rpx;
			margin-top: 40rpx;

			&.is-no-header {
				padding-top: 0;
			}
		}

		&.is-no-header {
			margin-top: 10rpx;
		}
	}

	// 商品列表头部
	.goods-v2-header {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 16rpx;
		padding-bottom: 26rpx;

		.is-header-type-1 & {
			padding-top: 6rpx;
			padding-bottom: 30rpx;
		}

		.is-header-type-2 & {
			padding-bottom: 30rpx;
		}

		.is-header-type-3 & {
			position: absolute;
			left: 30rpx;
			right: 30rpx;
			top: 0;
			padding: 0 30rpx;
			height: 150rpx;
			background-position: center;
			background-size: cover;
			background-repeat: no-repeat;
			border-top-right-radius: 6rpx;
			border-top-left-radius: 6rpx;
			z-index: 0;
			margin-top: 0;

			.goods-v2-header__right {
				padding-right: 0;
			}
		}

		.is-goods-type-5 & {
			padding-left: 30rpx;
			padding-right: 30rpx;
		}

		.is-goods-type-3 & {
			position: relative;
			z-index: 5;
			padding: 20rpx;
			background-color: #fff;
			border-top-right-radius: 6rpx;
			border-top-left-radius: 6rpx;
		}
	}

	.goods-v2-header__left {
		flex: 1;
		min-width: 0;
	}

	.goods-v2-header__right {
		margin-left: auto;
	}

	.goods-header__title {
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

		.is-header-type-2 & {
			position: relative;
			max-width: 400rpx;
			padding-right: 0;
			z-index: 1;
			overflow: visible;

			// background-image: linear-gradient(to right, var(--theme-color, #FFD940), var(--theme-color, #FFD940));
			// background-size: 400rpx 20rpx;
			// background-repeat: no-repeat;
			// background-position: 0 22rpx;
			&::before {
				position: absolute;
				left: 0;
				right: -16rpx;
				bottom: 6rpx;
				display: block;
				content: "\20";
				height: 20rpx;
				border-radius: 20rpx;
				background-color: var(--theme-color, #FFD940);
				z-index: -1;
			}
		}
	}

	.goods-header__subTitle {
		margin-top: 2rpx;
		font-size: 24rpx;
		color: #999;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.goods-v2-header__more {
		display: flex;
		align-items: center;
		padding: 16rpx 0;

		&,
		& .iconfont {
			line-height: 1;
			color: #999;
			font-size: 24rpx;
		}

		& .iconfont {
			margin-left: 10rpx;
			transform: translateY(-2rpx);
		}
	}

	.goods-v2-header__btns {
		display: flex;
		align-items: center;
	}

	.goods-v2-header__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		height: 50rpx;
		min-width: 90rpx;
		padding: 0 8rpx;
		font-size: 24rpx;
		color: #333;
		border: 1px solid #FFD940;

		&.is-active {
			background-color: #FFD940;
		}
	}

	// 商品列表头部 end
	// 广告
	.goods-v2-ad-wrapper {
		border-radius: 6rpx;

		.is-goods-type-3 & {
			position: absolute;
			left: -30rpx;
			right: -30rpx;
			top: 0;
			z-index: 0;
			border-radius: 0;
		}

		.is-goods-type-5 & {
			padding: 0 30rpx;
		}


	}

	.goods-v2-ad {
		width: 100%;
		height: 300rpx;
	}

	// 广告 end
	// 商品列表（一共有7种风格）
	.goods-v2-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.is-goods-type-3 & {
			position: relative;
			justify-content: flex-start;
			padding-left: 8rpx;
			padding-right: 8rpx;
			padding-bottom: 16rpx;
			z-index: 1;
			background-color: #fff;
		}

		.is-header-type-3 & {
			position: relative;
			z-index: 5;
			margin-top: -20rpx;
		}

		.is-no-header & {
			margin-top: 0;
		}
	}

	.goods-v2-item {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;

		.is-goods-type-1 & {
			width: 100%;
		}

		.is-goods-type-1 &+& {
			margin-top: 40rpx;
		}

		.is-goods-type-1.is-header-type-1 &,
		.is-goods-type-1.is-header-type-2 & {
			&:first-child {
				margin-top: 0;
			}
		}

		.is-goods-type-2 & {
			width: 335rpx;
		}


		.is-goods-type-3 & {
			box-sizing: border-box;
			width: 33.33333%;
			padding: 0 9rpx;
			margin-bottom: 8rpx;
		}

		.is-goods-type-4 & {
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
			padding: 20rpx;
		}

		.is-goods-type-5 & {
			min-height: 364rpx;
		}
	}

	.goods-v2-item__img-wrapper {
		position: relative;
		left: 0;
		top: 0;
		width: 100%;

		.is-goods-type-1 & {
			height: 388rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
			overflow: hidden;
		}

		.is-goods-type-2 & {
			height: 335rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
			overflow: hidden;
		}

		.is-goods-type-2.is-goods-rectangle & {
			height: 188rpx;
			overflow: hidden;
		}

		.is-goods-type-3 & {
			width: 206rpx;
			height: 206rpx;
			border-radius: 10rpx;
			overflow: hidden;
		}

		.is-goods-type-4 & {
			flex-shrink: 0;
			border-radius: 8rpx;
			width: 200rpx;
			height: 200rpx;
			overflow: hidden;
		}

		.is-goods-type-5 & {
			height: 324rpx;
			overflow: hidden;
		}
		.is-goods-type-5.is-goods-rectangle & {
			height: 188rpx;
			overflow: hidden;
		}
	}

	.goods-v2-item__img {
		width: 100%;
		height: 100%;

		// 必须单独设置圆角 否则在ios真机失效
		.is-goods-type-1 & {
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}

		.is-goods-type-2 & {
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}

		.is-goods-type-3 & {
			border-radius: 10rpx;
		}

		.is-goods-type-4 & {
			border-radius: 8rpx;
		}

		.is-goods-type-5 & {
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}
	}

	.goods-v2-item__price-earn-v2 {
		position: absolute;
		left: 0;
		top: 0;
		height: 34rpx;
		padding: 0 11rpx;
		line-height: 34rpx;
		font-size: 22rpx;
		color: #fff;
		white-space: nowrap;
		background: linear-gradient(-50deg, rgba(255, 68, 68, 0.9) 0%, rgba(253, 113, 55, 0.9) 100%);
		border-top-left-radius: 10rpx;
		border-bottom-right-radius: 14rpx;
		z-index: 5;

		.is-goods-type-4 & {
			border-top-left-radius: 8rpx;
		}
	}

	.goods-v2-item__distance {
		position: absolute;
		right: 0;
		bottom: 0;
		display: inline-flex;
		align-items: center;
		height: 40rpx;
		padding: 0 14rpx;
		font-size: 24rpx;
		color: #fff;
		background-color: rgba($color: #000000, $alpha: 0.3);
	}

	.goods-v2-item__content {
		flex: 1;
		box-sizing: border-box;
		// #ifdef MP-WEIXIN
		display: flex;
		flex-direction: column;
		// #endif
		padding: 10rpx;
		padding-bottom: 18rpx;

		.is-goods-type-1 & {
			padding-left: 18rpx;
			padding-right: 18rpx;
		}

		.is-goods-type-3 & {
			padding: 0;
		}

		.is-goods-type-4 & {
			flex: 1;
			width: 0;
			padding: 0;
			margin-left: 20rpx;
		}
	}

	.goods-v2-item__title {
		box-sizing: border-box;
		height: 2.8em;
		margin: 8rpx 0;
		color: #333;
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;

		.is-goods-type-1 & {
			display: block;
			height: initial;
		}

		.is-goods-type-3 & {
			margin-bottom: 16rpx;
		}

		.is-goods-type-4 & {
			margin-top: -8rpx;
		}
	}

	.goods-v2-item__label-recommend {
		display: inline-block;
		height: 28rpx;
		padding: 0 6rpx;
		margin-right: 4rpx;
		font-size: 20rpx;
		color: #333333;
		line-height: 28rpx;
		background-color: #F6D246;
		transform: translateY(-2rpx);
	}

	.goods-v2-handle-wrapper {
		box-sizing: border-box;
		display: flex;
		align-items: flex-end;
		padding-top: 0;
		margin-top: auto;
	}

	.goods-v2-item__member {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		height: 30rpx;
		padding-right: 9rpx;
		font-size: 20rpx;
		color: #fff;
		background-color: #333;
		border-radius: 4rpx;
		line-height: 30rpx;
	}

	.goods-v2-item__member-name {
		position: relative;
		color: #333;
		height: 100%;
		padding: 0 7rpx;
		margin-right: 16rpx;
		background-color: #EED196;
		border-top-left-radius: 4rpx;
		border-bottom-left-radius: 4rpx;

		&::after {
			position: absolute;
			top: 0;
			left: 100%;
			display: block;
			content: '\20';
			width: 0;
			height: 0;
			border-bottom: 30rpx solid #EED196;
			border-right: 8rpx solid transparent;
		}
	}

	.goods-v2-price-row {
		display: flex;
		align-items: center;
		line-height: 1;

		.goods-v2-item__member+& {
			margin-top: 16rpx;
		}
	}

	.goods-v2-price {
		display: flex;
		align-items: center;
		color: #FF4444;
		font-size: 28rpx;

		.is-goods-type-2 &,
		.is-goods-type-3 &,
		.is-goods-type-5 & {
			font-size: 24rpx;
		}

		&.is-del {
			color: #999;
			font-weight: normal;
			font-size: 24rpx;
			text-decoration: line-through;

			.goods-v2-price_num {
				transform: translateY(0);
				font-size: 1em;
			}
		}
	}

	.goods-v2-price_num {
		font-size: 1.286em;
	}

	.goods-v2-price-wrapper__right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-left: auto;
	}

	.goods-v2-price-wrapper__left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-right: auto;
	}

	.goods-v2-item__price-earn {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 28rpx;
		padding: 0 8rpx;
		font-size: 20rpx;
		color: #FF4444;
		border: 1px solid currentColor;
		border-radius: 4rpx;
		background-color: rgba($color: #FF4444, $alpha: 0.1);
	}

	.goods-v2-item__btn-buy {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 90rpx;
		height: 40rpx;
		padding: 0 8rpx;
		background-color: var(--theme-color,#FFD940);
		color: var(--auxiliary-color,#fff);
		font-size: 24rpx;
		border-radius: 2rpx;
	}

	.goods-v2-item__sales {
		font-size: 22rpx;
		color: #888;
		white-space: nowrap;
	}

	// 商品列表

	// 滚动的商品列表
	.goods-v2-list-scroll {
		display: block;
		width: 100%;

		.goods-v2-list {
			display: inline-flex;
			flex-wrap: nowrap;
			padding: 0 30rpx;
		}

		.goods-v2-item {
			display: inline-flex;
			width: 324rpx;

			&+.goods-v2-item {
				margin-left: 20rpx;
			}
		}
	}

	// 滚动的商品列表

	// 已售罄蒙层
	.goods-v2-item__sale-out-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .5);
		z-index: 9;
	}

	.good-v2-item__img-sale-out {
		height: 100rpx;

		.is-goods-type-1 & {
			width: 239rpx;
			height: 203rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}

		.is-goods-type-2 & {
			width: 170rpx;
			height: 143rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}

		.is-goods-type-2.is-goods-rectangle &,
		.is-goods-type-5.is-goods-rectangle & {
			width: 121rpx;
			height: 103rpx;
		}

		.is-goods-type-3 & {
			width: 121rpx;
			height: 103rpx;
			border-radius: 10rpx;
		}

		.is-goods-type-4 & {
			width: 121rpx;
			height: 103rpx;
			border-radius: 8rpx;
		}

		.is-goods-type-5 & {
			width: 170rpx;
			height: 143rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}
	}

	// 已售罄蒙层 end
</style>
