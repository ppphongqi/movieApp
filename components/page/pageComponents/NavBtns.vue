<template>
	<view>
		<!-- 导航组 -->
		<view class="diy-navBar" :style="{'background':itemStyle.bgcolor}">
			<view class="data-list" :class="['avg-sm-'+params.rowtype]">
				<block v-for="(dataItem,index) in itemData" :key="index">
					<view class="item-nav" @click="navigationTo(dataItem.link)">
						<view class="item-image">
							<image class="image" :style="{'border-radius':itemStyle.btnstyle === '1'?'0':itemStyle.btnstyle === '2'?'5px':'50%'}" :src="dataItem.thumb?dataItem.thumb:'/static/images/diypage/default_btns.png'"></image>
						</view>
						<view class="item-text f-24 onelist-hidden" :style="{'color':itemStyle.textcolor}">{{ dataItem.title }}</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {

			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemData: Array
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {

		},

		onShow() {

		},
		mounted() {

		},
		methods: {
		}
	}
</script>

<style>
	/* 导航组 */

	.diy-navBar .data-list::after {
		clear: both;
		content: " ";
		display: table;
	}

	.diy-navBar .item-nav {
		float: left;
		margin: 10px 0;
		text-align: center;
	}

	.diy-navBar .item-nav .item-image {
		margin-bottom: 4px;
		font-size: 0;
	}
	
	.diy-navBar .item-nav .item-image.btnstyle{
		
	}

	.diy-navBar .item-nav .image {
		width: 80upx;
		height: 80upx;
	}

	/* 分列布局 */

	.diy-navBar .avg-sm-1 .item-nav {
		width: 33.33333333%;
	}

	.diy-navBar .avg-sm-2 .item-nav {
		width: 25%;
	}

	.diy-navBar .avg-sm-3 .item-nav {
		width: 20%;
	}
</style>
