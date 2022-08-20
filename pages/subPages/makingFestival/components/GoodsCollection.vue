<template>
	<view class="goods-collection" :style="cContainerStyleStr">
		<blessing-activity-nav v-if="navListData.length" v-model="activeNavId" :listData="navListData" />
		<goods-card-swiper
			:activeIndex="swiperActiveIndex"
			:goodsStyle="goodsStyle"
			:listData="listData"
			:autoChunk="autoChunk"
			:chunkSize="chunkSize"
			 @on-change="handleSwiperChange"/>
	</view>
</template>

<script>
import BlessingActivityNav from './BlessingActivityNav.vue'
import GoodsRowList from './GoodsRowList.vue'
import GoodsCardSwiper from './GoodsCardSwiper.vue'

export default {
    props: {
        // 背景图片地址
        bgImgUrl: {
            type: String,
            default: 'http://placekitten.com/690/200'
        },
		// 商品列表的类型row=单行列表的样式，card=卡片的样式
		goodsStyle: {
			type: String,
			default: 'card'
		},
		// 导航的数据
		navListData: {
			type: Array,
			default() {
				return []
			}
		},
		// 商品列表数据
		listData: {
			type: Array,
			default() {
				// return (new Array(15)).fill(1).map((item,index)=>({
				// 	_id: `goods_${index}`,
				// 	imgUrl: 'http://placekitten.com/200/200',
				// 	label: '秒杀',
				// 	title: '哈哈ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD哈哈',
				// 	priceStr: '0000.00',
				// 	priceDelStr: '0.00'
				// }))
				return []
			}
		},
		// 是否自动分块
		autoChunk: {
			type: Boolean,
			default: true
		},
		// 自动分块大小
		chunkSize: {
			type: Number,
			default: 4
		}
    },
	components: {
		BlessingActivityNav,
		GoodsRowList,
		GoodsCardSwiper
	},
	data() {
		return {
			activeNavId: '',
			swiperActiveIndex: 0
		}
	},
	computed: {
		// 最外层容器的样式字符串
		cContainerStyleStr() {
			let styleStr = ''
			// 背景图片
			if(this.bgImgUrl) {
				styleStr += `background-image:url(${this.bgImgUrl})`
			}
			return styleStr
		},
	},
	watch: {
		activeNavId(val,oldVal){
			// 监听导航的变化 并且有必要的时候把swiper定位到正确的位置
			if(!this.autoChunk && val !== oldVal) {
				const index = this.listData.findIndex(item=>item.find(subItem=>subItem.targetNavId === val))
				this.swiperActiveIndex = index
				console.log('监听导航的变化 并且有必要的时候把swiper定位到正确的位置',this.swiperActiveIndex)
			}
		}
	},
	methods: {
		// swiper的change事件
		handleSwiperChange(index) {.0.targetNavId
			// 更新导航的激活项
			this.activeNavId = this.$util.deepGet(this.listData,`${index}.0.targetNavId`)
		},
		// 滚动到指定的内容

	}
}
</script>

<style lang="scss" scoped>
	.goods-collection {
		box-sizing: border-box;
		width: 690rpx;
		margin: 20rpx auto;
		padding: 20rpx 30rpx;
		padding-top: 110rpx;
		background-position: center top;
		background-size: 100% 168rpx;
		background-repeat: no-repeat;
		background-color: #fff;
		border-radius: 10rpx;
	}
</style>
