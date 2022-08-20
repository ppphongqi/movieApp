<template>
	<view class="page p-left-right-30" :style="themeColor">
		<view class="hint-imag">
			<image class="image" src="/static/images/write.png" mode=""></image>
		</view>
		<view class="write-content">
			<view class="write-userinfo m-btm20 f-36 col-3 t-c f-w">将{{userinfo.nickName?userinfo.nickName:"当前"}}账号注销</view>
			<view class="write-hint f-22 col-9 t-c">注意，注销账号后以下信息将被清空且无法找回</view>
		</view>
		<view class="write-waring m-top-btm40 p-left-right-30 b-f">
			<view class="waring-byitem">
				<view class="itemslist dis-flex flex-y-center">
					<view class="symol"></view>
					<view class="f-24 col-3 f-n">{{appName}}的产品/服务将无法使用此账号</view>
				</view>
				<view class="itemslist dis-flex flex-y-center m-top-btm10">
					<view class="symol"></view>
					<view class="f-24 col-3 f-n">身份、账户信息、会员及权益信息</view>
				</view>
				<view class="itemslist dis-flex flex-y-center">
					<view class="symol"></view>
					<view class="f-24 col-3 f-n">交易记录</view>
				</view>
			</view>
			<view class="hint-msg col-9 f-22">
				请确保所有交易已完结且无纠纷，账户删除后的历史交易可能产
				生的资金退回权益等将视作自动放弃
			</view>
		</view>
		<view class="confimRadio">
			<checkbox-group class="uni-list" @change="checkboxChange" @click="isChecked">
				<label class="uni-list-cell uni-list-cell-pd dis-flex flex-y-center ">
					<view>
						<checkbox :checked="selectChecked"></checkbox>
					</view>
					<view class="f-24 col-3 consent">我已仔细阅读并完全同意以上条款，并希望继续注销</view>
				</label>
			</checkbox-group>
		</view>
		<view class="write-btn m-top40">
			<button class="confimWrite f-30 m-btm20" :disabled="!selectChecked" @click="confimWrite">确认注销</button>
			<button class="canelWrite f-30 m-btm20" @click="clickBack">暂不注销</button>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				selectChecked: false,
				userinfo: {}
			};
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {},

		onShow() {
			this.userinfo = uni.getStorageSync('userInfo')
		},
		mounted() {

		},
		methods: {
			isChecked(e) {
				this.selectChecked = !this.selectChecked;
			},
			checkboxChange(e) {

			},
			clickBack() {
				uni.navigateBack();
			},
			confimWrite() {
				let that = this;
				App.showError('请确认是否注销', (res) => {
					if (res.confirm && res.errMsg === "showModal:ok") {
						uni.showLoading({})
						App._post_form('user/updateStatus', {
							user_id: uni.getStorageSync('user_id'),
							status: 2
						}, (res) => {
							if (res.code === 1) {
								that.$store.commit('iswrite', 2);
								App.showSuccess('注销成功', () => {
									uni.navigateBack({
										delta: 2
									});
								})
							}
						}, false, () => {
							uni.hideLoading()
						})
					}
				}, true);
			}
		}
	}
</script>

<style>
	.hint-imag {
		margin: 80upx auto 80upx auto;
		text-align: center;
	}

	.hint-imag .image {
		width: 120upx;
		height: 120upx;
	}

	.write-waring {
		border-radius: 6upx;
	}

	.write-waring .waring-byitem {
		border-bottom: 1px solid #F8F8F8;
		padding: 40upx 20upx;
	}

	.itemslist .symol {
		width: 10upx;
		height: 10upx;
		border-radius: 50%;
		background: #000000;
		margin-right: 10upx;
	}

	.hint-msg {
		padding: 30upx 0;
	}

	/* #ifdef MP-WEIXIN */
	checkbox .wx-checkbox-input {
		border-radius: 6upx;
		width: 30upx;
		height: 30upx;
		border: 1upx solid #000000
	}

	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 1upx solid #000000;
		background: #000000;
	}

	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		border-radius: 6upx;
		/* 圆角 */
		width: 30upx;
		height: 30upx;
		line-height: 30rpx;
		text-align: center;
		font-size: 20rpx;
		/* 对勾大小 30rpx */
		color: #FFFFFF;
		/* 对勾颜色 白色 */
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	/* #endif */
	.confimRadio {
		padding: 0 40upx;
	}

	.consent {
		margin-top: 4upx;
	}

	.confimWrite[disabled] {
		background-color: #CCCCCC !important;
		border-radius: 40upx !important;
		color: #000000 !important;
		height: 80upx !important;
		line-height: 80upx !important;
	}

	.confimWrite {
		background-color: #FFD940;
		border-radius: 40upx;
		color: #000000;
		height: 80upx;
		line-height: 80upx;
	}

	.canelWrite {
		height: 80upx;
		line-height: 80upx;
		background: #FFFFFF;
		border-radius: 40upx;
		border: 1upx solid #000000;
		color: #000000 !important;
	}
</style>
