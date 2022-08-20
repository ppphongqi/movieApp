<!-- 局部加载样式 -->
<template>
	<view class="part-loading" v-if="isShow">
		<view class="data-load"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: true
			};
		},
		components: {

		},
		computed: {

		},
		onLoad(options) {

		},
		methods: {
			showChange() {
				this.isShow = !this.isShow;
			}
		}
	}
</script>

<style scoped lang="scss">
	.part-loading {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 500;
		background: #FFFFFF;
	}

	.data-load {
		position: absolute;
		top: 50%;
		left: 50%;
		margin: -30upx 0 0 -30upx;
		width: 60upx;
		height: 60upx;
		display: inline-block;
		padding: 0px;
		border-radius: 100%;
		border: 4upx solid;
		border-top-color: #FFD940;
		border-top-color:var(--theme-color);
		border-bottom-color: rgba(0, 0, 0, 0.2);
		border-left-color: #FFD940;
		border-left-color: var(--theme-color);
		border-right-color: rgba(0, 0, 0, 0.2);
		animation: loader 1s ease-in-out infinite;
	}

	@keyframes loader {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
