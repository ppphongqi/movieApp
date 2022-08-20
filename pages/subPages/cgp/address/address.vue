<template>
	<view class="box" :style="themeColor">
		<view class="address-title">
			<view class="dis-flex">
				<view class="iconfont icon-locationfill"></view>
				<view class="f-24 col-3 m-right12">{{address.city}}</view>
				<view class="dis-flex flex-x-center flex-y-center" style="background:rgba(246,246,246,1) !important;border-radius:35px;width:80%;">
					<view class=" iconfont icon-sousuo"></view>
					<input class="dis-flex address-input col-9 f-24" name="input" placeholder="请输入搜索地址" v-model="detailValues" confirm-type="detail"
					 @confirm="detail" type="text"/>
				</view>
			</view>
			<view class="address" @click="againLocation">
				<view>
					<block v-if="formatted_address">
						<view class="onelist-hidden col-3 f-28">{{formatted_address.formatted_address}}</view>
					</block>
					<block v-else>
						<view class="f-28 col-3 t-c">暂无定位!</view>
					</block>
				</view>
				<view class="iconfont icon-ditudingwei f-24" style="color: #2AC418;" >重新定位</view>
			</view>
		</view>
		<block v-if="loadlogo">
			<block v-if="JSON.stringify(addressData.currentLeader)=='{}' || addressData.currentLeader.length==0 ">
				<view class="col-3 f-26 p-top-40 t-c">暂无团长</view>
			</block>
			<block v-else>
				<view class="main">
					<image class="header-img" :style="{'background-image':getImageRoot('71.png','url')}"></image>
					<view class="item">
						<image :src="addressData.currentLeader.avatarUrl" mode="widthFix"></image>
					</view>
					<view class="item">
						{{addressData.currentLeader.name}} <text class="group">团长</text>
					</view>
					<view class="item col-3 f-24">
						{{addressData.currentLeader.community}}
					</view>
			<!-- 		<view class="item " >
						<text class="onelist-hidden" style="width: 50%;">地址：{{addressData.currentLeader.detail}}</text>
						距离您{{addressData.currentLeader.width}}km
						<text class="iconfont icon-jinrujiantou"/>
					</view> -->
					<view class="dis-flex flex-x-between" style="margin: 20rpx 60rpx 20rpx 60rpx;">
						<view class="onelist-hidden col-9 f-24">地址：{{addressData.currentLeader.address.detail}}</view>
						
						<view class="dis-flex">
							<view class=" f-24 onelist-hidden f-24">距离您{{addressData.currentLeader.width}}km</view>
							<text class="iconfont icon-jinrujiantou"></text>
						</view>
					</view>
					<view class="onelist-hidden col-9 f-24 m-top12">手机号码：{{addressData.currentLeader.phone}}</view>
				</view>
			</block>
			
		</block>
		<view class="neibor" v-if="addressData.ortherLeader.length>0?addressData.ortherLeader:''">
			<view class="neibor-title title">附近其他团长</view>
			<view class="neibor-item" v-for="(item,index) in addressData.ortherLeader" :key='index'  @click="bindreg({reg_id:item.reg_id})">
				<image mode="widthFix" :src="item.avatarUrl" class="m-right12"></image>
				<view style="padding: 10rpx; width: 80%;">
					<view class="title">{{item.name}} <text class='group '>团长</text></view>
					<view class="">{{item.title}}</view>
					<view class="dis-flex flex-x-between m-top12"> 
						<view class="onelist-hidden" style="width: 69%;">地址：{{item.detail}}</view>
						
						<view class="dis-flex">
							<view class=" f-24 onelist-hidden">距离您{{item.width}}km</view>
							<text class="iconfont icon-jinrujiantou"></text>
						</view>
					</view>
					<view class="onelist-hidden m-top12 f-24 col-3" style="width: 69%;">手机号码：{{item.phone}}</view>
				</view>
			</view>
		</view>
		<get-permit-view ref="permitView" permit-name="userLocation" @openSetting="onSettingBack"></get-permit-view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import GetPermitView from "@/components/template/GetPermitView.vue"
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				addressData:{
					currentLeader:{},
					ortherLeader:[]
				},
				lng: null,
				lat: null,
				loadlogo:false,
				address:{},
				formatted_address:"",
				detailValues:"",
			}
		},
		components:{
			GetPermitView
		},
		watch: {
			settingData: {
				handler(val) {
					console.log('哈哈哈哈哈哈哈哈',val)
					this.shareData = this.pageShareMixin_createShareData({
						title: this.$util.deepGet(val, 'cgp.share_title'),
						desc: this.$util.deepGet(val, 'cgp.share_text', ''),
						imgUrl: this.$util.deepGet(val, 'cgp.share_image', '')
					})
				},
				immediate: true
			}
		},
		onLoad(){
			let _this= this
			_this.getList();
	
		},
		methods: {
			getnearbyReg(lng,lat){
				let _this=this
				App._post_form('cgp.Reg/nearbyReg',{
						lng:this.lng,
						lat:this.lat,
						detail:this.detailValues
				},res=>{
					_this.addressData.ortherLeader = res.data.data
					_this.addressData.currentLeader = res.data.have_reg
					_this.address  =res.data.address.result.addressComponent
					_this.formatted_address = res.data.address.result
					_this.loadlogo = true
					console.log("_this.address",_this.address)
				})
			},
			/**
			 * 搜索提交
			 */
			detail() {
				this.getnearbyReg();
			},
			getList(){
				let _this= this;
				App.getLocation().then(res => {
					_this.lng = res.longitude;
					_this.lat = res.latitude;
					_this.getnearbyReg(res.longitude, res.latitude)
				});
			},
			/**
			 * 获取权限设置回调
			 */
			onSettingBack(userLocation) {
				if (userLocation) {
					App.showLoading();
					this.$refs.permitView.showChange();
				}
			},
			// 重新定位
			againLocation(){
				this.getList();
			},
			bindreg(obj){
				let _this = this;
				uni.showModal({
				    title: '提示',
				    content: '是否绑定该团长',
				    success: function (res) {
				        if (res.confirm) {
				          App._post_form('cgp.Reg/bindReg',obj,res =>{
				          	_this.getList();
							uni.navigateBack()
				          })
				        } else if (res.cancel) {
				            console.log('取消');
				        }
				    }
				});
	
			},
	
		},
	}
