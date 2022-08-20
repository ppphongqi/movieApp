<template>
	<view class="shortcut">

		<!-- 首页 -->
		<form @submit="_onTargetPage($event,0)" report-submit="true">
			<button formType="submit" class="nav-item btn-normal" :class="[isShow ? 'show_60' : (transparent ? '' : 'hide_60')]">
				<text class="iconfont icon-home"></text>
			</button>
		</form>

		<!-- 分类页 -->
		<form v-if="searchListVisible" @submit="_onTargetPage($event,1)" report-submit="true">
			<button formType="submit" data-index="1" class="nav-item btn-normal" :class="[isShow ? 'show_40' : (transparent ? '' : 'hide_40')]">
				<text class="iconfont icon-searchlist"></text>
			</button>
		</form>

		<!-- 购物车 -->
		<!-- <form @submit="_onTargetPage" report-submit="true">
	    <button formType="submit" data-index="2" class="nav-item btn-normal" :class="[isShow ? 'show_40' : (transparent ? '' : 'hide_40')]">
	      <text class="iconfont icon-cart"></text>
	    </button>
	  </form> -->

		<!-- 个人中心 -->
		<form @submit="_onTargetPage($event,3)" report-submit="true">
			<button formType="submit" data-index="3" class="nav-item btn-normal" :class="[isShow ? 'show_20' : (transparent ? '' : 'hide_20')]">
				<text class="iconfont icon-profile"></text>
			</button>
		</form>

		<!-- 显示隐藏开关 -->
		<form @submit="_onToggleShow" report-submit="true">
			<button formType="submit" class="nav-item nav-item__switch btn-normal" :class="[isShow ? 'shortcut_click_show' : '']">
				<text class='iconfont icon-cascades'></text>
			</button>
		</form>

	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				// 弹窗显示控制
				isShow: false,
				transparent: true
			};
		},
		props: {
			// 弹窗标题
			title: {
				type: String,
				default: '弹窗标题'
			},
			// 是否显示查找按钮
			searchListVisible: {
				type: Boolean,
				default: true
			}
		},
		onLoad() {

		},
		methods: {
			/**
			 * 导航菜单切换事件
			 */
			_onToggleShow(e) {
				// 记录formid
				App.saveFormId();
				this.setData({
					isShow: !this.isShow,
					transparent: false
				})
			},

			/**
			 * 导航页面跳转
			 */
			_onTargetPage(e, index) {
				let urls = App.getTabBarLinks(),
					url = "/" + urls[index];
				// 记录formid
				App.saveFormId();
				// #ifdef H5
				url += "?i=" + App.getUniacid() + '&aid=' + App.siteInfo.aid;
				// #endif
				uni.reLaunch({
					url
				});
			}
		}
	}
</script>

<style lang="scss">
	/* 快捷导航 */

	.shortcut {
		position: fixed;
		right: 12px;
		bottom: 250upx;
		width: 76upx;
		line-height: 1;
		z-index: 10;
		border-radius: 50%;
	}

	/* 导航菜单元素 */

	.nav-item {
		position: absolute;
		bottom: 0;
		padding: 0;
		width: 76upx;
		height: 76upx;
		line-height: 76upx;
		color: #fff;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 50% !important;
		text-align: center;
		transform: rotate(0deg);
		opacity: 0;
	}

	.nav-item text {
		font-size: 40upx;
	}

	/* 导航开关 */

	.nav-item__switch {
		opacity: 1;
	}

	.shortcut_click_show {
		margin-bottom: 0;
		background: #FE504F;
		background-color: var(--help-color);
	}

	/* 显示动画 */

	.show_80 {
		bottom: 384upx;
		animation: show_80 0.3s forwards;
	}

	.show_60 {
		bottom: 288upx;
		animation: show_60 0.3s forwards;
	}

	.show_40 {
		bottom: 192upx;
		animation: show_40 0.3s forwards;
	}

	.show_20 {
		bottom: 96upx;
		animation: show_20 0.3s forwards;
	}

	@keyframes show_20 {
		from {
			bottom: 0;
			transform: rotate(0deg);
			opacity: 0;
		}

		to {
			bottom: 96upx;
			transform: rotate(360deg);
			opacity: 1;
		}
	}

	@keyframes show_40 {
		from {
			bottom: 0;
			transform: rotate(0deg);
			opacity: 0;
		}

		to {
			bottom: 192upx;
			transform: rotate(360deg);
			opacity: 1;
		}
	}

	@keyframes show_60 {
		from {
			bottom: 0;
			transform: rotate(0deg);
			opacity: 0;
		}

		to {
			bottom: 288upx;
			transform: rotate(360deg);
			opacity: 1;
		}
	}

	@keyframes show_80 {
		from {
			bottom: 0;
			transform: rotate(0deg);
			opacity: 0;
		}

		to {
			bottom: 384upx;
			transform: rotate(360deg);
			opacity: 1;
		}
	}

	/* 隐藏动画 */

	.hide_80 {
		bottom: 0;
		animation: hide_80 0.3s;
		opacity: 0;
	}

	.hide_60 {
		bottom: 0;
		animation: hide_60 0.3s;
		opacity: 0;
	}

	.hide_40 {
		bottom: 0;
		animation: hide_40 0.3s;
		opacity: 0;
	}

	.hide_20 {
		bottom: 0;
		animation: hide_20 0.3s;
		opacity: 0;
	}

	@keyframes hide_20 {
		from {
			bottom: 96upx;
			transform: rotate(360deg);
			opacity: 1;
		}

		to {
			bottom: 0;
			transform: rotate(0deg);
			opacity: 0;
		}
	}

	@keyframes hide_40 {
		from {
			bottom: 192upx;
			transform: rotate(360deg);
			opacity: 1;
		}

		to {
			bottom: 0;
			transform: rotate(0deg);
			opacity: 0;
		}
	}

	@keyframes hide_60 {
		from {
			bottom: 288upx;
			transform: rotate(360deg);
			opacity: 1;
		}

		to {
			bottom: 0;
			transform: rotate(0deg);
			opacity: 0;
		}
	}

	@keyframes hide_80 {
		from {
			bottom: 384upx;
			transform: rotate(360deg);
			opacity: 1;
		}

		to {
			bottom: 0;
			transform: rotate(0deg);
			opacity: 0;
		}
	}
</style>
