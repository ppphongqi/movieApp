<template>
	<view class="gift-bag-goods">
		<view class="gift-bag-goods__header">
			<card-title :title="cTitle" />
			<view class="gift-bag-goods__btn-rule" @click="rulesPopupVisible = true">活动规则<view class="iconfont icon-wenhaoxiao"></view></view>
		</view>
		<view class="gift-bag-goods__content">
			<!-- 礼包商品列表 -->
			<view class="gift-bag-goods-list">
				<view v-for="(item, index) in cListData" :key="item._id" class="gift-bag-goods-item">
					<view class="gift-bag-goods-card">
						<view class="gift-bag-goods-card__left">
							<image class="gift-bag-goods-card__img" :src="item.imgUrl" />
						</view>
						<view class="gift-bag-goods-card__center">
							<view class="gift-bag-goods-card__title">{{item.title}}</view>
							<view class="gift-bag-goods-card__attr">
								<view class="gift-bag-goods-card__price"><text>价值:¥</text><text class="is-strong">{{item.priceStr}}</text></view>
								<view class="gift-bag-goods-card__shops" @click="handleBtnBusinessClick(item, index)">共{{item.shopsNum}}家店铺可用<view class="iconfont icon-jinrujiantou"></view></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 礼包商品列表 end -->
			<!-- 加载更多 -->
			<view v-if="!hasShowAll" class="gift-bag-goods__btn-more" @click="handleBtnMoreClick">查看更多<view class="iconfont icon-unfold"></view></view>
			<!-- 加载更多 end -->
		</view>
		<!-- 规则弹窗 -->
		<gift-bag-rules-popup :show="rulesPopupVisible" :text="rules" @on-mask-click="rulesPopupVisible = false" />
		<!-- 规则弹窗 end -->
		<!-- 商家弹窗 -->
		<festival-business-popup :show="festivalBusinessPopupVisible" :business="festivalBusinessPopupListData" @on-mask-click="festivalBusinessPopupVisible = false" />
		<!-- 商家弹窗 end -->
	</view>
</template>

<script>
import CardTitle from './CardTitle'
import GiftBagRulesPopup from './GiftBagRulesPopup'
import FestivalBusinessPopup from './FestivalBusinessPopup.vue'

export default {
    components: {
        CardTitle,
        GiftBagRulesPopup,
        FestivalBusinessPopup
    },
    props: {
        // 礼包商品列表数据
        listData: {
            type: Array,
            default() {
                return [
                    // {
                    //     _id: '01',
                    //     imgUrl: 'https://via.placeholder.com/160x160/2a9ff6/fffffff',
                    //     title: '花禾锅式料理 | 9.9元限量抢抵用10免费喝江湖啤酒一打(每桌限1)花禾锅式料理 | 9.9元限量抢抵用10免费喝江湖啤酒一打(每桌限1)',
                    //     priceStr: '299999999.99',
                    //     shopsNum: 33
                    // }
                ]
            }
        },
        // 默认显示几个
        defaultNum: {
            type: Number,
            default: 3
        },
        // 规则文本 由后台填写
        rules: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 当前是否显示全部
            hasShowAll: false,
            // 规则弹窗是否显示
            rulesPopupVisible: false,
            // 当前选中礼包商品对应商家弹窗是否显示
            festivalBusinessPopupVisible: false,
            // 当前选中礼包商品对应商家弹窗的列表数据
            festivalBusinessPopupListData: []
        }
    },
    computed: {
        // 格式化的title
        cTitle() {
            const len = (this.listData || []).length
            return `礼包商品(${len})`
        },
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
        // 共有几家商品按钮点击事件
        handleBtnBusinessClick(item, index) {
            console.log('handleBtnBusinessClick')
            this.festivalBusinessPopupVisible = true
            this.festivalBusinessPopupListData = this.$util.deepGet(item, '_source.store_ids', []).map(business => ({
                _id: business.id,
                name: business.name,
                addr: business.address,
                lat: business.lat,
                long: business.lng,
                phone: business.mobile
            }))
        },
        // 查看更多按钮点击事件
        handleBtnMoreClick() {
            this.hasShowAll = true
        }
    }
}
</script>

<style lang="scss" scoped>
	.gift-bag-goods {
		width: 690rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.gift-bag-goods__header {
		position: relative;
	}
	.gift-bag-goods__content {
		padding: 20rpx 30rpx;
		padding-top: 0;
	}
	.gift-bag-goods-card {
		font-size: 0;
		display: flex;
	}
	.gift-bag-goods-item {
		padding: 40rpx 0;
		border-bottom: 1px solid #EEEEEE;
		&:first-child {
			padding-top: 0;
		}
		&:last-child {
			border-bottom: none;
		}
	}
	.gift-bag-goods-card__img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 4rpx;
	}
	.gift-bag-goods-card__center {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
		margin-left: 20rpx;
	}
	.gift-bag-goods-card__title {
		height: 74rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	.gift-bag-goods-card__attr {
		display: flex;
		align-items: center;
		margin-top: auto;
	}
	.gift-bag-goods-card__price {
		width: 213rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #333;
		font-size: 24rpx;
		background-color: #FFD940;
		border-radius: 25rpx 0px 0px 25rpx;
		white-space: nowrap;
		overflow: hidden;
		line-height: 1;
		vertical-align: bottom;
		.is-strong {
			font-weight: bold;
			font-size: 36rpx;
			line-height: 1;
			vertical-align: bottom;
			transform: translateY(-4rpx);
		}
	}
	.gift-bag-goods-card__shops {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: flex-end;
		width: 0;
		height: 50rpx;
		padding-right: 24rpx;
		background-color: #333333;
		border-radius:  0px 25rpx 25rpx 0px;
		font-size: 24rpx;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		.iconfont {
			margin-left: 8rpx;
			font-size: 24rpx;
			color: inherit;
		}
	}
	.gift-bag-goods__btn-more {
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
	.gift-bag-goods__btn-rule {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
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
