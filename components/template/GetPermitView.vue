<!-- 
获取用户权限弹窗 by 杨智源
 permit 需要获取的权限
 appName 项目名称
 callBack 获取权限后的回调
 -->
<template>
	<view>
		<pop-manager :show="isShow" tpye="center" @clickmask="isShow = false">
			<view class="permit-pop b-f">
				<view class="permit-title f-28 col-3">为了您更好的使用,{{appName}}需要获取以下权限</view>
				<view class="permit-list">
					<view class="permit-item t-c">
						<view class="iconfont" :class="[authText[permitName].icon]"></view>
						<view class="permit-text f-28">{{authText[permitName].text}}</view>
					</view>
				</view>
				<button class="permit-button f-28 main-bg-color auxiliary-color" open-type="openSetting" @opensetting="openSetting">确定</button>
			</view>
		</pop-manager>
	</view>
</template>

<script>
	import PopManager from '@/components/template/PopManager.vue';
	export default {
		props: {
			permitName: String,
		},
		components:{
			PopManager
		},
		data() {
			return {
				authText: {
					"userInfo": {
						"icon": "icon-peoplefil",
						"text": "用户公开信息(用户名,头像等)"
					},
					"userLocation": {
						"icon": "icon-ditu1",
						"text": "地理位置"
					},
					"address": {
						"icon": "icon-locationfill",
						"text": "通讯地址"
					},
					"writePhotosAlbum": {
						"icon": "icon-piclight",
						"text": "保存到相册"
					},
					"camera": {
						"icon": "icon-paizhao",
						"text": "摄像头"
					}
				},
				isShow: false
			};
		},
		methods: {
			showChange() {
				this.isShow = !this.isShow;
			},
			openSetting(e){
				this.$emit("openSetting", e.detail.authSetting[`scope.${this.permitName}`]);
			}
		}
	}
</script>

<style>
	.view-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .65);
		z-index: 999;
	}

	.permit-list {
		margin-top: 12upx;
	}

	.permit-title {
		color: #666;
	}

	.permit-pop {
		width: 70vw;
		border-radius: 8upx;
		padding: 30upx 20px;
	}

	.permit-item .iconfont {
		display: inline-block;
		font-size: 40upx;
		line-height: 2.2em;
		width: 2.2em;
		text-align: center;
		background-color: #f1f1f9;
		margin: 0 auto;
		border-radius: 50%
	}

	.permit-item .permit-text {
		color: #888;
		margin-top: 12upx;
	}

	.permit-pop .permit-button {
		background: #FFD940;
		width: 65%;
		margin-top: 20upx;
		border-radius: 0;
		color: #fff;
		line-height: 2.5;
	}

	.permit-pop .permit-button::after {
		content: none;
	}
</style>
