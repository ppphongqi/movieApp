<!-- 设计稿用了第三方数字字体 但是按照常规办法 第三方字体会在真机上向上便宜 -->
<!-- 如果要处理偏移 要写额外的dom接口和css -->
<!-- 为了方便开发 就不用第三方字体了 点赞页面就没用第三方字体 -->
<template>
	<view class="page-makingFestival app-clearfix" :style="cPageStyle">
		<!-- banner -->
		<view class="makingFestival-banner">
			<image class="makingFestival-banner_img" :src="cBannerData.file_path"></image>
		</view>
		<!-- banner end -->
		<!-- 活动倒计时 -->
		<count-down :startTimeStamp="cCountDownData.startTimeStamp" :endTimeStamp="cCountDownData.endTimeStamp" />
		<!-- 活动倒计时 end -->
		<!-- 联系客服 -->
		<customer-service
			v-if="cCustomerServiceData.communityId"
			:communityId="cCustomerServiceData.communityId"
			:avatar="cCustomerServiceData.avatar"
			:title="cCustomerServiceData.title"
			:desc="cCustomerServiceData.desc"
			:phone="cCustomerServiceData.phone"
			:communityType="cCustomerServiceData.communityType"
			:qrcodeImgUrl="cCustomerServiceData.qrcodeImgUrl"
			:pagePath="cCustomerServiceData.pagePath"/>
		<!-- 联系客服 end -->
		<!-- 数据统计 -->
		<statistics-list v-if="!cFestivalIntroData.visible" :listData="cStatisticsListData" />
		<!-- 数据统计 end -->
		<!-- 活动简介 -->
		<festival-intro
			v-if="cFestivalIntroData.visible"
			:viewsNum="cFestivalIntroData.viewsNum"
			:shareNum="cFestivalIntroData.shareNum"
			:buyNum="cFestivalIntroData.buyNum"
			:title="cFestivalIntroData.title"
			:priceStr="cFestivalIntroData.priceStr"
			:priceDelStr="cFestivalIntroData.priceDelStr"/>
		<!-- 活动简介 end -->
		<!-- #ifdef MP-WEIXIN -->
		<!-- 直播 -->
		<festival-live v-if="visible" :roomId="cLiveData.roomId" :status="cLiveData.status" :backgroundImage="cLiveData.backgroundImage" />
		<!-- 直播 end -->
		<!-- #endif -->
		<!-- 购买用户 -->
		<buying-users v-if="cBuyingUsers.length" :listData="cBuyingUsers" />
		<!-- 购买用户 end -->
		<!-- 礼包商品 -->
		<gift-bag-goods :listData="cGiftBagGoods" :rules="cRules" />
		<!-- 礼包商品 end -->
		<!-- 活动商家 -->
		<festival-business :listData="cFestivalBusinessData" />
		<!-- 活动商家 end -->
		<!-- 活动详情 -->
		<festival-details :html="cFestivalDetails" />
		<!-- 活动详情 end -->
		<!-- 购买用户弹幕 -->
		<users-bullet :listData="cUsersBullet" />
		<!-- 购买用户弹幕 end -->
		<!-- 音乐播放组件 -->
		<AudioIcon v-if="cMusicData.file_path" v-model="audioStatus" :src="cMusicData.file_path" styleStr="position: fixed;right: 30rpx;top: 200rpx;z-index: 5;"></AudioIcon>
		<!-- 音乐播放组件 -->
		<!-- 底部fixed区域 -->
		<view class="page-makingFestival__footer app-wrapper--safe-fixed-bottom">
			<view class="page-makingFestival__op-wrapper">
				<button class="page-makingFestival_btn-home btn-normal" @click="navigationTo('pages/mainPages/index/index')">
					<view class="iconfont icon-home"></view>
					<view>首页</view>
				</button>
				<button class="page-makingFestival_btn-buy btn-normal" :class="{'is-disabled': btnDisabled}" @click="handleBtnBuyClick">¥{{cFestivalIntroData.priceStr}} 立即购买</button>
			</view>
		</view>
		<!-- 底部fixed区域 end -->
		<!-- 底部悬浮按钮 -->
		<float-btn v-if="cFloatBtnData.length" :itemData="cFloatBtnData" :visibleAlways="true" />
		<!-- 底部悬浮按钮 -->
		<!-- 关注公众号弹窗 -->
		<popup-view :show="followWechatPopupVisible" :overlay="true" @clickmask="followWechatPopupVisible = false">
			<!-- #ifdef MP -->
			<view style="position: relative;">
				<view class="community-detail b-f t-c p-r">
					<view class="community-header f-w f-44 p-r" :style="{'background-image':getImageRoot('61.png','url')}">
						<image src="/static/images/attention-wx.png" class="attention" style="background: none;"></image>
					</view>
					<view class="community-body f-26 col-3 t-c">
						<view class="f-26 col-3">该活动仅限公众号粉丝参与</view>
						<!-- <view class="t-c">点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{data.keyword}}</text>”获得购买机会</view> -->
					</view>
					<button class="community-reply f-24 col-3" open-type="contact" :send-message-path="cFollowWechatData.path" :send-message-title="cFollowWechatData.title" show-message-card>去关注</button>
				</view>
				<view class="iconfont icon-roundclose" @click="followWechatPopupVisible = false"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="attention-box">
				<view class="attention-title f-28 col-9 t-c">活动仅限公众号粉丝参与</view>
				<view class="attention-label dis-flex flex-y-center m-top30 col-3 f-24">
					<view class="label-num backColor auxiliary-color">1</view>
					<view class="attention-text">识别下方二维码关注公众号</view>
				</view>
				<image :src="goodsRes.subscribe_wechat_img" class="wechat-image"></image>
				<view class="iconfont icon-roundclose" @click="followWechatPopupVisible = false"></view>
			</view>
			<!-- #endif -->
		</popup-view>
		<!-- 关注公众号弹窗 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import LoadMore from '@/components/template/Loadmore.vue'
