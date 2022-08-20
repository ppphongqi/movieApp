<template>
	<view :style="themeColor">
		<view class="container" v-if="isData">
			<!-- 头部背景图 -->
			<view class="dealer-bg">
				<!-- <image :src="getImageRoot('16.png')"></image> -->
				<image class="main-bg-color"></image>
			</view>

			<!-- 填写申请信息 -->
			<view class="apply-content dis-flex flex-dir-column flex-y-center">
				<view class="widget-form b-f m-top20 dis-flex flex-dir-column flex-x-center flex-y-center">
					<view class="widget-form-title">
						<view class="form-title f-28">请您填写申请信息</view>
						<view class="form-title-before main-bg-color"></view>
					</view>
					<view class="form-box dis-flex flex-dir-column">
						<form @submit="formSubmit" report-submit="true">
							<!-- <scroll-view scroll-y="true" style="height: 848rpx;"> -->
								<view>
									<view v-if="cInviteesVisible" class="form-field dis-flex flex-y-center">
										<view class="field-label">邀请人</view>
										<view class="field-input onelist-hidden" style="margin-right: 10upx;">
											<text>{{ ApplyStateDetail.referee_name }}（请核对）</text>
										</view>
									</view>
									<view class="form-field dis-flex flex-y-center">
										<view class="field-label">姓名</view>
										<view class="field-input flex-box">
											<input name="name" placeholder="请输入真实姓名" :disabled="disabled" v-model="nameText"></input>
										</view>
									</view>
									<view class="form-field dis-flex flex-y-center" v-if="appClientType === '3'">
										<view class="field-label">手机号</view>
										<view class="field-input flex-box">
											<input name="mobile" placeholder="请输入手机号" v-model="mobile"></input>
										</view>
									</view>
									<block v-if="appClientType === '4' && !hasMobile">
										<view class="form-field dis-flex flex-y-center">
											<view class="field-label">手机号</view>
											<view class="field-input">
												<input name="mobile" placeholder="请输入手机号" v-model="mobile" maxlength="11"></input>
											</view>
										</view>
										<view v-if="is_bind_mobile" class="form-field dis-flex flex-y-center">
											<view class="field-label">验证码</view>
											<view class="field-input flex-box dis-flex flex-y-center p-r">
												<input name="code" placeholder="短信验证码" class="flex-box" v-model="verCode"></input>
												<view class="getcode-btn" @click="getCode">{{codeMsg}}</view>
											</view>
										</view>
									</block>

									<diy-form v-if="diyDatas.length>0" ref="diyForm" @changeFormDatas="changeFormDatas" :city-picker-visibility=false  :picker-time-visibility=false :form-id="form_id" :diy-datas="diyDatas"></diy-form>

									<view class="form-submit dis-flex flex-x-center">
										<view class="p-r flex-box">
											<bind-mobile-button @onBindSuccess="getPhoneNumber" v-if="!hasMobile && appClientType !== '4'"></bind-mobile-button>
											<button formType="submit" class="main-bg-color auxiliary-color" @click="applySubmit(nameText,mobile,verCode)">
											{{ disabled?"等待审核":appDiyFont.apply}}
											</button>
										</view>
									</view>
								</view>
							<!-- </scroll-view> -->
						</form>
					</view>
				</view>

				<view class="dealer-rights module-content dis-flex flex-dir-column flex-x-center flex-y-center">
					<view class="widget-form-title">
						<view class="form-title f-28">{{appDiyFont.equity}}</view>
						<view class="form-title-before main-bg-color"></view>
					</view>
					<view class="rights-content">
						<parse :html="license"></parse>
					</view>
				</view>
			</view>
			<!-- 等待审核 -->
		</view>
		<!-- 关注公众号 -->
		<popup-view :show="showAttention" type="center" @clickmask="attentionClose">
			<view class="community-detail b-f t-c p-r">
				<view class="iconfont icon-roundclose" @click="attentionClose"></view>
				<view class="community-header f-w f-44 p-r" :style="{'background-image':getImageRoot('61.png','url')}">
					<image src="/static/images/attention-wx.png" class="attention"></image>
				</view>
				<view class="community-body f-26 col-3 t-c">
					<view class="t-c">点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{ApplyStateDetail.push_keyword}}</text>”</view>
					<view class="f-26 col-3">关注公众号，即时获悉官方动态</view>
				</view>
				<button class="community-reply f-24 col-3" open-type="contact">去回复</button>
			</view>
		</popup-view>


		<!-- 快捷导航 -->
		<shortcut id=""></shortcut>
		<!-- 支付组件 -->
		<OrderPay ref="orderPay" @paySuccess="paySuccess" @payFail="payFail"></OrderPay>
		<!-- 支付组件 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import Parse from '@/components/threeComponents/jyf-Parser/index'
