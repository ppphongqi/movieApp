<template>
	<view>
		<!-- 浮动按钮 -->
		<view class="diy-floatbtn-box dis-flex flex-dir-column col-f ts-3" :class="{'open': is_open,'ipx':isIphoneX}">
			<view class="layer" v-for="(item, index) in cItemData" :key="index">
				<view class="img-icon img-center" @click="handleItemClick(item)" :style="{'background-image':'url('+(item.thumb?item.thumb.file_path:'/static/images/diypage/default_btns.png')+')'}"></view>
				<view class="text onelist-hidden">{{item.text}}</view>
			</view>
			<view v-if="!visibleAlways" class="back" @click="toggle">
				<view class="tip dis-flex flex-y-center">
					<text class="iconfont" :class="{'icon-back': is_open, 'icon-right': !is_open}"></text>
					<text v-if="is_open">返回</text>
					<view v-if="!is_open" class="dis-flex flex-dir-column" style="vertical-align: middle;line-height: 1.5;">
						<text>快捷</text>
						<text>导航</text>
					</view>
				</view>
				<view class="rote pos-col-center"></view>
			</view>
		</view>
		<!-- 浮动按钮 end -->
		<!-- 加入社群弹窗 -->
		<Commity :community="community" ref="commity" :triggerVisible="false"></Commity>
		<!-- 加入社群弹窗 end -->
	</view>
</template>

<script>
import Commity from "@/components/template/Commity.vue"

export default {
    data() {
        return {
			community: {}
        }
    },
    props: {
        itemIndex: Number,
        itemStyle: Object,
        params: Object,
        itemData: {
			type: Array,
			default() {
				return []
			}
		},
		visibleAlways:{
			type: Boolean,
			default: false
		}
    },
    components: {
		Commity
    },
    computed: {
        is_open() {
			if(this.visibleAlways) {
				return true
			}
            return this.$store.state.floatOpen
        },
		cItemData() {
			// #ifdef H5 || MP-WEIXIN
			return this.itemData
			// #endif
			// #ifndef  H5 || MP-WEIXIN
			return this.itemData.filter(item=>item.open == 3 || item.open == 1 )
			// #endif
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
		handleItemClick(item) {
			console.log('handleItemClick',item)
			if(item.open == '2' || item.open == '3') {
				// #ifdef MP
				if(item.kf_type == '2') {
					wx.openCustomerServiceChat({
					  extInfo: {url: item.qykf_link},
					  corpId: item.qykf_id,
					  success(res) {
						console.log(res)
					  },
					  fail(res) {
						uni.showModal({
						    title: '温馨提示',
						    content: res.errMsg,
						    showCancel: false
						})
						console.log(res)
					  }
					})
					return 
				}
				// #endif
				
				// #ifdef H5
				if(item.kf_type == '2') {
					location.href = item.qykf_link
					return 
				}
				// #endif
				this.community = item.community
				this.$refs.commity.toggleVisible()
				return
			}
			
			this.navigationTo(item.link)
		},
        toggle() {
            this.$store.commit('floatOpen', !this.is_open)
        }
    }
}
</script>

<style lang="scss">
	/* 浮动按钮 */
	.diy-floatbtn-box {
		position: fixed !important;
		right: -135upx;
		bottom: 240upx;
		zoom: .8;
		z-index: 49;
		border-radius: 100upx;
		$back-open: #ffffff;
		$back-close: rgb(230, 230, 230);
		$back-r: 90upx;
		background: $back-close;
		padding: 20upx;
		border-radius: 50upx 0 0 50upx;

		&.ipx {
			bottom: calc(160rpx + 20px);
		}

		.back {
			position: absolute;
			left: -115upx;
			margin-left: 18rpx;
			width: 115upx;
			bottom: 36rpx;
			height: $back-r;
			background: $back-close;
			border-radius: 50upx 0 0 50upx;
			color: #333333;

			.rote {
				width: 0;
				height: 0;
				right: -1upx;
				border-top: 65upx solid transparent;
				border-bottom: 65upx solid transparent;
				border-right: 65upx solid $back-close;
			}

			.tip {
				font-size: 24upx;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
				bottom: 0;
				line-height: $back-r;
				right: 0;
				padding-left: 10upx;

				text {
					vertical-align: middle;
				}
			}
		}

		&.open {
			right: 0;
			background: $back-open;

			.back {
				background: $back-open;

				.rote {
					border-right: 65upx solid $back-open;
				}
			}
		}

		.layer {
			position: relative;
			width: 100upx;
			height: 120upx;
			margin-top: 20upx;

			&:nth-of-type(1) {
				margin-top: 0;
			}

			.img-icon {
				width: 90upx;
				height: 90upx;
				border-radius: 90upx;
			}

			.text {
				font-size: 20upx;
				color: #333333;
				line-height: 1;
				margin-top: 10upx;
				text-align: center;
			}
		}
	}
</style>
