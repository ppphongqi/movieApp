<template>
	<view class="rich-content b-f" :style="themeColor">
		<parse :html="content"></parse>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import Parse from '@/components/threeComponents/jyf-Parser/index.vue';
	export default {
		data() {
			return {
				content: ""
			}
		},
		components: {
			Parse
		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {
			this.project = options.richtype;
			uni.setNavigationBarTitle({
				title: options.richtype === 'license' ? '营业执照' : options.richtype === 'agreement' ? '服务协议' : '隐私政策'
			});
		},
		onUnload() {

		},
		mounted() {
			this.getRich(this.project);
		},
		methods: {
			getRich(project) {
				App.showLoading()
				let _this = this;
				App._get("setting/getSettingContent", {
					type: project
				}, res => {
					_this.content = res.data;
					App.hideLoading();
				});
			}
		}
	}
</script>

<style>
	.rich-content {
		padding: 20upx 30upx;
	}
</style>