import shortcut from '@/components/template/ShortCut.vue'
import PopupView from '@/components/template/PopManager.vue'
import BindMobileButton from '@/components/template/BindMobileButton.vue'
import DiyForm from '@/components/page/DiyForm.vue'
import OrderPay from "@/components/template/OrderPayPopups.vue"

export default {
	components: {
	    Parse,
	    shortcut,
	    BindMobileButton,
	    PopupView,
	    DiyForm,
		OrderPay
	},
    data() {
        return {
            is_read: false,
			is_bind_mobile: false,
            disabled: false,
            isData: false,
            stopClick: false,
            background: '',
            license: '',
            words: null,
            nameText: null,
            mobile: null,
            ApplyStateDetail: {},
            referee_id: null,
            imageProp: {
                mode: 'aspectFit',
                padding: 0,
                lazyLoad: false,
                domain: ''
            },
            verCode: '', // 短信验证码
            countdown: 60, // 按钮上的文字
            codeMsg: '获取验证码', // 定时器
            codeDisabled: false,
            timer: null,
            showAttention: false, // 显示关注二维码
            card_type: 2,
            form_id: '',
            diyDatas: [],
            form_submit_id: '',
            formErr: false
        }
    },
    computed: {
		// 付费申请相关信息
		cPayApply() {
			const appSetting = this.$store.state.appSetting || {}
			return {
				actual_pay_price: appSetting.apply_pay_price || 0,
				isPay: appSetting.become == 5,
				become: appSetting.become
			}
		},
        // 是否显示邀请人字段
        cInviteesVisible() {
            let appSetting = this.$store.state.appSetting
            return +this.$util.deepGet(appSetting, 'dealer_basic.is_show_referee') === 1
        },
        appDiyFont() {
            let appSetting = this.$store.state.appSetting
            if (appSetting) {
                uni.setNavigationBarTitle({
                    title: appSetting.diy_font && appSetting.diy_font.apply ? appSetting.diy_font.apply : ''
                })
				if(this.cPayApply.isPay) {
					return {
						...appSetting.diy_font,
						apply: `付费申请（￥${this.cPayApply.actual_pay_price}）`
					}
				}else {
					return appSetting.diy_font
				}

            }
            return {}

        },
        userInfo() {
            return uni.getStorageSync('userInfo') || {}
        },
        hasMobile() {
            let hasMobile = !(this.$util.isEmptyMobile(this.userInfo.mobile))
            console.log('hasMobile', hasMobile)
            if (hasMobile) {
                this.mobile = this.userInfo.mobile
            }
            return hasMobile
        }
    },
	watch: {
		'settingData.diy_font': {
			handler(val={}) {
				uni.setNavigationBarTitle({
					title: val.apply || '申请分销'
				})
			},
			immediate: true
		}
	},
    async onLoad(e) {
        await this.getFormInfo()
		this.setIndex()
        console.log(e, '--------------')
        App.showLoading()
        let clientType = App.getClientType(),
            getRefereId = App.getRefereId(),
            scene = App.getSceneData(e),
            userInfo = uni.getStorageSync('userInfo'),
            referee_id = getRefereId ? getRefereId : (e.referee_id ? e.referee_id : (scene.referee_id ? scene.referee_id : ''))
        console.log('referee_id:' + referee_id)
        this.referee_id = referee_id
        if (!!referee_id) {
            App.saveRefereeId(referee_id)
        }
		

        // #ifdef MP-ALIPAY
        if (App.query) {
            referee_id = App.query.referee_id
        }
        // #endif
        console.log('userInfo', userInfo)
        this.card_type = userInfo.is_member ? 1 : 2
        if (userInfo && !(this.$util.isEmptyMobile(userInfo.mobile))) {
            this.mobile = userInfo.mobile
        }

        // if (userInfo && this.$util.isEmptyMobile(userInfo.mobile)) {
        // 	App.showError("请先绑定手机号", () => {
        // 		App.navigationTo({
        // 			url: "pages/subPages/user/index"
        // 		});
        // 	})
        // } else {
        //
        // }

        // 获取分销商申请状态
        this.getApplyState()
    },
    onShow() {

    },
    mounted() {

    },
    onUnload() {
        clearInterval(this.timer)
        this.timer = null
    },
    methods: {
		// 切换支付弹窗的显示
		onToggleList() {
			this.$refs.orderPay.onToggleList();
		},
		// 支付成功
		paySuccess({order}={}) {
			uni.hideLoading();
			if((order && order.payment) || (order && order.payment && order.payment.appId)) {
				console.log('付费申请成功',order)
				this.getApplyState(this.ApplyStateDetail.is_dealer_wechat)
			}
			this.stopClick = false
		},
		// 支付失败
		payFail() {
			uni.hideLoading();
			this.stopClick = false
		},
        // 自定义表单模板
        async getFormInfo() {
            try {
                const res = await App._postP('form.form/formDetail', { type: 4 })
                if (res.code === 1) {
					    this.form_id = res.data.form_id || ''
					    this.diyDatas = res.data.value || []
                }
            } catch (e) {
                console.log(e)
            }
        },
        // 监听表单
        changeFormDatas(datas) {
            this.diyDatas = datas
        },
        /**
			 * 获取用户微信手机号
			 */
        getPhoneNumber(e) {
            let _this = this,
                name = _this.nameText
            _this.mobile = e.mobile
            if (!name) {
                App.showError('请填写姓名')
                return false
            }
            _this.applySubmit(name, _this.mobile)
        },
        /**
			 * 获取验证码
			 */
        getCode() {
            let _this = this
            if (!_this.mobile) {
                App.showError('请填写手机号')
                return
            }

            if (!_this.codeDisabled) {
                // 防止重复操作
                _this.codeDisabled = true
                // 发送短信
                App._post_form('user.H5/sendSms', {
                    mobile: _this.mobile,
                    type: 'register'
                }, result => {
                    App.showSuccess('发送成功')
                    console.log(result)
                    _this.setCountdown()
                }, () => {
                    _this.codeDisabled = false
                })
            }
        },
		setIndex() {
			App._post_form('setting/index', {}, res => {
				this.is_bind_mobile = this.$util.deepGet(res,'data.bind_mobile',1) == 1
			})
		},
        setCountdown() {
            if (!this.timer) {
                this.timer = setInterval(() => {
                    if (this.countdown > 0 && this.countdown <= 60) {
                        this.countdown--
                        if (this.countdown !== 0) {
                            this.codeMsg = '重新发送(' + this.countdown + ')'
                        } else {
                            clearInterval(this.timer)
                            this.codeMsg = '获取验证码'
                            this.countdown = 60
                            this.timer = null
                            this.disabled = false
                            this.codeDisabled = false
                        }
                    }
                }, 1000)
            }
        },
        /**
			 * 申请分享商
			 */
        async applySubmit(name, mobile, verCode = '') {
            let _this = this
            if (!name) {
                App.showError('请填写姓名')
                return false
            }

            if (!mobile) {
                App.showError('请填写手机号')
                return
            }

            if (_this.appClientType === '4' && !_this.hasMobile && !verCode && _this.is_bind_mobile) {
                App.showError('请填写短信验证码')
                return false
            }
            _this.stopClick = true
            if (_this.diyDatas.length > 0) {
                await _this.$refs.diyForm.saveFormInfo().then(res => {
                    console.log(res, 'hhhhhhhhhhhhhhhhh', JSON.stringify(res) !== '{}')
                    if (JSON.stringify(res) !== '{}') {
                        _this.formErr = false
                        _this.form_submit_id = res.data.form_submit_id || ''
                    } else {
                        _this.formErr = true
                    }
                })
                console.log(_this.formErr, '_this.form_submit_id')
                if (_this.formErr) {
                    _this.stopClick = false
                    return
                }
            }
            uni.showLoading()
            // 请求参数
            const options = {
                real_name: name,
                mobile: mobile,
                referee_id: _this.referee_id,
                form_submit_id: _this.form_submit_id,
                verCode
            }
			// 判断是否需要付费支付
			const appSetting = this.$store.state.appSetting || {}
			if(appSetting.become == 5) {
				console.log('需要付费入驻')
				uni.hideLoading()
				this.$store.commit("orderPay", {
					...options,
					actual_pay_price: appSetting.apply_pay_price || 0,
					pay_from: "apply",
				})
				this.onToggleList()
				return
			}
            App._get('user.dealer.Apply/submit', options, res => {
                if (res.code === 1) {
                    _this.stopClick = false
                    uni.hideLoading()
                    if (_this.ApplyStateDetail.is_dealer_wechat !== 1) {
                        App.showSuccess('申请成功')
                    }
                    // 更新用户分销商状态
                    let userInfo = uni.getStorageSync('userInfo')
                    if (!res.data) {
                        userInfo.dealer_user = 1
                    }
                    userInfo.mobile = mobile
                    _this.$store.commit('userInfo', userInfo)
                    _this.getApplyState(_this.ApplyStateDetail.is_dealer_wechat)
					if (_this.ApplyStateDetail.is_dealer_wechat !== 1) {
						setTimeout(()=>{
							uni.navigateBack({
								fail(e) {
									App.navigationTo({
										url: 'pages/mainPages/index/index',
										redirectTo: true
									})
								}
							})
						},1500)
					}
                } else {
                    App.showError('申请失败')
                }
            })
        },


        /**
			 * 获取分销商申请状态
			 */
        getApplyState(is_dealer_wechat) {
            let _this = this,
                userInfo = _this.$store.state.userInfo,
                clientType = _this.$store.state.clientType
            App._get('user.dealer.Apply/is_distributor', {
                referee_id: _this.referee_id
            }, function (result) {
                _this.isData = true
                let data = result.data,
                    uniacid = App.getUniacid(),
                    disabled = data.apply_status === 10,
                    url = ''
                _this.ApplyStateDetail = data
                if (data.license.length > 0) {
                    _this.license = data.license
                }
                _this.nameText = data.real_name || ''
                _this.disabled = disabled

                if (is_dealer_wechat) {
                    // #ifdef MP
                    _this.showAttention = true
                    // #endif
                    // #ifndef MP
                    App.navigationTo({
                        url: `pages/subPages/dealer/apply/attention?wechat_image=${encodeURIComponent(_this.ApplyStateDetail.wechat_image)}`
                    })
                    // #endif
                    return
                }
                _this.showAttention = false


                switch (data.apply_status) {
                case 3:
                    uni.redirectTo({
                        url: `/pages/subPages/dealer/index/subgoods${clientType === '3' || clientType === '4' ? '?i=' + uniacid : ''}`
                    })
                    break
                case 4:
                    uni.redirectTo({
                        url: `/pages/subPages/member/memberpay/memberpay?dealer=1&card_type=${_this.card_type}${clientType === '3' || clientType === '4' ? '&i=' + uniacid : ''}`
                    })
                    break
                case 20:
                    let url = ''
                    if (data.user_diy === '1') {
                        url = `/pages/subPages/user/index${clientType === '3' || clientType === '4' ? '?i=' + uniacid : ''}`
                    } else {
                        url = `/pages/subPages/dealer/index/index${clientType === '3' || clientType === '4' ? '?i=' + uniacid : ''}`
                    }
                    uni.redirectTo({
                        url
                    })
                    break
                case 30:
                    uni.showModal({
                        title: '申请被驳回',
                        content: '驳回原因:' + data.reject_reason,
                        showCancel: false
                    })
                    if (clientType === '3' || clientType === '4') {
                        _this.mobile = disabled ? data.mobile : _this.$store.state.userInfo.mobile
                    }
                    return false
                    break
                default:
                    if (_this.$util.isEmptyMobile(_this.mobile)) {
                        _this.mobile = clientType === '3' ? _this.$store.state.userInfo.mobile : (data.mobile || userInfo.mobile)
                    }

                }
            }, false, () => {
                App.hideLoading()
            })
        },
        /**
			 * 提交申请
			 */
        formSubmit(e) {
            // 记录formId
            App.saveFormId()

        },

        /**
			 * 去商城逛逛
			 */
        navigationToIndex(e) {
            // 记录formId
            App.saveFormId()
            // 跳转到首页
            App.navigationTo({
                url: 'pages/mainPages/index/index'
            })
        },

        /**
			 * 获取推荐人id
			 */
        getRefereeid() {
            return uni.getStorageSync('referee_id')
        },

        /**
			 * 关闭弹窗
			 */
        attentionClose() {
            this.showAttention = !this.showAttention
            this.getApplyState()
        }
    }
}
</script>

