<template>
	<view class="festival-business">
		<view class="festival-business__header">
			<card-title title="活动商家" />
		</view>
		<view class="festival-business__content">
			<!-- 礼包商品列表 -->
			<view class="festival-business-list">
				<view v-for="item in cListData" :key="item._id" class="festival-business-item">
					<view class="festival-business-card">
						<view class="festival-business-card__center">
							<view class="festival-business-card__title">
								{{item.name}}
							</view>
							<view class="festival-business-card__addr">
								{{item.addr}}
							</view>
						</view>
						<view class="festival-business-card__left">
							<view class="festival-business-card__btn-op is-nav" @click="handleBtnLocationClick(item)">
								<view class="iconfont icon-daohang1"></view>
							</view>
							<view class="festival-business-card__btn-op is-phone" @click="handleBtnPhoneClick(item)">
								<view class="iconfont icon-dianhua1"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 礼包商品列表 end -->
			<!-- 加载更多 -->
			<view v-if="!hasShowAll" class="festival-business__btn-more" @click="handleBtnMoreClick">查看更多<view class="iconfont icon-unfold"></view></view>
			<!-- 加载更多 end -->
		</view>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import CardTitle from './CardTitle'
export default {
    components: {
        CardTitle
    },
    props: {
        // 活动商家列表数据
        listData: {
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
        },
        // 默认显示几个
        defaultNum: {
            type: Number,
            default: 3
        }
    },
    data() {
        return {
            // 当前是否显示全部
            hasShowAll: false
        }
    },
    computed: {
        // 格式化的礼包商品数据
        cListData() {
            if (!this.listData) {
                return []
            }
            if (this.hasShowAll) {
                return this.listData
            }
            return this.listData.slice(0, this.defaultNum)

        }
    },
    watch: {
	    listData: {
	        handler(val) {
	            if (val.length <= this.defaultNum) {
	                this.hasShowAll = true
	            }
	        },
	        immediate: true
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
        },
        // 查看更多按钮点击事件
        handleBtnMoreClick() {
            this.hasShowAll = true
        }
    }
}
</script>

<style lang="scss" scoped>
	.festival-business {
		width: 690rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.festival-business__header {
		position: relative;
	}
	.festival-business__content {
		padding: 20rpx 30rpx;
		padding-top: 0;
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
	.festival-business-card {
		display: flex;
		align-items: center;
	}
	.festival-business-card__center {
		width: 440rpx;
	}
	.festival-business-card__title {
		font-weight: bold;
		font-size: 30rpx;
		color: #333;
	}
	.festival-business-card__addr {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #999;
	}
	.festival-business-card__left {
		display: flex;
		justify-content: space-between;
		flex: 1;
		margin-left: 60rpx;
	}
	.festival-business-card__btn-op {
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
	}
	.festival-business__btn-more {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40rpx;
		&,.iconfont {
			font-size: 28rpx;
			color: #999999;
		}
		.iconfont {
			margin-left: 8rpx;
		}
	}
</style>
