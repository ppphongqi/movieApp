<template>
	<view class="luck-draw app-clearfix">
		<!-- 时间 -->
		<view class="luck-draw__time">活动时间：{{cDetails.timeStr}}</view>
		<!-- 时间 end -->
		<!-- 数量 -->
		<view class="luck-draw__num">已领<text class="is-strong">{{cDetails.receivedNum}}</text>/共{{cDetails.totalNum}}份</view>
		<!-- 数量 end -->
		<!-- 进度 -->
		<u-line-progress active-color="#FFD940" inactive-color="#F8F8F8" :height="18" :percent="cDetails.percent"
		 :show-percent="false">
		</u-line-progress>
		<!-- 进度 end -->
		<!-- 奖品列表 -->
		<view class="prize-list">
			<view v-for="item in cListData" :key="item._id" class="prize-item" @click="handlePrizeItemClick(item)">
				<view class="prize-card" :style="{backgroundImage: `url(${item.imgUrl})`}" :class="{'is-disabled': !item.num}">
					<view class="prize-card__text" :style="{color: item.textColor,transform: `translateY(${item.textTransform}px)`}">{{item.text}}</view>
					<view v-if="item.num" class="price-card__num">{{item.num}}</view>
				</view>
			</view>
		</view>
		<!-- 键盘列表 end -->
		<!-- 操作按钮区域 -->
		<view class="luck-draw-op-section">
			<!-- 抽奖按钮 end -->
			<button v-if="cDetails.btnReceiveVisible" class="luck-draw__btn-op is-fluid-yellow btn-normal" @click="handleBtnReceiveClick">点我领奖</button>
			<block v-else>
				<view class="luck-draw-op-section__left">
					<!-- 抽奖按钮 -->
					<button class="luck-draw__btn-op is-animation is-yellow btn-normal" @click="handleBtnDrawClick">点我抽奖(剩余{{cDetails.remainingTimes}}次)</button>
				</view>
				<view class="luck-draw-op-section__right">
					<!-- 求助好友按钮 -->
					<button class="luck-draw__btn-op is-animation is-red btn-normal" open-type="share" @click="handleBtnHelpClick">求助好友</button>
					<!-- 求助好友按钮 end -->
				</view>
			</block>

		</view>
		<!-- 操作按钮区域 end -->

		<view class="luck-draw__btn-rule" @click="rulesPopupVisible = true">兑换规则<view class="iconfont icon-wenhaoxiao"></view>
		</view>
		<!-- 抽中的弹窗 -->
		<popup-view :show="successPopupVisible" :overlay="true" @clickmask="rulesPopupVisible = false">
			<view class="success-card" @click="successPopupVisible = false">
				<image class="success-card__img-success" src="../static/images/img-hook--ashen.png" />
				<view class="success-card__title">恭喜您</view>
				<view class="success-card__text">抽到一张【{{cLottery.text}}】卡</view>
				<view class="success-card__times">剩余{{cDetails.remainingTimes}}次</view>
				<button v-if="cLottery.btnShareVisible" class="success-card__btn-share btn-normal" open-type="share" @click.stop="handleBtnShareClick">赠送好友<view
					 class="iconfont iconfont-line icon-right"></view></button>
			</view>
		</popup-view>
		<!-- 抽中的弹窗 end -->
		<!-- 分享的卡片 -->
		<popup-view :show="sharePopupVisible" :overlay="true" @clickmask="sharePopupVisible = false">
			<view class="share-card">
				<view class="share-card__text">{{lotteryToShare.text}}</view>
				<view v-if="cDetails.canSharePrize && lotteryToShare.num > 1" class="share-card__tip">{{lotteryToShare.shareDesc}}</view>
				<button v-if="cDetails.canSharePrize && lotteryToShare.num > 1" class="share-card__btn-share btn-normal" open-type="share"
				 @click.stop="handleBtnShareClick">赠送好友<view class="iconfont iconfont-line icon-right"></view></button>
			</view>
		</popup-view>
		<!-- 分享的卡片 end -->
		<!-- 活动规则弹窗 -->
		<popup-view :show="rulesPopupVisible" :overlay="true" @clickmask="rulesPopupVisible = false">
			<view class="rules-card">
				<view class="rules-card__content">
					<text>{{cDetails.rules}}</text>
				</view>
			</view>
		</popup-view>
		<!-- 活动规则弹窗 end -->
		<!-- 微信公众号分享引导弹窗 -->
		<popup-view :show="wechatGuidePopupVisible" type="top" :overlay="true" @clickmask="wechatGuidePopupVisible = false">
			<view class="wechat-guide-card" @clickmask="wechatGuidePopupVisible = false">
				<!-- 这个图片报500 还没确定原因 -->
				<image class="wechat-guide-card_img" src="../static/images/img-wechat-h5-share-guide.png" mode="widthFix"></image>
			</view>
		</popup-view>
		<!-- 微信公众号分享引导弹窗 end -->
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
					<button class="community-reply f-24 col-3" open-type="contact" :send-message-img="cFollowWechatData.img"
					 :send-message-path="cFollowWechatData.path" :send-message-title="cFollowWechatData.title" show-message-card>去关注</button>
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
				<image :src="detailsRes.subscribe_wechat_img" class="wechat-image"></image>
				<view class="attention-label dis-flex flex-y-center m-top30 col-3 f-24">
					<view class="label-num  backColor auxiliary-color">2</view>
					<view class="attention-text">点击识别二维码弹出的内容参与抽奖</view>
				</view>
				<view class="dialogue-wechat">
					<view class="dialogue-info dis-flex">
						<view class="wechat-img"></view>
						<view class="dialogue-detail b-f flex-box">
							<view class="dialogue-name f-24 col-3 onelist-hidden">{{cFollowWechatData.title}}</view>
							<image src="/static/images/shouzhi.png" class="img_shouzhi"></image>
							<view class="dis-flex flex-x-between">
								<view class="f-24 col-9">点击参与抽奖~</view>
								<image :src="cFollowWechatData.qrCode" class="dialogue-we"></image>
								<!-- <image src="" class="dialogue-we"></image> -->
							</view>
						</view>
					</view>
					<image src="/static/images/dialogue.png" class="dialogue-img"></image>
				</view>
				<view class="iconfont icon-roundclose" @click="followWechatPopupVisible = false"></view>
			</view>
			<!-- #endif -->
		</popup-view>
		<!-- 关注公众号弹窗 end -->
	</view>
