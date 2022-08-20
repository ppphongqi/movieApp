<template>
	<view :style="themeColor">
		<view class="container">
		  <view class="qrcode">
		    <image mode="widthFix" :src="qrcode" @click="previewImage"></image>
		  </view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	
	export default {
		data() {
			return {
				qrcode:""
			};
		},
		components: {
			
		},
		computed: {

		},
		onLoad() {
			//App = this.getApp;
		},
		onShow() {
			// 获取推广二维码
			this.getPoster();
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 获取推广二维码
			 */
			getPoster: function() {
			  let _this = this;
			  uni.showLoading({
			    title: '加载中',
			  });
			  App._get('user.dealer.qrcode/poster', {}, function(result) {
			    // 设置当前页面标题
			    uni.setNavigationBarTitle({
			      title: result.data&& result.data.words.qrcode.title.value?result.data.words.qrcode.title.value:''
			    })
			    _this.setData(result.data);
			  }, null, function() {
			    uni.hideLoading();
			  });
			},
				
			previewImage: function() {
			  uni.previewImage({
			    current: this.data.qrcode,
			    urls: [this.data.qrcode]
			  })
			},
		}
	}
</script>

<style>
page {
  background: #fff;
}

.qrcode image {
  display: block;
  width: 100%;
}

</style>