<style lang="scss" scoped>
	page {
		background: #fff;
	}
	.stop_click {
		pointer-events: none;
	}
	.c-violet {
		color: #786cff;
	}

	.col-80 {
		color: #808080;
	}

	.col-bb {
		color: #bbb;
	}

	.f-38 {
		font-size: 38upx;
	}

	.dealer-bg image {
		display: block;
		width: 100%;
		height: 330rpx;
		margin-top: -70upx;
	}

	.apply-content {
		padding: 0 30upx;
		background: #F0F0F0;
		min-height: calc(100vh - 225upx);
	}

	.dealer-rights {
		border-radius: 20upx;
		padding-top: 0;
		margin-top: 20upx;
		width: 100%;
		box-sizing: border-box;
	}

	.widget-form {
		width: 100%;
		border-radius: 20upx;
		margin-top: -80upx;
		position: relative;
	}

	.widget-form-title {
		margin-top: 38upx;
		position: relative;
	}

	.widget-form-title .form-title {
		padding: 12upx 24upx;
		text-align: center;
		position: relative;
		border: 1upx solid #000000;
		border-radius: 6upx;
		background: #FFFFFF;
		z-index: 2;
	}

	.widget-form-title .form-title-before {
		position: absolute;
		top: 4upx;
		left: 4upx;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #FFD940;
		border: 1upx solid #000000;
		border-radius: 6upx;
		z-index: 1;
	}

	.widget-form .form-box {
		margin-top: 10upx;
		box-sizing: border-box;
		padding: 30upx;
		width: 100%;
	}

	.widget-form .form-box .form-field {
		height: 84upx;
		line-height: 84upx;
		margin-bottom: 18upx;
		border: 1upx solid #EEEEEE;
		box-sizing: border-box;
		font-size: 28upx;
		border-radius: 42upx;
	}

	.widget-form .form-box .form-field .field-label {
		width: 130upx;
		text-align: center;
		color: #808080;
	}

	// 获取验证码
	.getcode-btn {
		position: relative;
		margin-right: 20rpx;
		color: rgb(241, 170, 69);
	}

	.getcode-btn:before {
		content: '';
		position: absolute;
		left: -20rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 1px;
		height: 40rpx;
		background-color: rgb(178, 178, 178);
	}

	.form-license .license-icon {
		margin-right: 12upx;
	}

	.form-submit {
		margin-top: 40upx;
	}

	.form-submit button {
		font-size: 30upx;
		background: #FFD940;
		color: #333333;
		border-radius: 50upx;
		height: 84upx;
		line-height: 84upx;
		margin: 0;
		width: 100%;
	}

	.form-submit button[disabled] {
		background: #D3D3D3;
		color: #FFFFFF;
	}

	/* 等待审核 */

	.dealer-boot {
		padding: 10upx 30upx;
		margin-top: 80upx;
	}

	.dealer-boot .msg__icon {
		font-size: 120upx;
		color: #8e84fc;
	}

	.boot__submit button {
		width: 428upx;
	}

	.dealer-boot .boot__submit {
		margin-top: 60upx;
	}

	.rights-content {
		padding: 20upx 0;
		width: 100%;
	}

	/* 关注公众号 */
	.community-detail {
		border-radius: 20rpx;
		padding-bottom: 35rpx;
	}

	.community-detail .icon-roundclose {
		position: absolute;
		left: 50%;
		bottom: -2em;
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

	.community-detail .community-header .attention {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 153rpx;
		height: 135rpx;
		display: block;
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
</style>
