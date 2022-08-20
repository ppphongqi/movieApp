<template>
	<view :style="themeColor">
		<view class="dealer-container" v-if="is_dealer">
			<view class="dealer-user-info dis-flex flex-dir-row flex-x-between flex-y-center">
				<view class="user-info dis-flex flex-y-center flex-box">
					<image :src="dealer.avatarUrl"></image>
					<view class="user-name dis-flex flex-dir-column flex-x-between flex-box">
						<view class="user-name-text f-36 col-3 onelist-hidden">{{dealer.real_name}}</view>
						<view v-if="cInviteesVisible" class="col-9 f-24">邀请人:{{dealer.referee_name}}</view>
					</view>
				</view>
				<view class="user-right dis-flex flex-y-center main-bg-color" @click="levelDesc" v-if="dealer.leave_open === 1">
					<view class="f-24 col-3  auxiliary-color">等级说明</view>
					<view class="iconfont icon-jinrujiantou1 col-3 auxiliary-color"></view>
				</view>
			</view>
			<!-- 分销协议 -->
			<view v-if="dealer && dealer.is_show_license == 1" class="dis-flex m-top20" @click="noticePopupVisible = true">
				<view class="iconfont icon-tishi col-9 f-24"></view>
				<view class="col-9 f-24" style="margin-left: 8rpx;">{{settingData && settingData.diy_font && settingData.diy_font.fxs || ''}}协议</view>
			</view>
			<!-- 分销协议 -->
			<view class="dealer-detail">
				<view class="dealer-invite dis-flex flex-dir-row flex-x-between flex-y-center">
					<view class="f-26 col-f invite-text">邀请好友注册，粉丝越多收益越高</view>
					<view class="invite-btn b-f f-22" @click="isShare">
						去邀请
						<!-- #ifdef MP-TOUTIAO || MP-ALIPAY -->
						<button class="invite-shareBtn" open-type="share"></button>
						<!-- #endif -->
					</view>
				</view>
				<view class="dealer-detail-contnet">
					<!-- 累计免单 -->
					<view v-if="dealer.is_dealer_free_open == 1" class="free-card">
						<view class="free-card__content">
							<view class="free-card__title">累计免单：{{dealer.dealer_free_res && dealer.dealer_free_res.withdrawals || ''}}元</view>
							<view class="free-card__text" style="margin-top: 30rpx;">待消费免单：{{dealer.dealer_free_res && dealer.dealer_free_res.surplus_money || ''}}元</view>
							<button class="free-card__btn-rule btn-normal" @click="freePopupVisible = true">规则说明</button>
							<button class="free-card__btn-withdrawal btn-normal" @click="navigationTo('pages/subPages/withdraw/apply/apply?type=free')">提现</button>
						</view>
						<view class="free-card__footer">
							<view class="free-card__footer__col">
								<view class="free-card__text">总消费：{{dealer.dealer_free_res && dealer.dealer_free_res.total_consumption || ''}}元</view>
							</view>
							<view class="free-card__footer__col">
								<view class="free-card__text">未免单：{{dealer.dealer_free_res && dealer.dealer_free_res.money || ''}}元</view>
							</view>
						</view>
					</view>
					<!-- 累计免单 end -->
					<!-- 我的资产 -->
					<view v-else class="dealer-assets">
						<view class="dealer-title  dis-flex flex-y-center p-r" @click="skipprope">
							<view class="f-32 col-3">{{appDiyFont.assets}}</view>
							<view class="iconfont icon-jinrujiantou1 col-9"></view>
						</view>
						<view class="dealer-content p-r dis-flex flex-dir-row flex-x-between flex-y-end">
							<view class="flex-box">
								<view class="assets-number">
									<view class="f-48 col-3">{{dealer.Day_money}}</view>
									<view class="f-24 col-9 m-top10">今日(元)</view>
								</view>
								<view class="dis-flex flex-dir-row flex-y-center flex-x-between assets-total">
									<view class="assets-number">
										<view class="f-36 col-3">{{dealer.month_money}}</view>
										<view class="f-24 col-9 m-top10">本月(元)</view>
									</view>
									<view class="assets-number">
										<view class="f-36 col-3">{{dealer.total_money}}</view>
										<view class="f-24 col-9 m-top10">累计(元)</view>
									</view>
								</view>
							</view>
							<view class="assets-withdraw dis-flex flex-dir-column flex-x-end flex-y-center">
								<view class="withdraw-price f-36 main-color">{{dealer.money}}</view>
								<view class="withdraw-text m-top10 f-24 col-9">可提现金额(元)</view>
								<view class="withdraw-btn col-3 f-28" @click="skipApplyOrder">提现</view>
							</view>
						</view>
						<TipBar v-if="settingData && settingData.dealer_basic && settingData.dealer_basic.is_refresh == 1" @on-btn-click="handleBtnTipRefreshClick" />
					</view>
					<!-- 我的资产 end -->
					
					<view class="dealer-team">
						<view class="dealer-title  dis-flex flex-y-center p-r" @click="skipTeam" :data-lv="dealer.is_move_protect&&dealer.team_diy==='2'?1:0">
							<view class="f-32 col-3">{{appDiyFont.team}}</view>
							<view class="iconfont icon-jinrujiantou1 col-9"></view>
						</view>
						<view class="dealer-team-list dis-flex flex-y-center" v-if="myteam.length">
							<view class="dealer-team-item" v-for="(teamitem,index) in myteam" @click="skipTeam" :data-lv="teamitem.lv" :key="index"
							 v-if="index<=teamLv">
								<view class="col-3 f-36">{{teamitem.total_num}}</view>
								<view class="m-top10 col-9 f-24">{{teamitem.title}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<block v-if="!!dealer.goods && dealer.goods.length>0">
				<view class="new-income">
					<view class="dealer-title  dis-flex flex-y-center p-r" @click="skipShopList">
						<view class="f-32 col-3">{{appDiyFont.new}}</view>
						<view class="iconfont icon-jinrujiantou1 col-9"></view>
					</view>
					<scroll-view :scroll-x="true" class="income-goods-scroll">
						<view class="income-goods-list dis-flex flex-dir-row flex-y-center">
							<view class="income-goods-item dis-flex flex-dir-column flex-x-between" v-for="(shopitem,index) in dealer.goods"
							 :key="index" @click="skipGoods(shopitem.goods_id)">
								<view class="income-goods-img" :style="{'background-image':'url('+shopitem.image[0]['file_path']+')'}">

								</view>
								<view class="income-goods-detail dis-flex flex-dir-column flex-x-between">
									<view class="f-28 col-3 onelist-hidden shop-name-wid">{{shopitem.goods_name}}</view>
									<view class="income-goods-price dis-flex flex-y-center">
										<view class="goods-price-icon f-24">赚</view>
										<view class="goods-income f-26 price-font-family">{{settingData.currency}}{{shopitem.rebate_commission}}</view>
										<view class="goods-price f-24 col-9 price-font-family">{{settingData.currency}}{{shopitem.goods_price}}</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</block>
		</view>
		<!-- 分享菜单 -->
		<share-view ref="shareView" :poster-type="'dealer'"></share-view>
		<!-- 快捷导航 -->
		<shortcut id=""></shortcut>
		<page-loading ref="loading"></page-loading>
		<!-- 合作人须知弹窗 -->
		<popup-view class="notice-popup" :show="noticePopupVisible" type="center" @clickmask="noticePopupVisible = false">
			<view>
				<view class="notice-card">
					<view class="notice-card__header">
						{{settingData && settingData.diy_font && settingData.diy_font.fxs || ''}}协议
					</view>
					<scroll-view scroll-y class="notice-card__content">
						<view class="notice-card__scroll__content">
							<parse :html="dealer && dealer.license || ''"></parse>
						</view>
					</scroll-view>
				</view>
				<view class="notice-popup__btn-close iconfont icon-roundclose" @click="noticePopupVisible = false"></view>
			</view>
		</popup-view>
		<!-- 合作人须知弹窗 end -->
		<!-- 累计免单规则说明 -->
		<popup-view class="notice-popup" :show="freePopupVisible" type="center" @clickmask="freePopupVisible = false">
			<view>
				<view class="notice-card">
					<view class="notice-card__header">
						规则说明
					</view>
					<scroll-view scroll-y class="notice-card__content">
						<view class="notice-card__scroll__content">
							<parse :html="dealer.dealer_free_explain  || ''"></parse>
						</view>
					</scroll-view>
				</view>
				<view class="notice-popup__btn-close iconfont icon-roundclose" @click="freePopupVisible = false"></view>
			</view>
		</popup-view>
		<!-- 累计免单规则说明 end -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import shortcut from '@/components/template/ShortCut.vue'
import ShareView from '@/components/template/ShareView.vue'
import pageShare from '@/common/js/pageShareMixin.js'
import PopupView from '@/components/template/PopManager.vue'
import Parse from '@/components/threeComponents/jyf-Parser/index'
import TipBar from '@/components/template/TipBar.vue'
export default {
    mixins: [pageShare],
    data() {
        return {
            is_dealer: false,
            dealer: {},
            myteam: [
                {
                    title: '全部团队',
                    lv: '0',
                    total_num: 0,
                    name: 'lv_team',
                    id: 'total_num'
                },
                {
                    title: '一级团队',
                    lv: '1',
                    total_num: 0,
                    name: 'lv_one',
                    id: 'first_num'
                },
                {
                    title: '二级团队',
                    lv: '2',
                    total_num: 0,
                    name: 'lv_two',
                    id: 'second_num'
                },
                {
                    title: '三级团队',
                    lv: '3',
                    total_num: 0,
                    name: 'lv_three',
                    id: 'third_num'
                }
            ],
            teamLv: null,
            // 合作人须知弹窗是否显示
            noticePopupVisible: false,
			// 累计免单规则说明弹窗是否显示
			freePopupVisible: false,
        }
    },
    components: {
        shortcut,
        ShareView,
        Parse,
        PopupView,
		TipBar
    },
    computed: {
        // 是否显示邀请人字段
        cInviteesVisible() {
            let appSetting = this.$store.state.appSetting
            return +this.$util.deepGet(appSetting, 'dealer_basic.is_show_referee') === 1
        },
        appDiyFont() {
            let appSetting = this.$store.state.appSetting,
                myteam = this.myteam
            if (appSetting) {
                uni.setNavigationBarTitle({
                    title: appSetting.diy_font ? appSetting.diy_font.center : ''
                })
                if (this.dealer.team_diy === '1') {
                    myteam = myteam.map(item => {
                        item.title = appSetting.diy_font[item.name] || item.title
                        return item
                    })
                    this.myteam.push(...myteam)
                }
                return appSetting.diy_font
            }
        }
    },
    watch: {
        appDiyFont: {
            handler(val = {}) {
                uni.setNavigationBarTitle({
                    title: val.center || ''
                })
            },
            immediate: true
        }
    },
    onLoad() {},
    onShow() {
		if(this.$util.deepGet(this.settingData,'dealer_basic.dealer_center_page','') == 2) {
			App.navigationTo({
				url: 'pages/subPages/partner/index',
				redirectTo: true,
			})
			return
		}
        // 获取分销商中心数据
        this.getDealerCenter()
    },
    methods: {
		async handleBtnTipRefreshClick() {
			uni.showLoading({
				title: '刷新中',
				mask: true
			})
			this.getDealerCenter({
				is_refresh: 1
			}).then(()=>{
				uni.showToast({
					icon: 'none',
					title: '刷新成功'
				})
			})
		},
        /**
			 * 获取分销商中心数据
			 */
        getDealerCenter({is_refresh=''}={}) {
            let _this = this,
                requestList = [
                    'user.dealer.User/getDealerLv',
                    'user.dealer.User/getDistributor'
                ].map(val => new Promise((resolve, reject) => {
                    App._get(val, {
						is_refresh
					}, res => {
                        resolve(res.data)
                    }, err => {
                        if (err.data.code === 0) {
                            App.navigationTo({
                                url: 'pages/subPages/dealer/apply/apply'
                            })
                        };
                    })
                }))
            return Promise.all(requestList).then(optinos => {
                let {
                        user_count,
                        dealer_count,
                        is_move_protect
                    } = optinos[0],
                    myteam = optinos[1].team_diy === '1' ? _this.myteam.map(item => {
                        item.total_num = optinos[1][item.id]
                        return item
                    }) : [
                        {
                            title: '客户',
                            lv: 0,
                            total_num: user_count
                        },
                        {
                            title: '销售',
                            lv: 1,
                            total_num: dealer_count
                        }
                    ],
                    getSingleShare = _this.$store.getters.getSingleShare('dealer'),
                    uniacid = App.getUniacid()
                optinos[1].is_move_protect = is_move_protect
                if (is_move_protect && optinos[1].team_diy === '2') {
                    myteam = myteam.filter(val => val.lv !== 0)
                }

                _this.myteam.splice(0, 4, ...myteam)
                _this.setData({
                    dealer: optinos[1],
                    is_dealer: true,
                    teamLv: Number(optinos[0].lv)
                })
                _this.shareData = _this.getPageShareData('dealer/index', getSingleShare)
                uni.stopPullDownRefresh()
                App.hideLoading()
            })
        },
        /**
			 * 跳转到明细
			 */
        skipApplyOrder() {
            App.navigationTo({
                url: 'pages/subPages/withdraw/list/list'
            })
        },
        /**
			 * 跳转到提现页面
			 */
        skipprope() {
            App.navigationTo({
                url: 'pages/subPages/dealer/order/order'
            })
        },
        /**
			 *  跳转我的团队
			 */
        skipTeam(e) {
            let lv = e.currentTarget.dataset.lv
            App.navigationTo({
                url: `pages/subPages/dealer/team/team?lv=${lv}&listStyle=${this.dealer.team_diy}`
            })
        },
        /**
			 * 跳转到分销商品列表
			 */
        skipShopList() {
            App.navigationTo({
                url: `pages/subPages/dealer/index/goods?referee_id=${this.dealer.referee_id}`
            })
        },
        /**
			 * 跳转到商品详情
			 */
        skipGoods(goods_id) {
            App.navigationTo({
                url: `pages/subPages/goods/index/index?goods_id=${goods_id}`
            })
        },
        /**
			 * 跳转等级说明
			 */
        levelDesc() {
            App.navigationTo({
                url: 'pages/subPages/dealer/index/level'
            })
        },
        // 分享菜单
        isShare() {
            // #ifndef MP-TOUTIAO || MP-ALIPAY
            this.$refs.shareView.shareswich()
            // #endif
        }
    },
    onPullDownRefresh() {
        // 获取分销商中心数据
        this.getDealerCenter()
    }
}
</script>

<style>
	.dealer-container {
		min-height: 100vh;
		padding: 30upx;
		background: #FFFFFF;
		box-sizing: border-box;
	}

	.dealer-user-info {
		padding-top: 16upx;
	}

	.user-info image {
		width: 86upx;
		height: 86upx;
		display: block;
		margin-right: 24upx;
		border-radius: 50%;
	}

	.user-right {
		padding: 12upx 16upx;
		background: #FFD940;
		border-radius: 70upx;
	}

	.user-right .icon-jinrujiantou1 {
		color: #333333;
		font-size: 24rpx;
		width: .8em;
	}

	.dealer-invite {
		margin-top: 40upx;
		padding: 16upx 30upx;
		background: linear-gradient(-90deg, rgba(241, 93, 37, 1), rgba(248, 172, 51, 1));
		box-shadow: 0 4upx 16upx 0 rgba(250, 86, 48, 0.75);
		border-radius: 20upx 20upx 0 0;
	}

	.dealer-invite .invite-text {
		font-style: italic;
	}

	.dealer-invite .invite-btn {
		color: #F3702A;
		padding: 10upx 28upx 10upx 20upx;
		box-shadow: 0 4upx 12upx 0 rgba(183, 29, 70, 0.35);
		border-radius: 40upx;
		position: relative;
	}

	.invite-btn .invite-shareBtn {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
	}

	.dealer-invite .invite-btn::after {
		content: " ";
		position: absolute;
		top: 50%;
		right: 2upx;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border: 8upx solid;
		border-color: transparent transparent transparent #F3702A;
	}

	.dealer-detail-contnet {
		box-shadow: 0 4upx 12upx 0 rgba(128, 128, 128, 0.35);
		border-radius: 0 0 20upx 20upx;
	}

	/* 我的资产 */
	.dealer-content {
		margin-top: 30upx;
	}

	.dealer-content .flex-box {
		padding-right: 40upx;
		border-right: 1upx solid #EEEEEE;
	}

	.dealer-assets {
		padding: 30upx 36upx 48upx;
		background: #FFFFFF;
		border-bottom: 1upx solid #EEEEEE;
	}

	.assets-number {
		margin-right: ;
	}

	.assets-total {
		margin-top: 28upx;
	}

	.assets-withdraw {
		padding-left: 40upx;
	}

	.withdraw-price {
		color: #FFD940;
	}

	.withdraw-btn {
		margin-top: 30upx;
		padding: 20upx 60upx;
		border-radius: 50upx;
		border: 1upx solid #CCCCCC;
	}

	/* 我的团队 */
	.dealer-team {
		padding: 30upx 36upx;

	}

	.dealer-team-list {
		margin-top: 40upx;
	}

	.dealer-team-item {
		width: 100%;
	}

	/* 本周收益 */
	.new-income {
		box-shadow: 0 4upx 12upx 0 rgba(128, 128, 128, 0.35);
		border-radius: 20upx;
		padding: 30upx 30upx 40upx;
		background: #FFFFFF;
		margin-top: 24upx;
	}

	.income-goods-scroll {
		margin-top: 30upx;
		height: 260upx;
	}

	.income-goods-list {
		height: 260upx;
		flex-wrap: nowrap;
	}

	.income-goods-item {
		height: 260upx;
		width: 220upx;
		margin-right: 30upx;
	}

	.income-goods-img {
		width: 180upx;
		height: 180upx;
		overflow: hidden;
		border-radius: 6upx;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}


	.income-goods-detail .onelist-hidden {
		margin-bottom: 10upx;
	}

	.income-goods-price .goods-price-icon {
		width: 1.5em;
		height: 1.5em;
		line-height: 1.5em;
		text-align: center;
		background: #FE504F;
		color: #FFFFFF;
		border-radius: 6upx;
		position: relative;
	}

	/* 	.income-goods-price .goods-price-icon::after {
		content: " ";
		position: absolute;
		top: 0;
		right: -1.5em;
		width: 0;
		height: 0;
		border: .75em solid;
		border-color: transparent transparent transparent #FE504F;
	} */

	.income-goods-price .goods-income {
		color: #FE504F;
		margin: 0 10upx 0 8upx;
	}

	.shop-name-wid {
		width: 170upx;
	}
	// 合作人须知弹窗
	.notice-popup__btn-close {
		margin-top: 40rpx;
		color: #fff;
		font-size: 50rpx;
		text-align: center;
	}
	.notice-card {
		width: 580rpx;
		border-radius: 10px;
		background-color: #fff;
	}
	.notice-card__header{
		display: flex;
		min-height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 40rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}
	.notice-card__content {
		height: 600rpx;
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}
	// 合作人须知弹窗 end
</style>

<style lang="scss" scoped>
.icon-jinrujiantou1 {
	font-size: 24rpx;
}
/* 累计免单 */
.free-card {
	box-sizing: border-box;
	background-color: #FFD940;
	border-radius: 0 0 10rpx 10rpx;
	overflow: hidden;
}
.free-card__content {
	padding: 30rpx;
	position: relative;
}
.free-card__title {
	text-align: center;
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}
.free-card__text {
	text-align: center;
	font-size: 24rpx;
	color: #333;
}
.free-card__btn-rule {
	position: absolute;
	top: 15rpx;
	right: 30rpx;
	text-align: center;
	font-size: 24rpx;
	color: #333;
	
}
.free-card__btn-withdrawal {
	position: absolute;
	bottom: 20rpx;
	right: 30rpx;
	text-align: center;
	font-size: 24rpx;
	color: #333;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10rpx 30rpx;
	box-sizing: border-box;
	border-radius: 9999rpx;
	border: 1px solid currentColor;
}
.free-card__footer {
	box-sizing: border-box;
	padding: 26rpx 30rpx;
	display: flex;
	background-color: #FFDC5C;
}
.free-card__footer__col {
	display: flex;
	justify-content: center;
	flex: 1;
}
/* 累计免单 end */
</style>
