<template>
	<popup-view class="festival-business-popup" :show="show" :overlay="true" @clickmask="$emit('on-mask-click')">
		<view class="festival-business-card">
			<view class="festival-business-card__header">
				共{{business && business.length || 0}}家店铺可用
			</view>
			<view class="festival-business-card__content">
				<!-- 礼包商品列表 -->
				<view class="festival-business-list">
					<view v-for="item in business" :key="item._id" class="festival-business-item">
						<view class="festival-business-row">
							<view class="festival-business-row__center">
								<view class="festival-business-row__title">
									{{item.name}}
								</view>
								<view class="festival-business-row__addr">
									{{item.addr}}
								</view>
							</view>
							<view class="festival-business-row__left">
								<view class="festival-business-row__btn-op is-nav" @click="handleBtnLocationClick(item)">
									<view class="iconfont icon-daohang1"></view>
								</view>
								<view class="festival-business-row__btn-op is-phone" @click="handleBtnPhoneClick(item)">
									<view class="iconfont icon-dianhua1"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 礼包商品列表 end -->
			</view>
		</view>
	</popup-view>
</template>

<script>
import App from '@/common/js/app.js'
import PopupView from '@/components/template/PopManager.vue'
export default {
    components: {
        PopupView
    },
    props: {
        // 是否显示
        show: {
            type: Boolean,
            default: false
        },
        // 列表数据
        business: {
            type: Array,
            default() {
                return [
                    // {
                    //     _id: '01',
                    //     name: '玉林串串香玉林串串香玉林串串香玉林串串香玉林串串香玉林串串香玉林串串香',
                    //     addr: '体育路与联盟路交叉路口凤凰奥斯卡2楼体育路与联盟路交叉路口凤凰奥斯卡2楼体育路与联盟路交叉路口凤凰奥斯卡2楼',
                    //     lat: 0,
                    //     long: 0,
                    //     phone: ''
                    // }
                ]
            }
        }
    },
    methods: {
        // 导航按钮点击事件
        handleBtnLocationClick(item) {
		    App.openLocation({
		        address: item.address,
		        latitude: +item.lat,
		        longitude: +item.long,
		        success() {
		            console.log('success')
		        }
		    })
        },
        // 电话按钮点击事件
        handleBtnPhoneClick(item) {
            uni.makePhoneCall({
                phoneNumber: item.phone
            })
        }
    }
}
</script>

<style lang="scss" scoped>
	.festival-business-card__header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 108rpx;
		font-weight: bold;
		color: #333;
		font-size: 32rpx;
	}
	.festival-business-card {
		position: relative;
		box-sizing: border-box;
		width: 690rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.festival-business-card__content {
		box-sizing: border-box;
		height: 500rpx;
		margin: 0 auto;
		padding: 0 30rpx;
		overflow-y: auto;
	}
	.festival-business-item {
		padding: 40rpx 0;
		border-bottom: 1px solid #EEEEEE;
		&:first-child {
			padding-top: 0;
		}
		&:last-child {
			border-bottom: none;
		}
	}
	.festival-business-row {
		display: flex;
		align-items: center;
	}
	.festival-business-row__center {
		min-width: 0;
		flex: 1;
	}
	.festival-business-row__title {
		font-weight: bold;
		font-size: 30rpx;
		color: #333;
	}
	.festival-business-row__addr {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #999;
	}
	.festival-business-row__left {
		display: flex;
		justify-content: space-between;
		margin-left: 60rpx;
	}
	.festival-business-row__btn-op {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 54rpx;
		height: 54rpx;
		border-radius: 100%;
		background-color: #FCCA1E;
		.iconfont {
			line-height: 1;
			color: #333333;
			font-size: 28rpx;
		}
		&+& {
			margin-left: 40rpx;
		}
	}
</style>
