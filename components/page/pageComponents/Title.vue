<template>
	<view>
		<view class="content-title dis-flex b-f" :class="displayClass" :style="{'padding':itemStyle.margincol+'px '+itemStyle.marginrow+'px'}">
			<block v-if="itemStyle.display === '1'">
				<view class="content-title-left">
					<view class="content-title-main f-40" :style="{'color':itemStyle.maincolor}">{{params.maintext}}
						<view class="title-icon"></view>
					</view>
					<view class="content-title-minor f-24" :style="{'color':itemStyle.subcolor}">{{params.subtext}}</view>
				</view>
				<view class="content-title-right dis-flex flex-y-center" v-if="params.showmore === '1'" :style="{'color':itemStyle.morecolor}">
					<view class="f-28 t-c" @click="navigationTo(params.link)" style="width:4.2em;">查看更多</view>
					<view class="iconfont icon-jinrujiantou1 f-32"></view>
				</view>
			</block>
			<block v-if="itemStyle.display === '2'">
				<view class="content-title-main f-40" :style="{'color':itemStyle.maincolor}">{{params.maintext}}</view>
				<view class="content-title-minor f-24 m-left12" :style="{'color':itemStyle.subcolor}">{{params.subtext}}</view>
			</block>
			<block v-if="itemStyle.display === '3'">
				<view class="content-title-main dis-flex flex-x-around flex-y-center">
					<text class="text"></text>
					<view class="f-44" :style="{'color':itemStyle.maincolor}">{{params.maintext}}</view>
					<text class="text"></text>
				</view>
				<view class="content-title-minor f-24" :style="{'color':itemStyle.subcolor}">{{params.subtext}}</view>
			</block>
		</view>
		<!-- <block v-if="itemStyle.display === '2'">
			<view class="content-title dis-flex flex-y-end b-f">
				<view class="content-title-main f-30 col-3 f-w" :style="{'color':itemStyle.maincolor}">{{params.maintext}}</view>
				<view class="content-title-minor f-24 col-9 m-left12" :style="{'color':itemStyle.subcolor}">{{params.subtext}}</view>
			</view>
		</block> -->
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
			params: Object
		},
		components: {

		},
		computed: {
			displayClass() {
				let display = this.itemStyle.display;
				return display === "1" ? "flex-x-between flex-y-center" : display === "3" ?
					"flex-dir-column flex-x-center flex-y-center" : "flex-y-line"
			}
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

<style lang="less">
	.content-title {
		/* padding: 20upx 30upx; */
	}

	.content-title-main {
		font-weight: 600;
	}

	.title-icon {
		display: inline-block;
		width: 0;
		height: 0;
		border: 10upx solid;
		border-color: transparent var(--theme-color) var(--theme-color) transparent;
		margin-left: 12upx;
		vertical-align: bottom;
		position: relative;
		top: -12upx;
	}

	.content-title-right .iconfont {
		font-size: 36upx;
		height: 1em;
		line-height: 1em;
	}

	.flex-dir-column .content-title-main .text {
		display: inline-block;
		width: 10upx;
		height: 10upx;
		border-radius: 50%;
		background: #FFD940;
		background: var(--theme-color);
		border: 2upx solid transparent;
		position: relative;
		margin: 0 30upx;
	}

	.flex-dir-column .content-title-main .text::after {
		content: " ";
		position: absolute;
		top: -4upx;
		left: -4upx;
		width: 10upx;
		height: 10upx;
		border: 2upx solid #333333;
		border-radius: 50%;
	}
</style>
