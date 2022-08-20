<template>
	<popup-view class="c-popup" :show="dVisible" type="center" @clickmask="dVisible = false">
		<view class="c-card">
			<view class="c-card__header">
				{{title}}
			</view>
			<scroll-view scroll-y class="c-card__content">
				<view class="c-card__scroll__content">
					<view class="store-list">
						<view v-for="item in list" :key="item.id" class="store-item app-flex">
							<view class="app-flex-item app-flex-item--1">
								<view class="store-item__title">{{item.name}}</view>
								<view class="store-item__text">{{item.address}}</view>
							</view>
							<view class="app-flex-item app-flex-item--shrink-0 app-flex app-flex--align-center">
								<view class="app-flex-item">
									<button class="store-item__btn-op btn-normal" @click="handleBtnPhoneClick(item)">
										<view class="iconfont icon-dianhua1"></view>
									</button>
								</view>
								<view class="app-flex-item">
									<button class="store-item__btn-op btn-normal" @click="handleBtnMapNavClick(item)">
										<view class="iconfont icon-daohang1"></view>
									</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="c-popup__btn-close iconfont icon-searchclose" @click="dVisible = false"></view>
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
			// 默认是否显示v-model
			value: {
				type: Boolean,
				default: false
			},
			// 标题
			title: {
				type: String,
				default: '适用门店'
			},
			// 富文本
			text: {
				type: String,
				default: '哈哈'
			},
			image: {
				type: String,
				default:''
			},
			// 列表数据
			list: {
				type: Array,
				default() {
					// return Array(2).fill(1).map((item,index)=>({
					// 	id: '1',
					// 	name: '小龙坎火锅小龙坎火锅小龙坎火锅小龙坎火锅',
					// 	address: '四川省成都市蓝光空港国际城一期 5栋1单元1323',
					// 	phone: '88888888',
					// 	latitude: 31,
					// 	longitude: 103
					// }))
					return []
				}
			}
		},
		data() {
			return {
				dVisible: this.value
			}
		},
		watch: {
			value(val) {
				this.dVisible = val
			},
			dVisible(val) {
				this.$emit('input',val)
			}
		},
		methods: {
			// 商家列表拨打电话按钮点击事件
			handleBtnPhoneClick({
				phone
			} = {}) {
				// 参数检查
				if (!phone) {
					uni.showToast({
						icon: 'none',
						title: '电话号码为空'
					})
					return
				}
				// 正常拨打流程
				uni.makePhoneCall({
					phoneNumber: phone,
					fail(err) {
						console.log(err)
					}
				})
			},
			// 商家列表导航按钮点击事件
			handleBtnMapNavClick({
				name,
				address,
				latitude,
				longitude
			} = {}) {
				App.openLocation({
					name,
					address,
					latitude: +latitude,
					longitude: +longitude
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	

	.c-card {
		position: relative;
		width: 630rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.c-card__header {
		box-sizing: border-box;
		display: flex;
		min-height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 40rpx;
		padding-bottom: 10rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}

	.c-card__content {
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}
	
	.c-popup__btn-close {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		font-size: 36rpx;
		text-align: center;
	}
	.store-item {
		padding: 30rpx  0 ;
		&+& {
			border-top: 1px dashed #ccc;
		}
	}
	.store-item__title {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	.store-item__text {
		font-size: 26rpx;
		color: #999;
	}
	.store-item__btn-op {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60rpx;
		height: 60rpx;
		color: #333;
		font-size: 30rpx;
		border-radius: 100%;
		background-color: #eee;
	}
</style>
