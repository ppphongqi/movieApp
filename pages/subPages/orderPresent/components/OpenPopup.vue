<template>
	<popup-view class="rights-popup" :show="dVisible" type="bottom" @clickmask="dVisible = false">
		<view class="rights-card">
			<scroll-view scroll-y class="rights-card__content">
				<view class="rights-card__scroll__content">
					<!-- 核销码 -->
					<NormalOpenList v-if="type==='normal'" :list="[codeItem]" :btnDetailsVisible="false">
					</NormalOpenList>
					<GiftOpenList v-else-if="type==='gift'" :list="[codeItem]" :btnDetailsVisible="false">
					</GiftOpenList>
					<!-- 核销码 end -->
					<!-- 注意事项 -->
					<view class="f-32 f-bold col-0 m-btm20 m-top40">礼包详情</view>
					<parse :html="codeItem.content"></parse>
					<!-- 注意事项 end -->
					<!-- 通用门店 -->
					<view class="f-32 f-bold col-0 m-btm20 m-top40">通用门店</view>
					<view v-for="(item,index) in codeItem.storeList" :key="index" class="app-flex app-flex--align-center  m-btm30">
						<view class="app-flex-item app-flex-item--1">
							<view class="f-28 f-bold col-3">{{item.name}}</view>
							<view class="f-28 col--9 m-top10">{{item.address}}</view>
						</view>
						<view class="app-flex-item app-flex-item--shrink-0 app-flex app-flex--align-center">
							<view class="app-flex-item">
								<image src="../static/images/icon-phone.png" mode=""
									style="width: 60rpx;height: 60rpx;" @click="storeMobile(item.mobile)"></image>
							</view>
							<view class="app-flex-item">
								<image src="../static/images/icon-map.png" mode="" style="width: 60rpx;height: 60rpx;" @click="storeLocation(item)">
								</image>
							</view>
						</view>
					</view>
					<!-- 通用门店 end -->
				</view>
			</scroll-view>
			<!-- <view class="rights-popup__btn-close iconfont icon-searchclose" @click="dVisible = false"></view> -->
		</view>
	</popup-view>
</template>

<script>
	import App from '@/common/js/app.js'
	import PopupView from '@/components/template/PopManager.vue'
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import NormalOpenList from './NormalOpenList.vue'
	import GiftOpenList from './GiftOpenList.vue'
	export default {
		components: {
			PopupView,
			Parse,
			NormalOpenList,
			GiftOpenList
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
				default: ''
			},
			// 富文本
			text: {
				type: String,
				default: '注意事项'
			},
			codeItem: {
				type: Object,
				default () {
					return {}
				}
			},
			// type gift normal
			type: {
				type: String,
				default: ''
			},
			// 门店名称
			storeName: {
				type: String,
				default: ''
			},
			// 门店地址
			storeAddress: {
				type: String,
				default: ''
			},
			// 门店导航数据
			location: {
				type: Object,
				default () {
					return {
						name: '',
						address: '',
						longitude: 116,
						latitude: 39,
					}
				}
			},
			// 电话
			phone: {
				type: String,
				default: ''
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
				this.$emit('input', val)
			}
		},
		methods: {
			/**
			 * 拨打门店电话
			 */
			storeMobile(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile
				});
			},
					
			/**
			 * 查看门店地址
			 */
			storeLocation({
				lat,
				lng,
				name,
				address
			}) {
				App.openLocation({
					name,
					address,
					latitude: +lat,
					longitude: +lng,
					success() {
						console.log('success');
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.rights-card {
		position: relative;
		width: 100vw;
		border-radius: 20rpx 20rpx 20rpx 0;
		background-color: #fff;
	}

	.rights-card__content {
		height: 900rpx;
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}

	.rights-popup__btn-close {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		font-size: 36rpx;
		text-align: center;
	}
</style>
