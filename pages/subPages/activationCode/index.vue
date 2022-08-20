<template>
	<view class="page-activationCode app-clearfix">
		<!-- 标题 -->
		<view class="page-activationCode__title">电子激活码</view>
		<view class="page-activationCode__subtitle">输入电子激活码确认商品</view>
		<!-- 标题 end -->
		<!-- 表单 -->
		<view class="code-form">
			<input  v-model="code" class="code-form__input" type="text" placeholder="请输入电子激活码" />
			<button class="btn-normal code-form__btn-go" @click="handleBtnSearchClick">查询</button>
		</view>
		<!-- 表单 end -->
		<!-- 商品列表弹窗 -->
		<GoodsListPopup v-model="goodsListPopupVisible" :list="cGoodsList" @on-btn-confirm-click="handleBtnConfirmClick"></GoodsListPopup>
		<!-- 商品列表弹窗 end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import GoodsListPopup from './components/GoodsListPopup.vue'
	export default {
		components: {
			GoodsListPopup
		},
		onShow() {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff",
			});
		},
		data() {
			return {
				// 当前输入的激活码
				code: '',
				// 激活码详情的接口数据
				detailsRes: {},
				// 商品弹窗是否显示
				goodsListPopupVisible: false,
			}
		},
		computed: {
			cGoodsList() {
				const list = this.$util.deepGet(this.detailsRes,'goods.gift',[])
				return list.map(item=>({
					id: item.gift_id,
					name: item.title,
					price: item.price
				}))
			}
		},
		methods: {
			// 确认按钮点击事件
			async handleBtnConfirmClick() {
				if(!this.code) {
					uni.showToast({
						icon: 'none',
						title: '请先输入激活码'
					})
					return
				}
				if(this.handleBtnConfirmClicking) return
				this.handleBtnConfirmClicking = true
				uni.showLoading({
					title:'请稍候...'
				})
				try{
					await App._getP('activation.Activation/useActivationCode',{
						code: this.code
					})
					// 关闭弹窗
					this.goodsListPopupVisible = false
					// 提示成功
					uni.showToast({
						icon: 'none',
						title: '激活成功'
					})
					// 跳转到订单页面
					App.navigationTo({
						url: "pages/mainPages/order/index?type=all"
					})
				}catch(e){
					//TODO handle the exception
				}
				this.handleBtnConfirmClicking = false
			},
			// 查询按钮点击事件
			async handleBtnSearchClick() {
				if(!this.code) {
					uni.showToast({
						icon: 'none',
						title: '请先输入激活码'
					})
					return
				}
				if(this.handleBtnSearchClicking) return
				this.handleBtnSearchClicking = true
				uni.showLoading({
					title:'请稍候...'
				})
				try{
					await this.fetchDetailsRes()
					// 显示弹窗
					this.goodsListPopupVisible = true
				}catch(e){
					//TODO handle the exception
				}
				this.handleBtnSearchClicking = false
				
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP('activation.Activation/getActivationCodeDetail',{
						code: this.code
					})
					this.detailsRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-activationCode {
		box-sizing: border-box;
		min-height: 100vh;
		padding-top: 80rpx;
		background-image: url("./static/images/bg-activation-code.png");
		background-position: center top;
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
	.page-activationCode__title {
		box-sizing: border-box;
		padding-left: 50rpx;
		padding-right: 50rpx;
		font-size: 48rpx;
		font-weight: bold;
		color: #5A1F03;
	}
	.page-activationCode__subtitle {
		box-sizing: border-box;
		margin-top: 20rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
		font-size: 28rpx;
		color: #5A1F03;
	}
	.code-form {
		box-sizing: border-box;
		width: 690rpx;
		padding: 30rpx;
		margin: 0 auto;
		margin-top: 80rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}
	.code-form__input {
		display: block;
		height: 130rpx;
		line-height: 130rpx;
		width: 100%;
		margin:0 auto;
		background-color: #F8F8F8;
		border-radius: 20rpx;
		text-align: center;
	}
	.code-form__btn-go {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90rpx;
		margin-top: 30rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #000;
		border-radius: 20rpx;
		background-color: #FFD940;
	}
</style>