</template>

<script>
// 这个组件是个智能组件 仅用传个blessing_id就可以实现几乎所有功能
import App from '@/common/js/app.js'
import {
    dateFormat
} from '@/common/js/date.js'
import {
    wxRequestSubscribeMessageX
} from '@/common/js/wxPromise.js'
import PopupView from '@/components/template/PopManager.vue'

export default {
    components: {
        PopupView
    },
    props: {
        // 福袋活动id
        blessingId: {
            type: String,
            default: ''
        },
        // 求助id
        helpId: {
            type: String,
            default: ''
        },
        // 福卡index
        fontIndex: {
            type: String,
            default: ''
        },
        // logId
        logId: {
            type: String,
            default: ''
        },
        // 福袋列表数据
        listData: {
            type: Array,
            default() {
                return [
                    // {
                    //     _id: '01',
                    //     imgUrl: 'https://zerodev.weliam.com.cn/addons/weliam_areashop/web/assets/store/img/blessing/system_template_c5.png',
                    //     text: '微',
                    //     num: 9
                    // }
                ]
            }
        }
    },
    data() {
        return {
            // 抽奖详情的接口数据
            detailsRes: {},
            // 抽奖结果信息的原始数据
            lotteryRes: {},
            // logId的接口数据
            logIdRes: {},
            // 当前页面分享时url上的query
            pageShareOptions: {

            },
            // 当前要显示的分享卡片对应的奖品项
            lotteryToShare: {},
            // 是否正在抽奖
            isDrawing: false,
            // 是否显示抽中的弹窗
            successPopupVisible: false,
            // 是否显示分享的弹窗（点击奖品列表显示出来的）
            sharePopupVisible: false,
            // 是否显示活动规则弹窗
            rulesPopupVisible: false,
            // 微信公众号分享引导弹窗是否显示
            wechatGuidePopupVisible: false,
            // 关注公众号弹窗是否显示
            followWechatPopupVisible: false
        }
    },
    computed: {
        // 引导关注公众号卡片的数据
        cFollowWechatData() {
            const details = this.detailsRes || {}
            return {
                img: details.blessing_sapp_img,
                path: 'blessingBag?theme_festival_id=' + this.blessingId,
                title: details.title,
                qrCode: details.blessing_img
            }
        },
        // 格式化的福袋详情数据
        cDetails() {
            const details = this.detailsRes || {}
            // 已经领取数量
            const receivedNum = this.$util.deepGet(details, 'prize.0.prize_get_num', 0)
            // 共有多少待领取
            const totalNum = this.$util.deepGet(details, 'prize.0.prize_num', 0)
            // 领取进度
            let percent = 0
            if (receivedNum && totalNum) {
                percent = receivedNum / totalNum * 100
            }
            // 当前福袋详情数据
            return {
                // 活动时间字符串
                timeStr: dateFormat(details.start_time, {
                    format: 'YYYY.MM.DD'
                }) + '-' + dateFormat(details.end_time, {
                    format: 'YYYY.MM.DD'
                }),
                // 已经领取数量
                receivedNum,
                // 共有多少待领取
                totalNum,
                // 领取进度
                percent,
                // 剩余抽奖次数
                remainingTimes: details.user_open_num || 0,
                // 是否开启转赠
                canSharePrize: +this.$util.deepGet(details, 'setting.is_give', '') === 1,
                // 活动规则
                rules: details.blessing_rule || '',
                // 求助好友按钮是否显示
                btnHelpVisible: false,
                // 点我领奖按钮是否显示
                // blessDetail.user_status == 1 && blessDetail.is_win_user_draw ==2
                btnReceiveVisible: +details.user_status === 1 && +details.is_win_user_draw === 2
            }
        },
        // 奖品列表
        cListData() {
            const list = this.detailsRes.font || []
            return list.map(item => {
                // 要显示的图片
                let imgUrl = this.$util.deepGet(item, 'gray_img.0.file_path', '')
                // 已经领取的数量
                const num = item.num || 0
                if (num > 0) {
                    imgUrl = this.$util.deepGet(item, 'colours_img.0.file_path', '')
                }
                // 文字的颜色
                let textColor = this.$util.deepGet(this.detailsRes, 'setting.font_color_no', '')
                if (num > 0) {
                    textColor = this.$util.deepGet(this.detailsRes, 'setting.font_color', '')
                }
                // 文字向上偏移量(为了调整文字在图片上的视觉位置)
                let textTransform = 0
                const template = this.$util.deepGet(this.detailsRes, 'setting.template', '')
                switch (+template) {
                case 2:
                    textTransform = uni.upx2px(-16)
                    break
                case 3:
                    textTransform = uni.upx2px(14)
                    break
                default:
                    break
                }
                return {
                    _id: item.id,
                    fontIndex: item.font_index,
                    // 背景图片
                    imgUrl,
                    // 文字
                    text: item.name,
                    // 文字颜色
                    textColor,
                    // 文字向上便宜量(px)
                    textTransform,
                    // 该礼物已领取数量
                    num: item.num || 0,
                    // 分享卡片的描述
                    shareDesc: item.description || ''
                }
            })
        },
        // 格式化的抽奖成功结果数据
        cLottery() {
            // 抽中的字
            const font = this.cListData.find(item => item.fontIndex === this.lotteryRes.font_index) || {}
            return {
                // 抽中的字
                text: this.lotteryRes.name,
                // 是否显示转赠按钮
                btnShareVisible: this.cDetails.canSharePrize && font.num > 1
            }
        },
        cPageShareQueryChangeTrigger() {
            return [
                this.logIdRes,
                this.globalSaveRefereeId
            ]
        }
    },
    watch: {
        blessingId(val) {
            console.log('blessingId 222222', val)
        },
        sharePopupVisible(val) {
            if (val && this.cDetails.canSharePrize && this.lotteryToShare.num > 1) {
                // 需要改变分享的参数
                this.fetchLogIdRes()
            } else if (!val) {
                this.logIdRes = {}
            }
        },
        successPopupVisible(val) {
            console.log('显示抽中弹窗')
            if (this.cDetails.canSharePrize) {
                // 需要改变分享的参数
                this.fetchLogIdRes()
            } else if (!val) {
                this.logIdRes = {}
            }
        },
        cPageShareQueryChangeTrigger: {
            handler() {
                this.emitPageShareQueryChange({
                    blessing_id: this.blessingId,
                    log_id: this.logIdRes.log_id,
                    font_index: this.lotteryToShare.fontIndex,
                    help_id: this.globalSaveRefereeId
                })
            },
            immediate: true
        }
    },
    async mounted() {
        try {
            // if(!this.options.blessingId) return
            await this.fetchDetailsRes({
                referee_id: this.helpId
            })
            // 领取别人的福卡如果有必要的话
            await this.fetchFontIfNeeded()
        } catch (e) {
            // TODO handle the exception
        }
    },
    methods: {
        // 求助按钮点击事件
        handleBtnHelpClick() {
            // #ifdef H5
            this.wechatGuidePopupVisible = true
            // #endif
        },
        // 赠送按钮点击事件
        handleBtnShareClick() {
            // #ifdef H5
            this.wechatGuidePopupVisible = true
            // #endif
        },
        // 点我领奖按钮事件
        handleBtnReceiveClick() {
            this.navigationTo('pages/subPages/drawlotter/detail/newDetail?type=3&blessing_id=' + this.blessingId)
        },
        // 奖品项点击事件
        handlePrizeItemClick(item) {
            if (item.num < 1) {
                return
            }
            this.lotteryToShare = item
            this.sharePopupVisible = true
        },
        /**
			 * 抽奖按钮点击事件
			 * 1.没有剩余次数了提示抽奖次数不住"抽奖次数不足"
			 * 2.小程序中是第一次抽奖要先提示订阅消息(没有中奖卡片就是第一次抽奖)
			 * 3.正常抽奖
			 */
        async handleBtnDrawClick() {

            // 锁
            if (this.isDrawing) {
                return
            }
            // 没有剩余抽奖次数了
            if (this.cDetails.remainingTimes <= 0) {
                uni.showToast({
                    title: '抽奖次数不足',
                    icon: 'none'
                })
                return
            }
            // 没有关注公众号就先关注公众号
            if (+this.$util.deepGet(this.detailsRes, 'is_subscribe') === 1 && +this.$util.deepGet(this.detailsRes, 'have_in_wechat') === 2) {
                console.log('没有关注公众号就先关注公众号', this.cFollowWechatData)
                this.followWechatPopupVisible = true
                return
            }
            this.isDrawing = true
            // 小程序中第一次抽奖
            // #ifdef MP-WEIXIN
            if (!this.cListData.find(item => item.num > 0)) {
                // 没有中奖卡片就是第一次抽奖
                try {
                    // 获取templatesId
                    const res = await App._postP('wxapp.sub/getIds', {
                        op: 'lottery'
                    })
                    const drawTmplIds = this.$util.deepGet(res, 'data') || []
                    // 进行消息订阅
                    await wxRequestSubscribeMessageX({
                        tmplIds: drawTmplIds,
                        showMessage: false
                    })
                    console.log('进行消息订阅 完成')
                } catch (e) {
                    console.log('handleBtnDrawClick', e)
                    this.isDrawing = false
                    // 跳出整个handleBtnDrawClick方法
                    return
                }
            }
            // #endif
            // 正常抽奖流程
            App.showLoading({
                title: '抽奖中~'
            })
            try {
                // 获取经纬度
                const location = await App.getLocation()
                if (!location.latitude || !location.longitude) {
                    App.showError('获取位置信息失败，请稍候或检查定位设置后重试')
                    this.isDrawing = false
                    return
                }
                // 进行抽奖
                const res = await this.fetchLotteryRes({
                    blessing_id: this.blessingId,
                    lat: location.latitude,
                    lng: location.longitude
                })
                if (this.$util.deepGet(res, 'font_index')) {
                    // 显示抽奖结果弹窗
                    this.successPopupVisible = true
                }
                // 刷新详情数据
                await this.fetchDetailsRes()
            } catch (e) {
                console.log(e)
                // TODO handle the exception
            }
            uni.hideLoading()
            // 解锁
            this.isDrawing = false
        },
        // 触发页面分享参数的改变
        emitPageShareQueryChange(query = {}) {
            this.$emit('on-page-share-query-change', query)
        },
        // 请求活动相关数据
        async fetchDetailsRes({
            // 如果是领取别人求助就需要这个参数,对应this.helpId
            referee_id
        } = {}) {
            if (!this.blessingId) {
                return
            }
            try {
                const res = await App._getP('blessing.blessing/detail', {
                    blessing_id: this.blessingId,
                    referee_id
                })
                console.log('fetchFestivalRes', res)
                this.detailsRes = this.$util.deepGet(res, 'data', {})
            } catch (e) {
                // TODO handle the exception
            }
        },
        // 请求抽奖结果信息
        async fetchLotteryRes({
            // 如果是领取别人分享得奖品就需要这个参数
            blessing_id,
            lat,
            lng
        } = {}) {
            try {
                const res = await App._postP('blessing.blessing/join', {
                    blessing_id,
                    lat,
                    lng
                })
                this.lotteryRes = this.$util.deepGet(res, 'data', {})
                return Promise.resolve(this.lotteryRes)
            } catch (e) {
                // TODO handle the exception
            }
        },
        // 请求logid
        async fetchLogIdRes() {
            try {
                const res = await App._postP('blessing.blessing/forward', {
                    blessing_id: this.blessingId,
                    font_index: this.lotteryToShare.fontIndex
                })
                this.logIdRes = this.$util.deepGet(res, 'data', {})
                return Promise.resolve(this.logIdRes)
            } catch (e) {
                // TODO handle the exception
            }
        },
        // 领取别人赠送的福卡如果有必要的话
        async fetchFontIfNeeded() {
            if (this.helpId && !this.blessingId || !this.fontIndex || !this.logId) {
                return
            }
            try {
                const res = await App._postP('blessing.blessing/shareFont', {
                    blessing_id: this.blessingId,
                    font_index: this.fontIndex,
                    log_id: this.logId
                })
                if (this.$util.deepGet(res, 'data') != true) {
                    await this.fetchDetailsRes()
                    uni.showToast({
                        icon: 'success',
                        // title: result.msg
                        title: '领取成功'
                    })
                }
            } catch (e) {
                // TODO handle the exception
            }
        }
    }
}
</script>

