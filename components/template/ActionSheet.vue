<template>
	<view class="zan-actionsheet" :class="{'zan-actionsheet--show':show}">
		<view class="mask-class zan-actionsheet__mask" @click="onMaskClick"></view>
		<view class="container-class zan-actionsheet__container">
			<!-- 选项按钮 -->
			<action-btn v-for="(item,index) in actions" :key="index" @btnclick="handleBtnClick"
			 :open-type="item.openType" custom-class="zan-actionsheet__btn" :loading="item.loading" :btn-text="item.btnText" btn-type="list" :item-Index="index"></action-btn>

			<!-- 关闭按钮 -->
			<view v-if="cancelText" class="zan-actionsheet__footer">
				<action-btn custom-class="zan-actionsheet__btn" @click="cancelClick" :btn-text="cancelText"  btn-type="close"></action-btn>
			</view>
		</view>
	</view>
</template>

<script>
	import ActionBtn from "@/components/template/ActionButton.vue"
	export default {
		data() {
			return {
				actions: [{
					btnText: '生成商品海报',
					className: 'action-class',
					loading: false
				}, {
					btnText: '发送给朋友',
					openType: 'share'
				}]
			};
		},
		props: {
// 			actions: {
// 				type: Array,
// 				default: []
// 			},
			show: {
				type: Boolean,
				default: false
			},
			cancelWithMask: {
				type: Boolean,
				default: true
			},
			cancelText: {
				type: String,
				default: ''
			}
		},
		components: {
			ActionBtn
		},
		mounted() {
		},
		methods: {
			onMaskClick() {
				if (this.cancelWithMask) {
					this.cancelClick();
				}
			},
			cancelClick() {
				this.$emit('cancel');
			},
			handleBtnClick(_ref) {
				var _ref$currentTarget = _ref.currentTarget,
					currentTarget = _ref$currentTarget === undefined ? {} : _ref$currentTarget;

				var dataset = currentTarget.dataset || {};
				var index = dataset.index;

				this.$emit('actionclick', {
					index: index
				});
			}
		}
	}
</script>

<style>
	.zan-actionsheet {
		background-color: #f8f8f8;
	}

	.zan-actionsheet__mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		background: rgba(0, 0, 0, 0.7);
		display: none;
	}

	.zan-actionsheet__container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #f8f8f8;
		-webkit-transform: translate3d(0, 50%, 0);
		transform: translate3d(0, 50%, 0);
		-webkit-transform-origin: center;
		transform-origin: center;
		-webkit-transition: all 0.2s ease;
		transition: all 0.2s ease;
		z-index: 11;
		opacity: 0;
		visibility: hidden;
	}

	.zan-actionsheet__btn {
		margin-bottom: 0 !important;
	}

	.zan-actionsheet__footer .zan-actionsheet__btn {
		background: #fff;
	}

	

	.zan-actionsheet__subname {
		color: #999;
	}

	

	.zan-actionsheet__btn.zan-btn:last-child::after {
		border-bottom-width: 0;
	}

	.zan-actionsheet__subname {
		margin-left: 2px;
		font-size: 12px;
	}

	.zan-actionsheet__footer {
		margin-top: 10px;
	}

	

	.zan-actionsheet--show .zan-actionsheet__container {
		opacity: 1;
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}

	.zan-actionsheet--show .zan-actionsheet__mask {
		display: block;
	}
</style>
