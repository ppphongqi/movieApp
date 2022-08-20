<template>
	<view :style="themeColor">
		<view class="content">
			<view class="pages-header"></view>
			<view style="position: absolute;z-index: 2;top: 0;bottom: 0;left: 0;right: 0;margin-top: 40rpx;">
				<!-- 下单成功图标 -->
				<image  src="static/images/xiazai.png" style="height: 120rpx;width: 120rpx;"></image>
				<!-- 下单成功 -->
				<view style="margin-top: 40rpx;font-size: 36rpx;font-weight: bold;line-height: 29rpx;color: #333333;">下单成功</view>
				<!-- 头像 -->
				<view >
					<image style="border: 10rpx solid #FFFFFF; margin-top: 120rpx; border-radius: 148rpx;background: #FFFFFF;width: 236rpx;height: 236rpx;" :src="toPromoteRes.image[0].file_path"/>
				</view>
				<!-- 商品名称 -->
					<view style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 405rpx;display: inline-block;font-size: 28rpx;font-weight: 400;line-height: 48rpx;color:#333333;margin-bottom: 40rpx;margin-top: 30rpx;">{{toPromoteRes.goods_name}}</view>
					<!-- 分享多少人购买即可免单 -->
					<view style="font-size: 36rpx;font-weight: bold;line-height: 48rpx;color: #333333;margin-top: 40rpx;">分享{{toPromoteRes.share_num}}人购买即可{{toPromoteRes.free}}</view>
					<view style="background: #FFD940;border-radius: 45rpx;margin: 30rpx 30rpx 0 30rpx;" >
						<!-- <view style="font-size: 32rpx;font-weight: bold;line-height: 39rpx;color: #333333;padding: 28rpx;">再来一单</view> -->
						 <button type="primary"  @click="handmoreorder" :disabled="lodings" style="background: #FFD940;color: #333333;border-radius: 45rpx;">再来一单</button>
						 
					</view>
					<view style="display: flex;justify-content: center;">
						<view style="background: #f0edf1;border-radius: 45rpx;margin: 30rpx 30rpx 0 30rpx;width: 50%;" @click="isShare">
							<view style="font-size: 32rpx;font-weight: bold;line-height: 39rpx;color: #9c999c;padding: 28rpx;">返回首页</view>
						</view>
						
						<view style="width: 50%;">
							<view style="position: relative;">
								<view style="background: #F8F8F8;border-radius: 45rpx;margin: 30rpx 30rpx 0 30rpx;border: 1rpx solid #707070;" @click="myOrder">
									<view style="font-size: 32rpx;font-weight: bold;line-height: 39rpx;color: #333333;padding: 28rpx;">我的订单</view>
								</view>
								<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO -->
									<view style="width: 120rpx;height: 120rpx;background: #FFD940;border-radius: 50%;position: absolute;right: 40rpx;top: 70rpx;">
										<view style="margin-top: 10rpx;">
											<image style="width: 40rpx;height: 40rpx;" src="static/images/image-fx.png"></image>
										</view>
										<view class="share-btn">						
											<button  hover-class='none' open-type="share" :data-share-type="posterType" style="font-size: 26rpx;display: contents;"> 分享</button>
										</view>
									</view>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<view style="width: 120rpx;height: 120rpx;background: #FFD940;border-radius: 50%;position: absolute;right: 40rpx;top: 70rpx;" @click.stop="shareBtn">
									<view style="margin-top: 10rpx;">
										<image style="width: 40rpx;height: 40rpx;" src="static/images/image-fx.png"></image>
									</view>
									<view class="share-btn">						
										<button  hover-class='none' style="font-size: 26rpx;display: contents;"> 分享</button>
									</view>
								</view>
								<!-- #endif -->
							</view>
							
						</view>
						
						
					
						
					</view>
				<!-- 	<view style="background: #FFD940;border-radius: 45rpx;margin: 30rpx 30rpx 0 30rpx;" @click="isShare">
						<view style="font-size: 32rpx;font-weight: bold;line-height: 39rpx;color: #333333;padding: 28rpx;">返回首页</view>
					</view> -->
				
						<share-view v-if="toPromoteRes.free_id&&(toPromoteRes.card_id||toPromoteRes.goods_id)" ref="shareView" poster-type="free_id"  :pid="toPromoteRes.goods_id" :free="toPromoteRes.free_id" :card="toPromoteRes.card_id"></share-view>
					<PopupView :show='isShow' type='top' @clickmask='isShow=false'>
						<view class="">
							<image src="../../../static/h5/share.png" mode="" style="width: 640rpx;"></image>
						</view>
					</PopupView>
					<!-- <share-view ref="shareView" :poster-type="shareType"></share-view> -->
			</view>
			
	</view>
	</view>
		