import CountDown from './components/CountDown2'
import CustomerService from './components/CustomerService'
import FestivalIntro from './components/FestivalIntro.vue'
import BuyingUsers from './components/BuyingUsers.vue'
import GiftBagGoods from './components/GiftBagGoods.vue'
import FestivalBusiness from './components/FestivalBusiness.vue'
import FestivalDetails from './components/FestivalDetails.vue'
import FestivalLive from './components/FestivalLive.vue'
import UsersBullet from './components/UsersBullet.vue'
import StatisticsList from './components/StatisticsList.vue'
import AudioIcon from '@/components/page/pageComponents/AudioIcon.vue'
import PopupView from '@/components/template/PopManager.vue'
import FloatBtn from "@/components/page/pageComponents/FloatBtn.vue"
import pageShareMixin from '@/common/js/pageShareMixin.js'

export default {
    mixins: [pageShareMixin],
    components: {
        LoadMore,
        CountDown,
        CustomerService,
        FestivalIntro,
        BuyingUsers,
        GiftBagGoods,
        FestivalBusiness,
        FestivalDetails,
        FestivalLive,
        UsersBullet,
        StatisticsList,
        AudioIcon,
        PopupView,
		FloatBtn
    },
    data() {
        return {
            // 页面options
            options: {},
            // 页面的活动的接口数据
            festivalRes: {

            },
            // 页面商品和购买用户相关数据
            goodsRes: {

            },
            // 页面diy接口信息
            diyRes: {

            },
            // 音频播放的状态
            audioStatus:　'play',
            // 当前选中礼包商品对应商家弹窗是否显示
            festivalBusinessPopupVisible: false,
            // 当前选中礼包商品对应商家弹窗的列表数据
            festivalBusinessPopupListData: [],
            // 关注公众号弹窗是否显示
            followWechatPopupVisible: false,
            // 购买按钮是否Disabled
            btnDisabled: false
        }
    },
    computed: {
		// 底部悬浮按钮的数据
		cFloatBtnData() {
			if(!this.$util.deepGet(this.festivalRes,'navigation_icon.0.file_path','')) return []
			return [{
				thumb: {
					file_path: this.$util.deepGet(this.festivalRes,'navigation_icon.0.file_path',''),
				},
				text: this.$util.deepGet(this.festivalRes,'navigation_text',''),
				link: this.$util.deepGet(this.festivalRes,'linkurl','')
			}]
		},
        // 引导关注公众号卡片的数据
        cFollowWechatData() {
            const details = this.goodsRes || {}
            return {
                img: details.blessing_sapp_img,
                path: 'index?theme_festival_id=' + this.blessingId,
                title: details.title,
                qrCode: details.subscribe_wechat_img
            }
        },
        // 数据统计的数据
        cStatisticsListData() {
            if (this.cFestivalIntroData.visible) {
                return [
                    // 购买量
                    {
                        _id: '01',
                        icon: 'iconfont icon-119',
                        num: this.$util.deepGet(this.festivalRes, 'number', 0),
                        text: '人已购'
                    },
                    // 分享量
                    {
                        _id: '02',
                        icon: 'iconfont icon-120',
                        num: this.$util.deepGet(this.festivalRes, 'forward_num', 0),
                        text: '人分享'
                    },
                    // 浏览量
                    {
                        _id: '03',
                        icon: 'iconfont icon-123',
                        num: this.$util.deepGet(this.festivalRes, 'views_num', 0),
                        text: '人浏览'
                    }
                ]
            }
            return [
                // 分享量
                {
                    _id: '02',
                    icon: 'iconfont icon-120',
                    num: this.$util.deepGet(this.festivalRes, 'forward_num', 0),
                    text: '人分享'
                },
                // 浏览量
                {
                    _id: '03',
                    icon: 'iconfont icon-123',
                    num: this.$util.deepGet(this.festivalRes, 'views_num', 0),
                    text: '人浏览'
                }
            ]


        },
        // 客服卡片数据
        cCustomerServiceData() {
		    const community = this.$util.deepGet(this.festivalRes, 'community', {})
		    return {
		        communityId: community.id,
		        avatar: this.$util.deepGet(community, 'headimg.0.file_path', ''),
		        title: community.title,
		        desc: community.des,
		        phone: community.mobile,
		        communityType: community.community_type,
		        qrcodeImgUrl: this.$util.deepGet(community, 'qrcodeimg.0.file_path', ''),
		        showLongPressBtn: [
		            2,
		            4
		        ].indexOf(community.community_type) == -1,
                pagePath: `index?theme_festival_id=${this.options.theme_festival_id}`
		    }
        },
        // banner图的数据
        cBannerData() {
            return this.$util.deepGet(this.festivalRes, 'activity_map_id.0', {})
        },
        // 音频播放的数据
        cMusicData() {
            return this.$util.deepGet(this.festivalRes, 'music_id.0', {})
        },
        // page的样式字符串
        cPageStyle() {
            let styleStr = this.themeColor
            const color = this.$util.deepGet(this.festivalRes, 'colour')
            if (color) {
                styleStr += `background-color: ${color};`
            }
            return styleStr
        },
        // 倒计时数据
        cCountDownData() {
            // 都是13位时间戳
            const startTimeStamp = (this.festivalRes.start_time || 0) * 1000
            const endTimeStamp = (this.festivalRes.end_time || 0) * 1000
            return {
                startTimeStamp,
                endTimeStamp
            }
        },
        // 活动简介
        cFestivalIntroData() {
            return {
                // 是否显示活动简介
                visible: this.$util.deepGet(this.goodsRes, 'data.goods_id', ''),
                // 浏览量
                viewsNum: this.$util.deepGet(this.festivalRes, 'views_num', 0),
                // 分享量
                shareNum: this.$util.deepGet(this.festivalRes, 'forward_num', 0),
                // 购买量
                buyNum: this.$util.deepGet(this.festivalRes, 'number', 0),
                // 标题
                title: this.$util.deepGet(this.goodsRes, 'data.goods_name', 0),
                // 价格
                priceStr: this.$util.deepGet(this.goodsRes, 'data.sku.0.goods_price', 0),
                // 市场价
                priceDelStr: this.$util.deepGet(this.goodsRes, 'data.sku.0.line_price', 0)
            }
        },
        // 直播卡片的数据
        cLiveData() {
            return {
                // 房间id
                roomId: this.$util.deepGet(this.festivalRes, 'live_id.roomid'),
                // 是否显示直播卡片
                visible: +this.$util.deepGet(this.festivalRes, 'is_live') === 1,
                // reduce后的直播状态 -1:不确定，1:正在直播，2:直播已结束
                status: +this.$util.deepGet(this.festivalRes, 'live_status') === 101 ? 1 : 2,
                // 直播背景图
                backgroundImage: +this.$util.deepGet(this.festivalRes, 'live_status') === 101 ? this.$util.deepGet(this.festivalRes, 'live_img.0.file_path') : this.$util.deepGet(this.festivalRes, 'live_notice_img.0.file_path')
            }
        },
        // 购买用户弹幕数据
        cUsersBullet() {
            return this.$util.deepGet(this.goodsRes, 'user_barrage', []).map(item => ({
                avatar: item.avatarUrl,
                text: item.text
            }))
        },
        // 下单用户信息
        cBuyingUsers() {
            return this.$util.deepGet(this.goodsRes, 'buying_users', []).map(item => ({
                _id: item.order_id,
                avatar: item.avatarUrl,
                nickname: item.nickName
            }))
        },
        // 礼包商品的数据
        cGiftBagGoods() {
            return this.$util.deepGet(this.goodsRes, 'data.gift', []).map(item => ({
                _source: item,
			    _id: item.gift_id,
			    imgUrl: this.$util.deepGet(item, 'image.0.file_path', ''),
			    title: item.title,
			    priceStr: item.price,
			    shopsNum: item.store_ids.length
            }))
        },
        // 活动商家的数据
        cFestivalBusinessData() {
            return this.$util.deepGet(this.festivalRes, 'store', []).map(item => ({
                _source: item,
                _id: item.id,
                name: item.name,
                addr: item.address,
                lat: item.lat,
                long: item.lng,
                phone: item.mobile
            }))
        },
        // 活动详情
        cFestivalDetails() {
            return this.$util.deepGet(this.festivalRes, 'content', '')
        },
        // 活动规则
        cRules() {
            return this.$util.deepGet(this.festivalRes, 'rule', '')
        },
        // 申请合作按钮是否显示
        cBtnCooperationVisible() {
            return this.festivalRes.is_business != undefined && +this.festivalRes.is_business !== 1
        },
		// 申请合作按钮的数据
		cBtnCooperationData() {
			return {
				style: `background-image:url(${this.$util.deepGet(this.festivalRes,'navigation_icon.0.file_path','')})`,
				link: this.$util.deepGet(this.festivalRes,'linkurl')
			}
		}
    },
    watch: {
        // 设置分享标题
        festivalRes(val) {
            // 设置分享数据
            // #ifdef MP-WEIXIN
            this.shareData = this.pageShareMixin_createShareData({
                title: this.$util.deepGet(val, 'share_title'),
                desc: this.$util.deepGet(val, 'share_description', ''),
                imgUrl: this.$util.deepGet(val, 'saapp_img.0.file_path', ''),
                query: {
                    theme_festival_id: this.$util.deepGet(this.options, 'theme_festival_id', '')
                }
            })
            // #endif
            // #ifdef H5
            this.shareData = this.pageShareMixin_createShareData({
                title: this.$util.deepGet(val, 'share_title'),
                desc: this.$util.deepGet(val, 'share_description', ''),
                imgUrl: this.$util.deepGet(val, 'wechat_img.0.file_path', ''),
                query: {
                    theme_festival_id: this.$util.deepGet(this.options, 'theme_festival_id', '')
                }
            })
            // #endif
            // 设置页面标题
            uni.setNavigationBarTitle({
			    title: val.special_name
            })
            // 设置按钮状态
            this.btnDisabled = this.getBtnBuyIsDisabled()
        }
    },
    onLoad(options) {
        this.options = options
        if (options.scene) {
        	const queryData = this.$util.scene_decode(options.scene) || {}
        	this.options = {
        		theme_festival_id: queryData.a,
        		...this.options
        	}
        }
    },
    async onShow() {
        try {
            // 确保静默登录了
            await this.mainMixin_BeforeFetchPageData()
            // 请求页面数据
            await Promise.all([
                this.fetchFestivalRes({
                	referee_id: this.notFirstShow ? '' : this.options.referee_id || ''
                }),
                this.fetchGoodsRes(),
                this.fetchDiyRes()
            ])
            this.notFirstShow = true
            // 开始播放音频
            this.audioStatus = 'play'
        } catch (e) {
            // TODO handle the exception
        }
        App.hideLoading()
    },
    onHide() {
        // 暂停播放音频
        this.audioStatus = 'pause'
    },
    methods: {
        // 立即购买按钮点击事件
        handleBtnBuyClick() {
            // goods_id=484&goods_num=1&goods_sku_id=0&goods_type=buy_member&is_express=1&is_zt=1&transport_type=20&paychannel=member_goods&order_type=1
            const goods = this.$util.deepGet(this.goodsRes, 'data', {})
            const have_in_wechat = this.$util.deepGet(this.goodsRes, 'have_in_wechat', '')
            // 活动不在进行中
            if (this.getBtnBuyIsDisabled()) {
                uni.showToast({
				    icon: 'none',
				    title: '活动未开始或已结束'
                })
                return
            }
            // 需要关注公众号
            if (+goods.handle === 2 && +have_in_wechat === 2) {
                this.followWechatPopupVisible = true
                return
            }
            // 没有商品信息
            if (!goods.goods_id) {
                uni.showToast({
                    icon: 'none',
                    title: '商品数据获取失败'
                })
                return
            }
            this.navigationTo('pages/subPages/flow/checkout?' + App.urlEncode({
                goods_id: goods.goods_id,
                goods_num: 1,
                goods_sku_id: this.$util.deepGet(goods, 'sku.0.spec_sku_id', ''),
                goods_type: '',
                is_express: goods.isexpress,
                is_zt: goods.iszt,
                transport_type: goods.transport_type,
                order_type: 1
            }))
        },
        // 得到购买按钮是否可以点击
        getBtnBuyIsDisabled() {
            const now = +new Date()
            if (this.cCountDownData.startTimeStamp <= now && now < this.cCountDownData.endTimeStamp) {
                return false
            }
            return true
        },
        // 请求活动相关数据
        async fetchFestivalRes({
            referee_id
        } = {}) {
            try {
                const res = await App._getP('festival.Festival/getThemeFestival', {
                    theme_festival_id: this.options.theme_festival_id,
                    referee_id
                })
                console.log('fetchFestivalRes', res)
                this.festivalRes = this.$util.deepGet(res, 'data', {})
            } catch (e) {
                // TODO handle the exception
            }
        },
        // 请求商品相关数据
        async fetchGoodsRes() {
            try {
                const res = await App._getP('festival.Festival/getGiftOrBlessing', {
		            theme_festival_id: this.options.theme_festival_id
		        })
                console.log('fetchFestivalRes', res)
                this.goodsRes = this.$util.deepGet(res, 'data', {})
            } catch (e) {
                // TODO handle the exception
            }
        },
        // 请求diy相关数据
        async fetchDiyRes() {
		    try {
		        const res = await App._getP('festival.Festival/getFestivalDiyPage', {
		            theme_festival_id: this.options.theme_festival_id
		        })
		        console.log('fetchFestivalRes', res)
		        this.diyRes = this.$util.deepGet(res, 'data', {})
		    } catch (e) {
		        // TODO handle the exception
		    }
        }
    }
}
</script>

