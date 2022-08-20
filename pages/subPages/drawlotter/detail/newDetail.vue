<template>
	<view class="">
		<view class="" >
			<view class="prizeWrap"  @click="toPrizeDetai">
				<!-- <view class="prizeImg" :style="{'background-image': 'url('+detail.detail.cover+');'}"> -->
				<view class="">


				 <image  class="prizeImg" :src="detail.detail.cover" mode=""></image>
				</view>
				<view class="headContent">
					<view class="goodsTitle">

						<text  class="peridos">{{detail.detail.tips}}</text>
						<text>{{detail.detail.title}}</text>
					</view>
					<view class="flexBtew" style="width: 470rpx;">
						<view class="openPrize">

							<text class="old">已开奖</text>
						</view>
						<view class="priceGoods">
							<text>价值</text>
							<text class="num">{{detail.detail.price}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="" style="margin: 30rpx;">
				<view class="flexBtew">
					<view >
						<text class="getType">领奖方式</text>
					</view>
					<view  style="color: #999999;">
						<text style="font-size: 24rpx;">请出示二维码领取奖品</text>
					</view>
					<view class="sanColum">

					</view>
				</view>
				<view class="">
					<!-- 二维码 -->
					<swiper class="swiper" :indicator-dots="true"
					 previous-margin="70rpx" next-margin="70rpx"   @change="swiperChange"
					 indicator-color="rgba(204,204,204,1);" indicator-active-color="rgba(51,51,51,1);">
						<swiper-item v-for="(item,index) in detail.prize" :key="index" class="swiper-item">
							<view class="swiperWrap" :class="{'is-disabled': item.is_overdue == 2}" >

								<view class="swiperHead">
									<view class="">
										<view class="swiperTitle oneLine">
											<text>{{item.prize_title}}</text>
										</view>
										<view class="" v-if="item.end_time == -1">
											<text>核销有效期：永久有效</text>
										</view>
										<view class="" v-else>
											<text>核销有效期：{{item.end_time}}</text>
											<!-- <text style="display: block;padding-left: 130rpx;">至  {{item.end_time }}</text> -->
										</view>
										<view class="whiteLeft">

										</view>
										<view class="whiteRight">

										</view>
									</view>

								</view>
								<view class="qrcode">
										<image :src="qrImg" mode=""></image>
								</view>
								<view class="" v-if="item.is_get==2 && item.is_overdue != 2">
									<button type="default" class="getBtn" @click="moreStore(item.param_s)"> 领取门店</button>
								</view>
								<view class="" v-if="item.is_get==1">
									<button type="default" class="getBtn" style="background-color: #EDEDED;color: #999999;"> 已核销 </button>
								</view>

							</view>
						</swiper-item>


					</swiper>

				</view>
			</view>
			<view class="detailFoot" style="margin: 30rpx;">
				<view class="" style="padding: 30rpx;">
					<text class="getType">奖品核销记录</text>
				</view>
				<view class="flexBtew prizeMsg" 	 v-for="(prize,index) in detail.prize" :key="index">
					<view class="prizeGoods">
						<text>奖品：</text><text>{{prize.prize_title}}</text>
					</view>
					<view class="">
						<text>x{{prize.num}}</text>
					</view>
					<view class="" v-if="prize.is_get == 1">
						<text style="color: #999999;">已核销</text>
					</view>
					<view class="" v-if="prize.is_get == 2">
						<text style="color: #FF4444;">未核销</text>
					</view>
				</view>
			</view>
		</view>
		<view class="" style="height: 160rpx;width: 100%;">

		</view>
		<view class="btnWrap">
			 <view class="homeBtn" @click="toHome">
				 <view class=" imgBox">

						<u-icon size="35" name="home"></u-icon>
				 </view>
				 <view class="">
				 	<text>首页</text>
				 </view>
			 </view>
			 <view class="homeBtn" @click="serviceBtn">
				<view class="imgBox">
						<u-icon size="35" name="server-fill"></u-icon>
				</view>
			 	<view class="">
			 		<text>客服</text>
			 	</view>
			 </view>
		</view>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
export default {
    data() {
        return {
            luck_id: 0,
			  period_id: 0,
			  detail: null,
			  swiperHit: [],
			  codeList: null,
			  isGetEnd: false,
			  codeCurrent: 0,
			  param_c: '',
			  qrImg: '',
			  options: {}

        }
    },
    onLoad(options) {
        this.options = options
        console.log(this.options, '参数')
        App.showLoading()
        this.luck_id = options.luck_id
        this.period_id = options.period_id
        this.getLotterInfo(options)
    },
    onShow() {


    },
    computed: {

    },
    methods: {
        serviceBtn() {
            App.navigationTo({
                url: 'pages/subPages/user/service'
            })
        },
        /**
			 * 核销码切换
			 */
        swiperChange(e) {
            this.codeCurrent = e.detail.current
			   // uni.showLoading({
			   // 	title: "加载中..."
			   // })
            this.getCodeQr(this.codeCurrent)

			    // this.getBusData(this.codeCurrent)
        },
        getCodeQr(val) {
            this.param_c = this.detail.prize[val].param_c

            App._postP('order/createQrCode', { param_c: this.param_c }).then(res => {

                this.qrImg = res.data
					 // uni.hideLoading()
            })
        },
        // 去奖品详情
        toPrizeDetai() {
            if (this.options.type == 1) {
                App.navigationTo({
				    url: `pages/subPages/drawlotter/index/index?luck_id=${this.luck_id}&period_id=${this.period_id}`
                })
            }
        },
        /**
			 * 商品确认购买
			 * @param {Object} buyData 用户选择商品信息
			 */
        toOrder(buyData) {
            console.log('11111')
            console.log(buyData)

            App.navigationTo({
                url: 'pages/subPages/flow/checkout?' + App.urlEncode({
                    order_type: 6,
                    goods_id: 785,
                    goods_num: buyData.prize_num,
                    goods_sku_id: '0',
                    bus_id: buyData.business_id,
			         transport_type: '20',
					 is_meal: '2', // 是否是套餐
					 is_express: 1// 是否有物流費
                })


            })
        },
        toHome() {
            let urls = App.getTabBarLinks(),
                url = '/' + urls[0]
            uni.reLaunch({
                url
            })
        },
        /**
			 * 更多门店
			 */
        moreStore(item) {
            // let itemData=JSON.parse(item)
            // console.log(itemData);
            // if (itemData.is_get == '2') {
            App.navigationTo({
                url: 'pages/subPages/store/list?param_s=' + item
            })
            // }
        },

        /**
			 * 获取订单信息
			 */
        getLotterInfo(options) {
            let _this = this,
                api = ''
            if (options.type == 1) {
                api = 'luck.luck/prizeDetail'
            } else if (options.type == 2) {
                api = 'praise.Praise/prizeDetail'
            } else if (options.type == 3) {
                api = 'blessing.blessing/blessingDetail'
            }
            App._getP(api, options).then(res => {
                console.log(res.data)
                _this.detail = res.data
                _this.getCodeQr(this.codeCurrent)

            })


        }
    },
    watch: {
        // 	async codeCurrent(newValue, oldValue) {
        // 		if (this.detail.vercode_model === "2") {
        // 			let codeData = this.swiperList[newValue];
        // 			if (!codeData.path) {
        // 				uni.showLoading({
        // 					title: "加载中..."
        // 				})
        // 				let code = codeData && codeData.code,
        // 					codePath = await this.getOrderQrcode(this.order_id, code)
        // 				this.$set(this.swiperList[newValue], "path", codePath);
        // 			}

        // 		}
        // 	}
    },
    filters: {
        // 时间戳转换
        timeChange: function (value) {
            // return this.$util.formatTime(times,normal," ")
            var time = new Date(value * 1000)
            var y = time.getFullYear()
            var m = time.getMonth() + 1
            var d = time.getDate()
            var h = time.getHours()
            var mm = time.getMinutes()
            var s = time.getSeconds()
            return y + '年' + m + '月' + d + '日'
        }
    },
    onShareAppMessage() {
        if (this.options.type == 1) {
            return {
                path: '/pages/subPages/drawlotter/index/index?luck_id=' + this.options.luck_id + '&period_id=' + this.options.period_id
            }
        } else if (this.options.type == 2) {
            return {
                path: '/pages/subPages/fabulous/index?praise_id=' + this.options.praise_id
            }
        }
    }

}
</script>

<style lang="less" scoped>
	text {
		font-size: 28rpx;

	}
	.prizeGoods{
		width: 370rpx;
		white-space: nowrap;
		  text-overflow: ellipsis;
		  overflow: hidden;
	}
	.oneLine{
		white-space: nowrap;
		  text-overflow: ellipsis;
		  overflow: hidden;
	}
	swiper.swiper .wx-swiper-dots.wx-swiper-dots-horizontal {
		/**
		 * 距离底部高度
		 */
		margin-bottom: 4%;
	}

	swiper.swiper .wx-swiper-dot {
		/**
		 * 指点宽高样式
		 */
		width: 35rpx;
		display: inline-flex;
		height: 6rpx;
		justify-content: space-between;
		margin: 0 2rpx;
		border-radius: 0;
	}

	swiper.swiper .wx-swiper-dot::before {
		/**
		 * 指点样式
		 */
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.5);
	}

	swiper.swiper .wx-swiper-dot-active::before {
		/**
		 * 被选中时样式
		 */
		background: #FFD940;
		background: var(--theme-color);
	}
	.whiteLeft{
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background-color: #ffffff ;
		position: absolute;
		left: -26rpx;
		bottom: -18rpx;
		}
	.whiteRight{
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background-color: #ffffff ;
		position: absolute;
		right: -20rpx;
		bottom: -18rpx;
	}
	.sanColum{
		width: 20%;
		text-align: center;
	}
	.btnWrap{
		position: fixed;
		bottom: 30rpx;
		left: 30rpx;
		display: flex;
		.homeBtn{
			text-align: center;
			width:100rpx;
			height:100rpx;
			background:rgba(255,217,64,1);
			border-radius:50%;
			color: #333333;
			margin-right: 30rpx;
			padding-top: 10rpx;
			box-sizing: border-box;
		}
		.imgBox{
			//margin-top: 10rpx;
			margin-bottom: -10rpx;
		}
		.iconBtn{
			width: 32rpx;
			height: 32rpx;

		}

	}

	.prizeMsg{
		padding: 30rpx;
		border-top: 1px solid #EEEEEE;
	}
	.detailFoot{
		background:rgba(255,255,255,1);
		border-radius:10rpx;
		padding: 30rpx;
	}
	.swiper{
		height: 750rpx;
	}
	.swiperWrap{
		background-color: #FFFFFF;
		width:500rpx;
		padding-bottom: 30rpx;
		margin: 30rpx auto;
		.swiperHead{
			background-color: #FFD940;
			width: 100%;
			height:152rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			overflow: hidden;
			text-align: center;
			.swiperTitle{
				font-size:32rpx;
				font-family:PingFang SC;
				font-weight:bold;
				text-align: center;
				width: 455rpx;
			}

		}
		.qrcode{
			position: relative;
			width:340rpx ;
			height: 340rpx;
			margin: 30rpx auto;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.getBtn{
			background-color: #FFD940;
			font-size: 28rpx;
			width: 180rpx;
		}
		&.is-disabled {
			.swiperHead {
				background-color: #CCCCCC;
			}
			.qrcode {
				&::after {
					position: absolute;
					content: "\20";
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					background-color: rgba(0,0,0,0.5);
					background-image: url(static/images/img-text-bukeyong.png);
					background-position: center;
					background-repeat: no-repeat;
					background-size: 169rpx 145rpx;
				}
			}
		}
	}
	.openPrize{
		text{
			font-size: 24rpx;
		}
	}
  .headContent{
	  display: flex;
	  flex-direction: column;
	  justify-content: space-between;
  }
	.prizeWrap {
		display: flex;
		background:rgba(255,255,255,1);
		border-radius:10rpx;
		padding: 20rpx;
		margin: 30rpx;
	}

	.prizeImg {
		width: 130rpx;
		height: 130rpx;
		min-width: 130rpx;
		min-height: 130rpx;
		border-radius:8rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: center;
		margin-right: 42rpx;
	}
	.peridos {
		background: rgba(246, 210, 70, 1);
		padding: 0 6rpx;
		margin-right: 10rpx;
		color: #333333;
		border-radius: 4rpx;
		font-size: 10px;
	}
	.goodsTitle {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.flexBtew{
		display: flex;
		justify-content: space-between;

	}
	.priceGoods{
		color:#FF4444;
		.num{
			font-size:32rpx;
			font-family:PingFang SC;
			font-weight:bold;
		}
	}
	.getType{
		// font-size:32rpx;
		font-family:PingFang SC;
		font-weight:bold;
		padding: 30rpx;
	}
</style>