</template>
<script>
	import PopupView from "@/components/template/PopManager.vue"
	import App from '@/common/js/app.js'
	import baseMixin from '@/mixins/baseMixin.js'
	import ShareView from "@/components/template/ShareView.vue"
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [baseMixin,pageShareMixin],
		components: {
			ShareView,
			PopupView
		},
		data(){
			return{
				image:[],//商品图片
				share_num:'',//免单人数
				goods_name:'',//商品名称
				free:'',
				toPromoteRes:{},
				detail:{},
				isShow:false,
				lodings:true,
			
			}
		},
		onLoad(options){
			this.options = options
		},
		async onShow(){
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.getToPromote({}).catch(() => {}),
					this.getGoodsDetail()
				])
				// 设置分享数据
				console.log(">>>>>>>>",this.toPromoteRes)
				this.shareData = this.pageShareMixin_createShareData({
					url:this.toPromoteRes.is_goods==1?'/pages/subPages/goods/index/index':'pages/subPages/card/createOrder',
					imgUrl: this.$util.deepGet(this.toPromoteRes,'image.0.file_path',''),
					desc: this.$util.deepGet(this.toPromoteRes,'',''),
					title: this.$util.deepGet(this.toPromoteRes,'goods_name','免单商品'),
					query:{
						  free_id: this.$util.deepGet(this.toPromoteRes, 'free_id', ''),
						  goods_id:this.$util.deepGet(this.toPromoteRes, 'goods_id', ''),
						  card_id:this.$util.deepGet(this.toPromoteRes, 'card_id', ''),
					},
				
					
				})
				console.log("jdjjdjdddddd",this.shareData)
			} catch (e) {
			
			}
		},
		methods:{
			getGoodsDetail(){
				if(this.options.goods_id){
					App._get('goods/detail', {
						goods_id:this.options.goods_id
					}, result => {
						this.lodings=false
						this.detail = result.data.detail
					})
				}
			},
			//再来一单
			handmoreorder(){
				// this.toPromoteRes.is_goods==1---商品
				// this.toPromoteRes.is_goods==2---卡包
				if(this.toPromoteRes.is_goods==1){
					App.navigationTo({
						url: "pages/subPages/flow/checkout?" + App.urlEncode({
							goods_id: this.toPromoteRes.goods_id,
							free_id: this.toPromoteRes.free_id,
							goods_num:this.toPromoteRes.goods_num,
							goods_sku_id:this.toPromoteRes.goods_sku_id,
							order_type:7,
							// 以下参数来自商品详情接口
							transport_type:this.detail.transport_type,
							bus_id: this.detail.bus_id,
							is_meal: this.detail.is_meal,
							meal_together_buy: this.detail.meal_together_buy,
							is_express: this.detail.isexpress,
							is_zt: this.detail.iszt,
							run_errands: this.detail.run_errands,
						}),
					})
				}else{
					App.navigationTo({
						url: "pages/subPages/card/createOrder?" + App.urlEncode({
							card_id: this.toPromoteRes.card_id,
							free_id: this.toPromoteRes.free_id,
							from:'free',
						}),
					})
				}
			},
			async getToPromote(){
				try{
					const res = await App._postP('free.Free/getToPromote', {
						goods_id:this.options.goods_id,
						free_id:this.options.free_id,
						card_id:this.options.card_id,
						order_id:this.options.order_id
					})
					this.lodings = false
					this.toPromoteRes= res.data || {}
					
				}catch(e){
					return Promise.reject(e)
				}
			},
			// 分享菜单
			isShare() {
				// this.$refs.shareView.shareswich();pages/mainPages/order/index
				App.navigationTo({
					url:'pages/subPages/myfreeBill/index'
				})
			},
			myOrder(){
				App.navigationTo({
					url:'pages/mainPages/order/index'
				})
			},
			shareBtn() {
				if (this.appClientType === "3") {
					uni.showToast({
						icon: "none",
						title: "请使用自带浏览器分享~"
					})
				} else if (this.appClientType === "4") {
					this.isShow = true;
				}
			
			},
		}
	}
</script>
<style lang="scss" scoped>
	.pages-header {
		height: 590upx;
		position: relative;
		overflow: hidden;
	}
	.content{
		text-align: center;
	}
	.pages-header::before {
		content: " ";
		width: 150vw;
		height:590upx;
		background-color: var(--theme-color);
		border-radius: 50%;
		position: absolute;
		left: -26vw;
		top: -15%;
		z-index: 1;
	}
	.to-share {
		position: fixed !important;
		z-index: 1009;
		right: 10upx;
		top: 0;
		overflow: auto;
		width: 500upx;
		height: 380upx;
	}
	.share-submit {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	}
	.share-btn{
			// /deep/.uni-input-input{  /*deep样式穿透，直接从底部修改*/
			// 	padding: 0;
			// 	margin: 0;
			// 	background: #FFD940;
			// }
			button::after {
					border: none;
				}
	}
</style>