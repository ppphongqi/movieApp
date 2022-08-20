<template>
	<view class="goods-row-list">
		<view v-for="item in listData" :key="item._id" class="goods-row-item">
			<goods-row
				:source="item._source"
				:imgUrl="item.imgUrl"
				:title="item.title"
				:priceDelStr="item.priceDelStr"
				:priceStr="item.priceStr"/>
		</view>
	</view>
</template>

<script>
	import GoodsRow from './GoodsRow.vue'
	export default {
		components: {
			GoodsRow
		},
		props: {
			// 商品列表数据
			listData: {
				type: Array,
				default() {
					return (new Array(5)).fill(1).map((item,index)=>({
						_id: `goods_${index}`,
						imgUrl: 'http://placekitten.com/200/200',
						title: '哈哈ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD哈哈',
						priceStr: '0000.00',
						priceDelStr: '0.00'
					}))
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-row-item {
		&+& {
			margin-top: 20rpx;
		}
	}
</style>
