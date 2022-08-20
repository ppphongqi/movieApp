<template>
	<view class="festival-details">
		<view class="festival-details__header">
			<card-title title="活动详情" />
		</view>
		<view class="festival-details__content">
			<parse :html="html"></parse>
		</view>
	</view>
</template>

<script>
	import Parse from "@/components/threeComponents/jyf-Parser/index"
	import CardTitle from './CardTitle'
	export default {
		components: {
			CardTitle,
			Parse
		},
		props: {
			// 富文本详情
			html: {
				type: String,
				default: '哈哈哈'
			}
		},
		data() {
			return {
			}
		},
		computed: {
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.festival-details {
		width: 690rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.festival-details__header {
		position: relative;
	}
	.festival-details__content {
		padding: 20rpx 30rpx;
		padding-top: 0;
	}
	
</style>
