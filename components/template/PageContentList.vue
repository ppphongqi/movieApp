<template>
	<view class="contnet-list">
		<!-- <scroll-view :style="{'height':viewHeight+'px'}" @scrolltolower="bindDownLoad" scroll-y @scroll="onScroll" :scroll-into-view="intoView">
			<block v-for="(item,index) in listData" :key="index">
				<slot :contnetItem="item" :contnetIndex="index" name="listItem"></slot>
			</block>
		</scroll-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			// intoView: String,
			viewHeight: Number,
			listData: {
				type: Array,
				default: () => []
			},
		},
		components: {

		},
		computed: {

		},
		mounted() {

		},
		methods: {
			/**
			 * 上拉触底
			 */
			bindDownLoad() {

			},

			/**
			 * 滚动监听
			 */
			onScroll() {

			},
		}
	}
</script>

<style>

</style>