<style lang="scss" scoped>
	.page-makingFestival {
		min-height: 100vh;
		padding-bottom: 300rpx;
	}
	.makingFestival-banner_img {
		width: 100%;
		height: 530rpx;
	}
	.page-makingFestival__footer {
		display: flex;
		flex-direction: column;
	}
	.page-makingFestival__btn-cooperation {
		align-self: flex-end;
		width: 120rpx;
		height: 120rpx;
		background-image: url(static/images/btn-cooperation.png);
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
	}
	.page-makingFestival__op-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 4rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-bottom: 30rpx;
	}
	.page-makingFestival_btn-home {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100rpx;
		height: 100rpx;
		font-size: 24rpx;
		background-color: #FFD940;
		border-radius: 100%;
		border: 1px solid #333;
		box-shadow: 0 3px #876D05,0 4px #333;
		.iconfont {
			font-size: 30rpx;
			color: inherit;
		}
	}
	.page-makingFestival_btn-buy {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 560rpx;
		height: 100rpx;
		font-size: 32rpx;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		background-color: #FF4444;
		border-radius: 50rpx;
		border: 1px solid #333;
		box-shadow: 0 3px #7E0404,0 4px #333;
		&.is-disabled {
			background-color: #BDBDBD;
			box-shadow: 0 3px #666666,0 4px #333;
		}
	}
	// 引导关注公众号
	.community-detail {
		border-radius: 20rpx;
		padding-bottom: 35rpx;
		overflow: hidden;
	}

	.icon-roundclose {
		position: absolute;
		left: 50%;
		bottom: -40px;
		display: inline-lock;
		font-size: 50rpx;
		width: 1em;
		height: 1em;
		line-height: 1em;
		color: #FFFFFF;
		transform: translateX(-50%);
	}

	.community-detail .community-header {
		width: 70vw;
		height: 210rpx;
		background-size: 100% 100%;
	}

	.community-detail .community-header::after {
		content: " ";
		position: absolute;
		top: -160rpx;
		left: -25%;
		width: 150%;
		height: 280rpx;
		border-radius: 60%;
		background: #FFD940;
		background: var(--theme-color);
		z-index: 1;
	}

	.community-detail .community-header .attention {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 153rpx;
		height: 135rpx;
		display: block;
		z-index: 10;
	}

	.community-detail .community-body {
		padding: 50rpx;
	}

	.community-detail .community-reply {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #FFD941;
		border-radius: 35rpx;
		margin: 0 auto;
	}

	.img_shouzhi {
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		top: 50%;
		left: 50%;
	}

	.attention-box {
		background: #FFFFFF;
		width: 530rpx;
		border-radius: 10rpx;
		padding: 50rpx 50rpx 30rpx;
		position: relative;
	}

	.attention-box .icon-roundclose {
		position: absolute;
		left: 50%;
		bottom: -2em;
		transform: translateX(-50%);
		font-size: 52rpx;
		color: #FFFFFF;
		width: 1em;
		height: 1em;
		line-height: 1em;
		text-align: center;
	}

	.attention-box .attention-title {}

	.attention-label {
		margin-bottom: 30rpx;
	}

	.attention-label .label-num {
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 4rpx;
		background: #FFD940;
		margin-right: 10rpx;
	}

	.wechat-image {
		width: 264rpx;
		height: 264rpx;
		display: block;
		margin: 0 auto;
	}

	.dialogue-wechat {}

	.dialogue-info {
		width: 460rpx;
		margin: 0 auto;
		background: #EEEEEE;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.dialogue-detail {
		position: relative;
		border-radius: 10rpx;
		flex: 1;
		padding: 12rpx;
	}

	.dialogue-detail::after {
		content: " ";
		position: absolute;
		top: 12px;
		left: -10px;
		width: 0;
		height: 0;
		border: 5px solid transparent;
		border-right-color: #FFFFFF;
	}

	.wechat-img {
		position: relative;
		font-size: 22rpx;
		width: 80rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background: #FFFFFF;
		margin-right: 20rpx;
	}

	.wechat-img::after {
		content: "公众号";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0.75);
		font-size: 22rpx;
		width: 100%;
		height: 100%;
	}

	.dialogue-img {
		width: 460rpx;
		height: 60rpx;
		display: block;
		margin: 0 auto;
	}

	.dialogue-we {
		width: 60rpx;
		height: 60rpx;
		display: block;
	}

	// 引导关注 end
</style>
