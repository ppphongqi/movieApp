<template>
	<view class="goods-card-wrapper">
		<swiper
			class="goods-card-swiper"
			:class="{'is-lt-1':cListData.length > 1,'is-row':goodsStyle === 'row','is-card':goodsStyle === 'card'}"
			:style="{height: `${swiperHeight || 150}px`}"
			:current="swiperCurrent"
			@change="handleSwiperChange"
			:next-margin="cListData.length > 1 && goodsStyle === 'card' ? '30rpx' : 0">
			<swiper-item
				v-for="(item,index) in cListData"
				:key="index"
				class="goods-card-swiper-item" 
				:class="{'is-active': index === swiperCurrent}">
				<view class="goods-card-list">
					<block v-if="goodsStyle === 'card'">
						<view v-for="goods in item" :key="goods._id" class="goods-card-item">
							<goods-card
								:source="goods._source"
								:imgUrl="goods.imgUrl"
								:label="goods.label"
								:title="goods.title"
								:priceDelStr="goods.priceDelStr"
								:priceStr="goods.priceStr"/>
						</view>
					</block>
					<block v-else-if="goodsStyle === 'row'">
						<goods-row-list :listData="item" />
					</block>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import GoodsCard from './GoodsCard.vue'
	import GoodsRowList from './GoodsRowList'
	export default {
		components: {
			GoodsCard,
			GoodsRowList
		},
		props: {
			// swiper的current 将会触发swiperCurrent变化
			activeIndex: {
				type: Number,
				default: 0
			},
			// 商品列表的类型row=单行列表的样式，card=卡片的样式
			goodsStyle: {
				type: String,
				default: 'card'
			},
			// 商品列表数据
			listData: {
				type: Array,
				default() {
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
		data() {
			return {
				// 容器的高度 用于动态指定容器的高度
				swiperHeight: 0,
				swiperCurrent: 0
			}
		},
		computed: {
			// 格式化的商品数据,分块
			cListData() {
				if(this.autoChunk) {
					return this.$util.chunk(this.listData, this.chunkSize)
				}else {
					return this.listData
				}
			},
		},
		watch: {
			activeIndex: {
				handler(val) {
					this.swiperCurrent = val
				},
				immediate: true
			}
		},
		mounted() {
			setTimeout(()=>{
				this.getListHeight()
			}, 200);
	
		},
		methods: {
			// swiper激活项改变时的事件
			handleSwiperChange(e) {
				this.swiperCurrent = e.detail.current
				this.$nextTick(()=>{
					this.getListHeight()
				})
				this.$emit('on-change',this.swiperCurrent)
			},
			// 得到列表的高度
			getListHeight() {
				const query = uni.createSelectorQuery().in(this);
				const ele = query.select('.goods-card-swiper-item.is-active .goods-card-list')
				ele.boundingClientRect(data => {
					this.swiperHeight = (data || {}).height || 300
					console.log('getListHeight this.swiperHeight', this.swiperHeight)
				}).exec();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-card-list {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		&::after {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			display: block;
			content: "";
			background-color: #fff;
			opacity: 0.3;
			transition: opacity .2s ease-in-out;
			z-index: 2;
			pointer-events: none;
		}
		.is-active &::after {
			opacity: 0;
		}
	}
	.goods-card-item {
		box-sizing: border-box;
		width: 305rpx;
	}
	.goods-card-swiper {
		&.is-lt-1 {
			.goods-card-item {
				width: 50%;
				padding-right: 30rpx;
			}
		}
		&.is-card {
			.goods-card-item:nth-child(n+3) {
				margin-top: 20rpx;
			}
		}
		&.is-row {
			.goods-card-list {
				display: block;
			}
		}
	}
</style>
