<!-- 
	遮罩层  by 杨智源
 -->
<template>
	<view>
		<view class="pop" :class="['pop--'+type,{'pop--show' : show }]">
			<view v-if="overlay" :style="'z-index:'+zIndex+';'+overlayStyle" class="pop__mask" :class="{'pop__mask--hide':!showOverlay}" @click="handleMaskClick" @touchstart="handleMaskTouchstart"></view>
			<view class="pop__container" :class="!upTop50?'pop__container_up':''" :style="{zIndex}">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			// 是否有遮罩层
			overlay: {
				type: Boolean,
				default: true
			},
			// 遮罩层的样式
			overlayStyle: {
				type: String,
				default: ''
			},
			// 遮罩层是否会显示
			showOverlay: {
				type: Boolean,
				default: true
			},
			// 内容从哪个方向出，可选 center top bottom left right
			type: {
				type: String,
				default: 'center'
			},
			//表单组件v-model所需的参数
			modelData: {
				type: Object,
				default: () => {}
			},
			// 弹窗顶部距离 默认50%
			upTop50:{
				type: Boolean,
				default: true
			},
			zIndex: {
				type: Number,
				default: 200
			}
		},
		components: {

		},
		computed: {
		},
		mounted() {

		},
		methods: {
			handleMaskClick() {
				this.$emit('clickmask');
			},
			handleMaskTouchstart() {
				this.$emit('on-mask-touchstart');
			}
		}
	}
</script>

<style>
	.pop {
		visibility: hidden
	}

	.pop--show {
		visibility: visible
	}

	.pop__mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 200;
		background: rgba(0, 0, 0, .5);
		display: none
	}

	.pop__mask--hide {
		background: 0 0;
	}

	.pop__container {
		position: fixed;
		left: 50%;
		top: 50%;
		-webkit-transform: translate3d(-50%, -50%, 0);
		transform: translate3d(-50%, -50%, 0);
		-webkit-transform-origin: center;
		transform-origin: center;
		-webkit-transition: all .3s ease;
		transition: all .3s ease;
		z-index: 200;
		opacity: 0
	}
	.pop__container_up{
		top: 47%;
	}
	.pop--show .pop__container {
		opacity: 1
	}

	.pop--show .pop__mask {
		display: block
	}

	.pop--left .pop__container {
		left: 0;
		top: 50%;
		-webkit-transform: translate3d(-100%, -50%, 0);
		transform: translate3d(-100%, -50%, 0)
	}

	.pop--show.pop--left .pop__container {
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0)
	}

	.pop--right .pop__container {
		right: 0;
		top: 50%;
		left: auto;
		-webkit-transform: translate3d(100%, -50%, 0);
		transform: translate3d(100%, -50%, 0)
	}

	.pop--show.pop--right .pop__container {
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0)
	}

	.pop--bottom .pop__container {
		top: auto;
		left: 50%;
		bottom: 0;
		-webkit-transform: translate3d(-50%, 100%, 0);
		transform: translate3d(-50%, 100%, 0)
	}

	.pop--show.pop--bottom .pop__container {
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0)
	}

	.pop--top .pop__container {
		top: 0;
		left: 50%;
		-webkit-transform: translate3d(-50%, -100%, 0);
		transform: translate3d(-50%, -100%, 0)
	}

	.pop--show.pop--top .pop__container {
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0)
	}
</style>
