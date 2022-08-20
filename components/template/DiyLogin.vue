<template>
	<view class="login-page">
		<!-- 已登录状态 -->
		<view v-if="login" class="box dis-flex">
			<view class="userinfo dis-flex">
				<view class="photobox">
					<view v-if="photourl" class="photo" :style="{'background-image':'url('+ photourl +')'}"></view>
					<view v-else class="photo" :style="{'background-image':getImageRoot('85.png','url')}"></view>
				</view>
				<view class="info dis-flex flex-dir-column">
					<view class="nickname onelist-hidden f-32 col-3">{{name}}</view>
					<view v-if="vipopen == 1"  class="vip-img f-22 col-9">
						<image :src="getImageRoot('member_user_index.png')" mode=""></image>
					</view>
					<view v-else class="vip f-22 col-9">未加入{{card_title}}</view>
				</view>
			</view>
			<view class="elseinfo dis-flex">
				<view class="elseinfo-son" v-for="(item,index) in account" :key = 'index'>
					<view class="num f-32">{{item.num | forShort}}</view>
					<view class="name f-24">{{item.name}}</view>
				</view>
			</view>
		</view>
		<!-- 未登录状态 -->
		<view v-else class="boxs dis-flex">
			<view class="userinfo dis-flex">
				<view class="photobox">
					<view class="photo" :style="{'background-image':getImageRoot('85.png','url')}"></view>
				</view>
				<view class="login" @click="handleLoginClick">点击登录</view>
			</view>
			<view class="elseinfo dis-flex">
				<view class="elseinfo-son" v-for="(item,index) in account" :key = 'index'>
					<view class="num f-32">{{item.num}}</view>
					<view class="name f-24">{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		props:{
			// login是否登录,photo用户头像地址,name用户昵称，vipopen是否会员，card_title会员类型，account卡卷信息
			login:{
				type:Boolean,
				default: false
			},
			photourl:{
				type:String,
				default:''
			},
			name: {
				type:String,
				default:'名扬天下'
			},
			vipopen: {
				type:Number,
				default:0
			},
			card_title: {
				type:String,
				default:''
			},
			account: {
				type:Array,
				default() {
					return []
				}
			}
		},
		filters:{
			forShort(val) {
				if(val > 9999) {
					let result = val/10000
					val = result.toFixed(2) + 'w'
					return val
				}else {
					return val
				}
			}
		},
		methods:{
			handleLoginClick() {
				App.doLogin()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-page {
		background: #fff;
		padding: 20rpx 0;
		width: 710rpx;
		margin: auto;
		border-radius: 10rpx;
	}
	.box,.boxs {
		width: 100%;
		height: 93rpx;
	}
	.userinfo {
		flex: 1;
	}
	.elseinfo {
		flex: 1;
	}
	.photobox {
		width:92rpx;
		height:93rpx;
		background:rgba(248,248,248,1);
		border-radius:50%;
		margin: 0 30rpx;
	}
	.photo {
		width: 92rpx;
		height: 92rpx;
		background-size: 92rpx 92rpx;
		margin-right: 8rpx;
		border-radius: 50%;
		border: 1rpx solid #eee;
	}
	.info {
		margin: 7rpx 0 7rpx 0;
		max-width: 200rpx;
	}
	.nickname {
		height: 32rpx;
		width: 100%;
		line-height: 32rpx;
	}
	.vip-img {
		width: 100rpx;
		height: 31rpx;
		margin-top: 13rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.vip {
		margin-top: 13rpx;
		height: 34rpx;
		background:rgba(248,248,248,1);
		border:1px solid rgba(238,238,238,1);
		padding: 0 10rpx;
		border-radius:2rpx;
		text-align: center;
		line-height: 34rpx;
	}
	.elseinfo-son {
		flex: 1;
		margin-left: 21rpx;
	}
	.num {
		margin-top: 9rpx;
	}
	.boxs .userinfo {
		align-items: center;
	}
	.login {
		width:150rpx;
		height:54rpx;
		line-height: 54rpx;
		text-align: center;
		font-size: 28rpx;
		color:rgba(255,255,255,1);
		background:linear-gradient(#555,#333);
		border-radius:27rpx;
	}
	
</style>
