<template>
	<view>
		<view class="diy-nav-list" :class="{'radius-list':itemStyle.radius === '2'}" :style="{'margin':itemStyle.margincol+'px '+itemStyle.marginrow+'px'}">
			<view class="diy-nav-item border-line border-bottom" hover-class="nav-item-hover" :class="{'item-icon':itemStyle.display === '1'}"
			 v-for="(item,index) in itemData" :key="index" @click="navClick(item,index)">
				<view class="diy-nav-item-icon" :style="{'background-image':'url('+(item.thumb?item.thumb:'/static/images/diypage/default_btns.png')+')'}"
				 v-if="itemStyle.display === '1'"></view>
				<view class="diy-nav-item-text">{{item.title}}</view>
				<view class="iconfont icon-jinrujiantou1"></view>
				<button v-if="item.params === 'auth'" open-type="openSetting" class="report-btn"></button>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				type: 1
			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			itemData: {
				type: Array,
				default: () => []
			},
			params: Object
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
			navClick(item, index) {
				console.log(item,'item=============')
				if (item.type === "click") {
					this.$emit("itemClick", {
						item,
						index
					})
				} else {
					
					this.navigationTo(item.link);
				}
			}
		}
	}
</script>

<style>
	.diy-nav-list {
		background: #FFFFFF;
		overflow: hidden;
	}

	.diy-nav-list.radius-list {
		border-radius: 6upx;
	}

	.diy-nav-list .diy-nav-item {
		padding: 30upx 30upx;
		display: flex;
		align-items: center;
		font-size: 28upx;
		color: #333;
		box-sizing: border-box;
		position: relative;
	}

	.nav-item-hover {
		background-color: #ECECEC;
		padding: 10upx 0;
	}

	.diy-nav-list .diy-nav-item .iconfont {
		font-size: 42upx;
		color: #C8C8CD;
		margin-right: -16upx;
	}

	.diy-nav-list .diy-nav-item:last-child::before {
		content: none;
	}


	.diy-nav-list .diy-nav-item .diy-nav-item-icon {
		width: 50upx;
		height: 50upx;
		display: block;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		margin-right: 20upx;
	}

	.diy-nav-list .diy-nav-item .diy-nav-item-text {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.diy-nav-list .diy-nav-item .icon-jinrujiantou1 {
		font-size: 30upx;
		height: 1em;
		line-height: 1em;
		width: 1em;
	}
</style>