</script>

<style lang="scss" scoped>
	$color1:#333333;
    $color2:#999999;
	image {
		width: 100rpx;
		border-radius: 50%;
	}
	text {
		color: $color2;
	}
	.title {
		font-size: 28rpx;
	}
	.header-img{
		height: 80rpx;
		width: 80rpx;
		position: absolute;
		top: 270rpx;
		left: 40rpx;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.group {
		display:inline-block;
		width: 70rpx;
		height: 35rpx;
		text-align: center;
		line-height: 35rpx;
		margin-left:10rpx ;
		font-size: 24rpx;
		background-color: #FFD940;
		background-color: var(--theme-color);
		color: $color1;
		color:  var(--auxiliary-color);
	}
    .box{
		color: $color1;
		.address-title {
			background-color: #fff;
			padding: 40rpx 40rpx 20rpx 40rpx;
			// margin:0 auto 20rpx;
			.dis-flex{
				display: flex;
				flex-direction: row;
				font-size: 28rpx;
				align-items: center;
				.address-input {
					width:70%;
					height:70rpx;
				
					
					margin-left: 20rpx;
				}
			}
			
			.address {
				background-color: #fff;
				margin: 20rpx auto;
				display: flex;
				flex-direction: row;
				font-size: 28rpx;
				justify-content: space-between;
				align-items: center;
			}
			
		}
		
		.main {
			width: 90%;
			margin: 0 auto;
			background-color: #fff;
			text-align: center;
			padding: 20rpx;
			border-radius: 10px;
			margin-top: 20rpx;
			.item {
				margin: 10rpx auto;
				font-size: 28rpx;	
			}
		}
		.neibor {
			width: 90%;
			margin: 0 auto;
			padding: 20rpx;
			font-size: 26rpx;
			.neibor-title {
				margin: 20rpx 0;
			}
			.neibor-item {
				display: flex;
				flex-direction: row;
				padding: 20rpx;
				background:rgba(255,255,255,1);
				border-radius:10px;
				margin: 20rpx auto;
				height: 141rpx;
			}
			
		}
		
	}

</style>