<style lang="scss" scoped>
	.luck-draw__time {
		margin-top: 12rpx;
		font-size: 24rpx;
		color: #999;
	}

	.luck-draw__num {
		margin-top: 24rpx;
		font-size: 28rpx;
		color: #333333;

		.is-strong {
			color: #FF4444;
		}
	}

	.prize-list {
		display: flex;
		flex-wrap: wrap;
		padding: 40rpx 0;
		margin-top: 40rpx;
		border-top: 1px solid #EEEEEE;
	}

	.prize-item {
		display: flex;
		align-items: center;
		$col: 4;
		width: percentage(1/$col);

		&:nth-child(n + #{$col+1}) {
			margin-top: 20rpx;
		}
	}

	.prize-card {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 142rpx;
		height: 142rpx;
		color: #A2393C;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;

		&.is-disabled {
			color: #999;
		}
	}

	.prize-card__text {
		// 每一张背景图对应的位置还不一样。需要根据情况单独设置
		position: relative;
		top: 0;
		right: 0;
		font-weight: bold;
		font-size: 36rpx;
	}

	.price-card__num {
		box-sizing: border-box;
		position: absolute;
		top: 0;
		right: 0;
		min-width: 30rpx;
		height: 30rpx;
		padding: 0 4rpx;
		text-align: center;
		line-height: 30rpx;
		color: #fff;
		font-size: 24rpx;
		border-radius: 15rpx;
		background-color: #FF4444;
	}

	.success-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 560rpx;
		height: 800rpx;
		padding-top: 84rpx;
		padding-bottom: 40rpx;
		color: #7C4A44;
		background-image: url(../static/images/bg-draw-success.png);
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;

		& .iconfont {
			color: inherit;
		}
	}

	.success-card__img-success {
		width: 100rpx;
		height: 100rpx;
	}

	.success-card__title {
		margin-top: 28rpx;
		font-weight: bold;
		font-size: 28rpx;
	}

	.success-card__text {
		margin-top: 40rpx;
		font-weight: bold;
		font-size: 42rpx;
	}

	.success-card__times {
		margin-top: auto;
		font-size: 24rpx;
	}

	.success-card__btn-share {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 50rpx;
		padding: 0 16rpx;
		margin-top: 32rpx;
		font-size: 28rpx;
		color: inherit;
		background-color: rgba($color: #7C4A44, $alpha:0.1);
		border-radius: 4rpx;

		& .iconfont {
			margin-left: 8rpx;
			font-size: 20rpx;
		}
	}

	.share-card {
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 560rpx;
		height: 800rpx;
		padding-top: 80rpx;
		padding-bottom: 153rpx;
		color: #7C4A44;
		background-image: url(../static/images/bg-draw-share-popup.png);
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;

		& .iconfont {
			color: inherit;
		}

		&::after {
			position: absolute;
			top: 360rpx;
			left: 50%;
			display: block;
			content: "";
			width: 381rpx;
			height: 14rpx;
			transform: translateX(-50%);
			background-image: url(../static/images/img-draw-share-line.png);
			background-position: center;
			background-size: contain;
			background-repeat: no-repeat;
		}
	}

	.share-card__text {
		font-weight: bold;
		font-size: 200rpx;
	}

	.share-card__tip {
		margin-top: 100rpx;
		font-weight: bold;
		font-size: 24rpx;
	}

	.share-card__btn-share {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 64rpx;
		padding: 0 16rpx;
		margin-top: auto;
		font-size: 28rpx;
		color: inherit;
		background-color: #FBCC19;
		border: 1px solid #7C4A44;
		border-radius: 4rpx;

		& .iconfont {
			margin-left: 8rpx;
			font-size: 20rpx;
		}
	}

	.rules-card {
		box-sizing: border-box;
		width: 600rpx;
		height: 735rpx;
		padding-top: 107rpx;
		background-image: url(../static/images/bg-gift-bag-rules-popup.png);
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.rules-card__content {
		width: 500rpx;
		height: 600rpx;
		margin: 0 auto;
		overflow-y: auto;
	}

	.luck-draw__btn-rule {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40rpx;
		margin-top: 40rpx;

		&,
		.iconfont {
			font-size: 28rpx;
			color: #999999;
		}

		.iconfont {
			margin-left: 8rpx;
		}
	}

	.luck-draw-op-section {
		display: flex;
		align-items: center;
	}

	.luck-draw-op-section__right {
		margin-left: auto;
	}

	.luck-draw__btn-op {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 92rpx;
		margin-top: 30rpx;
		padding-bottom: 20rpx;
		color: #C94600;
		font-weight: bold;
		font-size: 28rpx;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		transform-origin: center;

		&.is-animation {
			animation: twinkle 0.5s infinite;
			animation-direction: alternate;
		}

		&.is-yellow {
			width: 346rpx;
			background-image: url(../static/images/bg-btn--yellow.png);
		}

		&.is-fluid-yellow {
			width: 630rpx;
			background-image: url(../static/images/bg-btn-fluid--yellow.png);
		}

		&.is-red {
			width: 250rpx;
			color: #fff;
			background-image: url(../static/images/bg-btn--red.png);
		}
	}

	@keyframes twinkle {
		from {
			transform: scale(0.968888);
		}

		to {
			transform: scale(1.016638);
		}
	}

	.wechat-guide-card_img {
		width: 750rpx;
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
