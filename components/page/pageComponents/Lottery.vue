<template>
	<view class="">
		<view class="diy-groups" :style="themeColor">
			<!-- 风格一 -->
			<block v-if="itemStyle.display == '1'">
				<view class="es-seckill-group style-row">
					<!-- <view class="flex es-seckill-title">
						<view class="title"><text class="seckill-title">拼团商品</text></view>
						<view @click="toGroupMore">查看更多 <view class="iconfont icon-jinrujiantou1"></view></view>
					</view> -->
					<view class="group">
						<view class="flex-row flex-warp">
							<view class="es-seckill-col" v-for="(groupItem,groupIndex) in itemData" :key="groupIndex" @click="toGoodsInfo(groupItem.goods_id, groupItem.groups_id)">
								<view class="image img-center" :style="{'background-image':'url('+ groupItem.image[0]['file_path'] + ')'}">
									<text class="group-tip">{{groupItem.group_number}}人团</text>
								</view>

								<view class="detail">
									<view class="title line-hide twolist-hidden">{{groupItem.goods_name}}</view>
									<view class="subtitle line-hide flex-row flex-justify-b flex-align-c">
										<text class="sub-price"><text class="icon">{{settingData.currency}}</text>{{groupItem.groups_price}}</text>
										<!-- <text class="sub-price line-through"><text class="icon">已拼{{groupItem.already_spell}}件</text></text> -->
									</view>
									<view class="subtitle line-hide flex-row flex-justify-b flex-align-c">
										<text class="sub-price line-through">
											<text class="icon" style="white-space: nowrap;">单购价:{{settingData.currency}}{{groupItem.original_price}}</text>
										</text>
										<view class="group-btn">
											<text class="sub-price line-through"><text class="icon">已拼{{groupItem.already_spell}}件</text></text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 风格二 -->
			<block v-if="itemStyle.display == '2'">
				<view class="es-seckill-group style-col">
					<!-- <view class="flex es-seckill-title">
						<view class="title"><text class="seckill-title">拼团商品</text></view>
						<view @click="toGroupMore">查看更多 <view class="iconfont icon-jinrujiantou1"></view></view>
					</view> -->
					<view class="group">
						<view>
							<view class="es-seckill-col flex-row" v-for="(groupItem,groupIndex) in itemData" :key="groupIndex" @click="toGoodsInfo(groupItem.goods_id, groupItem.groups_id)">
								<view class="image img-center" :style="{'background-image':'url('+ groupItem.image[0]['file_path'] + ')'}">
								</view>
								<view class="detail flex-col flex-justify-b">
									<view class="flex-col">
										<view class="title  line-hide"><text class="twolist-hidden">{{groupItem.luck_title}}</text></view>
										<!-- <view class="flex-row flex-align-c">
											<text class="orders-gray">已拼{{groupItem.already_spell}}件</text>
											<text class="sales-btn">{{groupItem.group_number}}人团</text>
										</view> -->
									</view>
									<view class="sales-num">
										<view class="flex-row flex-justify-b flex-align-c">
											<view>
												<view class="subtitle line-hide">
													<view>
														<text class="sub-price"><text class="icon">{{settingData.currency}}</text>{{groupItem.groups_price}}</text>
													</view>
												</view>
												<view class="orders-gray">单购价:
													{{settingData.currency}}{{groupItem.original_price}}</view>
											</view>
											<view class="flex-row flex-align-c">
												<view class="group-btn col-list help-bg-color auxiliary-color"><text>去拼团</text></view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 风格三 -->
			<!-- <block v-if="itemStyle.display == '3'">
				<view class="es-seckill-group style-row">
					
					<view class="group">
						
						<view class="es-seckill-col-3" v-for="(darwItem,darwIndex) in newitemData" :key="darwIndex" @click="todrawInfo(darwItem['luck_id'])">
							<view class="image img-center" :style="{'background-image':'url('+darwItem['image']+')'}">
								<view class="activity-like t-c f-24" v-if="darwItem.luck_is_see === 1"><text class="iconfont icon-like"></text>{{darwItem['luck_like']}}人喜欢</view>
							</view>
							<view class="detail">
								<view class="title line-hide twolist-hidden">
									<view class="title-label main-bg-color auxiliary-color" v-if="darwItem['luck_tag']['length']>0">{{darwItem['luck_tag']}}</view>{{darwItem['luck_title']}}
								</view>
								<view class="subtitle line-hide flex-row flex-justify-b flex-align-c m-btm20">
									<view>
										<text class="sub-price"><text class="icon icon-right-3">价值 :</text>{{darwItem['luck_price']}}<text class="icon icon-left-3">元</text></text>
									
									</view>
									<view class="go-draw-style t-c " :class="{'active': darwItem.luck_state != 2}">{{luckStateType[`${darwItem.luck_state}`]}}</view>
								</view>
								<view class="subtitle line-hide flex-row flex-justify-b flex-align-c">
									<text class="sub-price line-through">
										<block v-if="darwItem['luck_mode'] === 1">
											<text class="icon" style="white-space: nowrap;">{{darwItem['luck_begin_time']}}自动开奖</text>
										</block>
										<block v-if="darwItem['luck_mode'] === 2">
											<text class="icon" style="white-space: nowrap;">人数满{{darwItem['luck_begin_number']}}人自动开奖</text>
										</block>
										<block v-if="darwItem['luck_mode'] === 3">
											<text class="icon" style="white-space: nowrap;">手动开奖</text>
										</block>
									</text>
									<view class="group-btn">
										<text class="sub-price line-through"><text class="icon">共{{darwItem['luck_count']}}份奖品</text></text>
									</view>
								</view>
							</view>
						</view>
						
					</view>
				</view>
			</block> -->


			<!-- 风格四  -->
			<block v-if="itemStyle.display == '4'">
				<view class="styleFour" v-for="(fourItem,fourIndex) in newPeridosData" :key="fourIndex" @click="todrawInfo(fourItem['luck_id'],fourItem['peridosOne']['luck_period_id'])">

					<view class="headTitle" v-if="params.showStore=='1'">

						<swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000" :duration="1500" next-margin="-30rpx"
						 style="height: 50rpx;">
							<swiper-item style="display: table;height: 50rpx;" v-for="(swiperItem,swiperiIndex) in fourItem.prize" :key="swiperiIndex">
								<view class="storeContent">
									<view class="">
										<image class="storeLogo" :src="swiperItem.business.logo.file_path" mode=""></image>
									</view>
									<view class="oneLine" style="line-height: 50rpx;">
										<text style="font-size: 16px;">{{swiperItem.business_name}} 赞助</text>
									</view>
								</view>
							</swiper-item>

						</swiper>

					</view>
					<view class="" style="display: flex;">
						<view class="" style="margin-right: 20rpx;position: relative;">
							<image class="goodsImg" :src="fourItem.image_img[0].file_path" mode=""></image>
							<view class="lotteryTips">
								<text>抽奖</text>
							</view>
						</view>
						<view class="" style="display: flex;flex-direction: column;justify-content: space-between;">
							<view class="goodsTitle">
							<text class="peridos" v-if="fourItem.luck_periods.length>0">{{fourItem.peridosOne.luck_period_id}}期</text>
							<text class="peridos" v-else>{{fourItem.luck_tag}}</text>
								<!-- <text>【5店通用·小肥羊】68元抢100元无门槛现 金券，周末节假日通用，1个成人可免费携带一...</text> -->
								<text>{{fourItem.luck_title}}</text>
							</view>
							<view class="">
								<view class="flexContent" style="margin-bottom: 20rpx;width: 458rpx;">
									<view class="">
										<text v-if="fourItem.luck_mode === 2">人数满{{fourItem['luck_begin_number']}}人自动开奖</text>
										<text v-if="fourItem.luck_mode === 1 && fourItem.luck_periods.length>0 ">{{fourItem.peridosOne.lottery_time | timeChange}}自动开奖</text>
										<text v-if="fourItem.luck_mode === 1 && fourItem.luck_periods.length==0 ">{{fourItem.luck_begin_time | timeChange}}自动开奖</text>
										<text v-if="fourItem.luck_mode === 3">{{fourItem.hand_text}}</text>
									</view>
									<view class="">
										<text>x{{fourItem.luck_count}}份</text>
									</view>
								</view>
								<view class="flexContent">
									<view class="" style="color: #FF4444;">
										<text>价值￥</text><text style="font-size: 18px;font-weight:bold;">{{fourItem.luck_price}}</text>
									</view>
									<view class="freeBtn" :class="{'hasOpen': fourItem.luck_state == 1}"  v-if="fourItem.luck_periods.length==0">
									<!-- <text style="line-height: 40rpx;">{{( fourItem['luck_id'],fourItem['peridosOne']['luck_period_id']) | luckState }}</text> -->  
									<text>{{luckStateType[`${fourItem.luck_state}`]}}</text>
									
									</view>
									<view class="freeBtn" v-else  :class="{'hasOpen': fourItem.peridosOne.period_state == 1}">
										<text >{{luckStateType[`${fourItem.peridosOne.period_state}`]}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 风格五 -->
			<block v-if="itemStyle.display == '3'">
				<view class="styleFour" v-for="(fourItem,fourIndex) in newPeridosData" :key="fourIndex" @click="todrawInfo(fourItem['luck_id'],fourItem['peridosOne']['luck_period_id'])">
					<view class="headTitle" v-if="params.showStore=='1'">
						<!-- <notice-bar :left-icon="''" :text="'麦当劳（天府广场店）赞助'"  padding-top="8" :scrollable="true" /> -->
						<swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000" :duration="1500" next-margin="-30rpx"
						 style="height: 50rpx;">
							<swiper-item style="display: table;height: 50rpx;" v-for="(swiperItem,swiperiIndex) in fourItem.prize" :key="swiperiIndex">
								<view class="storeContent">
									<view class="">
										<image class="storeLogo" :src="swiperItem.business.logo.file_path" mode=""></image>
									</view>
									<view class="oneLine" style="line-height: 50rpx;">
										<text style="font-size: 16px;">{{swiperItem.business_name}} 赞助</text>
									</view>
								</view>
							</swiper-item>

						</swiper>

					</view>
					<view class="" style="position: relative;">
						<image :src="fourItem.image[0].file_path" style="width: 100%;height: 366rpx;border-radius:6px 6px 0px 0px;"></image>
						<view class="lotteryTips">
							<text>抽奖</text>
						</view>
						<view class="bigTime">
							<text v-if="fourItem.luck_mode === 2">人数满{{fourItem['luck_begin_number']}}人自动开奖</text>
							<text v-if="fourItem.luck_mode === 1 && fourItem.luck_periods.length>0 ">{{fourItem.peridosOne.lottery_time | timeChange}}自动开奖</text>
							<text v-if="fourItem.luck_mode === 1 && fourItem.luck_periods.length==0 ">{{fourItem.luck_begin_time | timeChange}}自动开奖</text>
							<text v-if="fourItem.luck_mode === 3">{{fourItem.hand_text}}</text>
							<text>x{{fourItem.luck_count}}份</text>
						</view>
					</view>
					<view class="contentWrap">
						<view class="goodsTitle">
							<text class="peridos" v-if="fourItem.luck_periods.length>0">{{fourItem.peridosOne.luck_period_id}}期</text>
							<text class="peridos" v-else>{{fourItem.luck_tag}}</text>
							<text>{{fourItem.luck_title}}</text>
							<!-- <text>【5店通用·小肥羊】68元抢100元无门槛现 金券，周末节假日通用，1个成人可免费携带一...</text> -->
						</view>
						<view class="flexContent">
							<view class="" style="color: #FF4444;">
								<text>价值￥</text><text style="font-size: 18px;font-weight:bold;">{{fourItem.luck_price}}</text>
							</view>
							<view class="freeBtn" :class="{'hasOpen': fourItem.luck_state == 1}"  v-if="fourItem.luck_periods.length==0">
							<!-- <text style="line-height: 40rpx;">{{( fourItem['luck_id'],fourItem['peridosOne']['luck_period_id']) | luckState }}</text> -->  
							<text>{{luckStateType[`${fourItem.luck_state}`]}}</text>
							
							</view>
							<view class="freeBtn" v-else  :class="{'hasOpen': fourItem.peridosOne.period_state == 1}">
								<text >{{luckStateType[`${fourItem.peridosOne.period_state}`]}}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"

	export default {
		data() {
			return {
				currentIndex: 1,
				show: false,
				newPeridosData:[],
				luckStateType: {
					1: '已开奖',
					2: '参与抽奖',
					3: '未开始'
				}
			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemData: Array,
			peridosData: Array
		},
		created() {
			// this.fontScroll()
			console.log("xxxxxxxxxxx");
			console.log(this.peridosData);
		  let allData=[];
		allData=this.peridosData;
		this.newPeridosData=this.peridosData;
		// this.peridosData.map((item,index)=>{
		// 	App._postP("luck.luck/getLuckState", {
		// 		luck_id:item.luck_id,
		// 		period_id:item.peridosOne.luck_period_id			
		// 	}).then(res=>{
				
		// 		if(item.luck_periods.length==0){
		// 			item.luck_state=res.data.state
		// 		}else{
		// 			item.peridosOne.period_state=res.data.state
					
		// 		}
				
		// 		this.newPeridosData[index] = item
		// 		this.newPeridosData = [...this.newPeridosData]
		// 		// if(res.data.luck_source==0){
		// 		// 	this.newPeridosData.push(item)
		// 		// }
		// 	})
		// })
		
		},
		computed: {
			// luckState() {
			// 	return  function(luck_id, period_id = 0){
					
			// 	  	App._postP("luck.luck/getLuckState", {
			// 			luck_id,
			// 			period_id
			// 		}).then(res => {
			// 			console.log("-----------");
			// 		//	return "参与抽奖";
			// 			console.log(res);
			// 			if(res.data.state==1){
			// 				// showState = "已开奖";
			// 				return "已开奖";
			// 			}else{
			// 				// showState = "参与抽奖";
			// 				 console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
			// 				return "参与抽奖";
			// 			}
			// 		});
			// 	}
			// },
			
			newitemData() {


				// if (!!this.itemData && this.itemData.length > 0) {
				// 	if (!!this.itemData && this.itemData.length > 0) {
				// 	let itemData = this.itemData.map(val => {
				// 		val.luck_begin_time = this.$util.formatTime(val.luck_begin_time, 'normal', ':').split("");
				// 		val.luck_begin_time.splice(2, 1, "月");
				// 		val.luck_begin_time.splice(5, 1, "日");
				// 		val.luck_begin_time = val.luck_begin_time.join("");
				// 		return val
				// 	});
				// 	return itemData
				// }

				let itemData = this.peridosData;
				return itemData;
			}
		},

		methods: {
			todrawInfo(luck_id, period_id) {
				let urls;
				if (period_id) {
					urls = `pages/subPages/drawlotter/index/index?luck_id=${luck_id}&period_id=${period_id}`
				} else {
					urls = `pages/subPages/drawlotter/index/index?luck_id=${luck_id}`
				}
				App.navigationTo({
					url: urls
				})
			},
			


		},
		filters: {
			//时间戳转换
			timeChange: function(value) {
				// return this.$util.formatTime(times,normal," ")
				var time = new Date(value * 1000);
				var y = time.getFullYear();
				var m = time.getMonth() + 1;
				var d = time.getDate();
				var h = time.getHours();
				var mm = time.getMinutes();
				var s = time.getSeconds();
				if (h < 10) h = '0' + h;
				if (mm < 10) mm = '0' + mm
				return m + '月' + d + '日' + ' ' + h + ':' + mm;
			},
			
		},
		luckState(luck_id, period_id = 0){
			
			App._postP("luck.luck/getLuckState", {
				luck_id,
				period_id
			}).then(res => {
				console.log("-----------");
			//	return "参与抽奖";
				console.log(res);
				if(res.data.state==1){
					// showState = "已开奖";
					return "已开奖";
				}else{
					// showState = "参与抽奖";
					
					return "参与抽奖";
				}
			});
		}
	}
</script>

<style lang="scss" scoped>
	.hasOpen{
		background:rgba(238,238,238,1) !important;
		color: #9A9A9A !important;
	}
	.oneLine {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 560rpx;
	}

	.diy-groups {
		.es-seckill-group {
			background: #ffffff;
			overflow: hidden;
		}

		.twolist-hidden {
			white-space: normal;
		}

		.icon-jinrujiantou1 {
			display: inline-block;
			vertical-align: middle;
			line-height: 1;
			font-size: 30upx;
			margin-left: 5upx;
		}

		.orders-gray {
			color: #999;
		}

		.flex,
		.flex-column {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
		}

		.pos-center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-ms-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			-o-transform: translate(-50%, -50%);
		}

		.pos-row-center {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			-webkit-transform: translateX(-50%);
			-ms-transform: translateX(-50%);
			-moz-transform: translateX(-50%);
			-o-transform: translateX(-50%);
		}

		.pos-col-center {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			-webkit-transform: translateY(-50%);
			-ms-transform: translateY(-50%);
			-moz-transform: translateY(-50%);
			-o-transform: translateY(-50%);
		}

		.img-center {
			background-position: center;
			background-size: cover;
			background-repeat: no-repeat;
		}

		.flex-row {
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers.  */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy)  */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10    */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			display: flex;
			/* 新版本语法: Opera 12.1, Firefox 22+ */
			-webkit-box-orient: horizontal;
			-webkit-flex-direction: row;
			-ms-flex-direction: row;
			flex-direction: row;
		}

		.flex-warp {
			flex-wrap: wrap;
		}

		.flex-row-reverse {
			flex-direction: row-reverse;
		}

		.inline {
			display: inline-block;
		}

		.flex-col {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-orient: vertical;
			-webkit-flex-direction: column;
			-ms-flex-direction: column;
			flex-direction: column;
		}

		.flex-col-reverse {
			flex-direction: column-reverse;
		}

		.flex-align-s {
			align-items: flex-start;
		}

		.flex-align-c {
			align-items: center;
		}

		.flex-align-e {
			align-items: flex-end;
		}

		.flex-justify-s {
			justify-content: flex-start;
		}

		.flex-justify-c {
			justify-content: center;
		}

		.flex-justify-e {
			justify-content: flex-end;
		}

		.flex-justify-b {
			justify-content: space-between;
		}

		.flex-grow-1 {
			flex-grow: 1
		}

		.flex-justify-a {
			justify-content: space-around;
		}

		.no-nowrap {
			white-space: nowrap;
		}

		.scale-grow {
			width: 0;
			flex-grow: 1;
		}

		.group-btn {
			color: #fff;
			padding: 0 6px;
			line-height: 22px;
			border-radius: 8px;
			font-size: 12px;
			height: 22px;

			&.col-list {
				background: #fd463e;
				width: 75px;
				padding: 5upx 0;
				text-align: center;
				color: #fff;
				font-weight: bold;
				border-radius: 14px;
			}
		}

		.es-seckill-title {
			margin: 20px 20px 6px;
			height: 22px;
			font-size: 11px;
			-webkit-box-pack: justify;
			-webkit-justify-content: space-between;
			-ms-flex-pack: justify;
			justify-content: space-between;
			-webkit-box-align: center;
			-webkit-align-items: center;
			-ms-flex-align: center;
			align-items: center;
		}

		.es-seckill-title .title {
			.seckill-title {
				font-size: 18px;
				font-weight: 700;
				color: #3d404d;
				background: #fff;
			}

			font-size: 16px;

			image {
				vertical-align: middle;
				zoom: .5;
			}

			&+view {
				color: #999;
				margin-right: -5px;
			}
		}

		.es-seckill-title text {
			background: #fff;
			display: inline-block;
			color: #333;
			text-align: center;
			line-height: 18px;
			width: 17px;
		}

		.es-seckill-title text:first-of-type {
			width: auto;
			background: #fe504f;
			color: #fff;
			font-size: 12px;
			margin-right: 8px;
			padding: 1px 3px;
		}

		.es-seckill-group.style-row .group {
			overflow: hidden;

			&>view {
				font-size: 0;
			}
		}

		.es-seckill-group.style-row .group .es-seckill-col {
			display: inline-block;
			padding: 0 30upx;
			width: 50%;
			box-sizing: border-box;
			border-radius: 2px;

			&:nth-of-type(odd) {
				padding-right: 15upx;
			}

			&:nth-of-type(even) {
				padding-left: 15upx;
			}

			.image {
				position: relative;
				padding-bottom: 100%;
				// background: url('/static/images/ordergl.png');
				margin: 4px 0 8px;
				width: 100%;
				// border: 1px solid #e5e5e5;
				border-radius: 3px;

				.group-tip {
					display: inline-block;
					white-space: nowrap;
					position: absolute;
					color: #ffffff;
					font-size: 24upx;
					top: 25upx;
					height: 38upx;
					height: 38upx;
					font-weight: 500;
					padding: 0 5upx;
					left: 0;
					z-index: 2;
					background: linear-gradient(90deg, rgba(254, 80, 79, 1), rgba(254, 133, 79, 1));
					/* box-shadow:0 2upx 10upx 0 rgba(254,80,79,0.54); */
					border-radius: 6upx 0 6upx 0;
				}

				image {
					height: 100%;
					width: 100%;
					object-fit: cover;
					border-radius: 10px;
					display: block;
				}
			}
		}

		.es-seckill-group.style-row .group .es-seckill-col .image text {
			line-height: 16px;
			padding: 0 6px;
			border-radius: 0 5px 0 0;
			background: #fd463e;
			color: #fff;
			position: absolute;
			display: none;
			bottom: 0;
			left: 0;
			font-weight: 700;
			font-size: 12px;
		}

		.es-seckill-group.style-row .group .es-seckill-col .detail {
			width: 100%;
			font-size: 12px;
			padding-bottom: 20px;

			.title {
				height: 80upx;
				margin-bottom: 10upx;
				font-size: 14px;
				overflow: hidden;
			}

			.subtitle {
				height: 24px;
				line-height: 1;

				.sub-price {
					font-size: 14px;

					.icon {
						font-size: 12px;
					}

					&:not(.line-through) {
						font-size: 20px;
						color: #fd463e;
						font-weight: 600;
					}

					&.line-through {
						color: #999;
						text-decoration: none;
					}
				}
			}

			.sales-num {
				.num {
					font-size: 14px;
					color: #999;
				}
			}
		}

		.es-seckill-group.style-row .group .es-seckill-col .detail .price .num {
			color: #999ca7;
			font-size: 9px;
			line-height: 25px;
			margin-left: 6px;
		}

		.es-seckill-group.style-row .group .es-seckill-col .detail .price .flex {
			-webkit-box-pack: start;
			-webkit-justify-content: flex-start;
			-ms-flex-pack: start;
			justify-content: flex-start;
		}

		.es-seckill-group.style-row .group .es-seckill-col .detail .price text {
			font-size: 16px;
		}

		//   style2
		.es-seckill-group.style-col .group {
			overflow: hidden;

			&>view {
				white-space: nowrap;
				font-size: 0;
			}
		}

		.es-seckill-group.style-col .group .es-seckill-col {
			padding: 0 15px;
			box-sizing: border-box;
			border-radius: 2px;
			margin-bottom: 10px;
			// border-bottom: 1px solid #999;
			// padding-bottom: 12px;

			.image {
				position: relative;
				margin: 4px 0 4px;
				// border: 1px solid #e5e5e5;
				border-radius: 5px;
				height: 115px;
				width: 115px;
				// .group-tip{
				// 	display: inline-block;
				// 	white-space: nowrap;
				// 	position: absolute;
				// 	color: #ffffff;
				// 	font-size: 24upx;
				// 	top: 25upx;
				// 	height:38upx;
				// 	height:38upx;
				// 	font-weight:500;
				// 	padding: 0 5upx;
				// 	left: 0;
				// 	z-index: 2;
				// 	background:linear-gradient(90deg,rgba(254,80,79,1),rgba(254,133,79,1));
				// 	/* box-shadow:0 2upx 10upx 0 rgba(254,80,79,0.54); */
				// 	border-radius:6upx 0 6upx 0;
				// }
				// image {
				// 	height: 95px;
				// 	width: 95px;
				// 	object-fit: cover;
				// 	border-radius: 10px;
				// 	display: block;
				// }
			}
		}

		.es-seckill-group.style-col .group .es-seckill-col .image text {
			line-height: 16px;
			padding: 0 6px;
			border-radius: 0 5px 0 0;
			background: #fd463e;
			color: #fff;
			position: absolute;
			display: none;
			bottom: 0;
			left: 0;
			font-weight: 700;
			font-size: 12px;
		}

		.es-seckill-group.style-col .group .es-seckill-col .detail {
			width: 0;
			height: 135px;
			flex-grow: 1;
			font-size: 12px;
			margin-left: 15px;
			margin-right: 0;

			.title {
				font-size: 14px;
				margin: 5px 0;
				// height: 80upx;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 215px;
				color: #495060;
				// margin-bottom: 22upx;
			}

			.sales-num {
				padding-bottom: 10px;
				border-bottom: .5px solid #e5e5e5;
			}

			.sales-btn {
				display: inline-block;
				margin-left: 4px;
				border: 1px solid #fd463e;
				color: #fd463e;
				padding: 0 6px;
				font-size: 24upx;
				height: 30upx;
				line-height: 28upx;
				padding: 0px 8px;
				border-radius: 4px;
				margin-right: 8px;
				font-size: 24upx;
			}

			.subtitle {
				.sub-price {
					font-size: 14px;

					.icon {
						font-size: 12px;
					}

					&:not(.line-through) {
						font-size: 17px;
						color: #fd463e;
						font-weight: 600;
					}

					&.line-through {
						color: #999;
						text-decoration: line-through;
					}
				}
			}
		}

		.es-seckill-group.style-col .group .es-seckill-col .detail .price .num {
			color: #999ca7;
			font-size: 9px;
			line-height: 25px;
			margin-left: 6px;
		}

		.es-seckill-group.style-col .group .es-seckill-col .detail .price .flex {
			-webkit-box-pack: start;
			-webkit-justify-content: flex-start;
			-ms-flex-pack: start;
			justify-content: flex-start;
		}

		.es-seckill-group.style-col .group .es-seckill-col .detail .price text {
			font-size: 16px;
		}

		// style 3
		.es-seckill-group.style-row .group .es-seckill-col-3 {
			display: inline-block;
			padding: 0 30upx;
			width: 100%;
			box-sizing: border-box;
			border-radius: 2px;

			.image {
				position: relative;
				padding-bottom: 60%;
				// background: url('/static/images/ordergl.png');
				margin: 4px 0 8px;
				width: 100%;
				// border: 1px solid #e5e5e5;
				border-radius: 3px;
				background-size: 690rpx 394rpx;

				.activity-like {
					position: absolute;
					right: 30upx;
					top: 40upx;
					width: 200upx;
					height: 50upx;
					line-height: 50upx;
					background: rgba(255, 255, 255, 0.8);
					border-radius: 24upx;
					color: #FE504F;

				}

				.group-tip {
					display: inline-block;
					white-space: nowrap;
					position: absolute;
					color: #ffffff;
					font-size: 24upx;
					top: 25upx;
					height: 38upx;
					height: 38upx;
					font-weight: 500;
					padding: 0 5upx;
					left: 0;
					z-index: 2;
					background: linear-gradient(90deg, rgba(254, 80, 79, 1), rgba(254, 133, 79, 1));
					/* box-shadow:0 2upx 10upx 0 rgba(254,80,79,0.54); */
					border-radius: 6upx 0 6upx 0;
				}

				image {
					height: 100%;
					width: 100%;
					object-fit: cover;
					border-radius: 10px;
					display: block;
				}
			}
		}

		.es-seckill-group.style-row .group .es-seckill-col-3 .image text {
			line-height: 16px;
			padding: 0 3px;
			border-radius: 0 5px 0 0;
			color: #fd463e;
			bottom: 0;
			left: 0;
			font-weight: 700;
			font-size: 12px;
		}

		.es-seckill-group.style-row .group .es-seckill-col-3 .detail {
			width: 100%;
			font-size: 12px;
			padding-bottom: 20px;

			.title {
				height: 2.8em;
				line-height: 1.4em;
				margin-bottom: 20upx;
				font-size: 32upx;
			}

			.title-label {
				display: inline-block;
				font-size: 20upx;
				white-space: nowrap;
				background-color: rgb(254, 216, 64);
				padding: 0 10upx;
				margin-right: 16upx;

				&+text {
					vertical-align: middle;
				}
			}

			.subtitle {
				height: 48upx;
				line-height: 1;

				.sub-price {
					font-size: 28upx;

					.icon {
						font-size: 22upx;
						font-weight: normal;
					}

					.icon-left-3 {
						margin-left: 4upx
					}

					.icon-right-3 {
						margin-right: 4upx
					}

					&:not(.line-through) {
						font-size: 42upx;
						color: #fd463e;
						font-weight: 600;
					}

					&.line-through {
						color: #999;
						text-decoration: none;
					}
				}

				.go-draw-style {
					font-size: 28upx;
					width: 160upx;
					height: 60upx;
					line-height: 60upx;
					background-color: rgb(255, 216, 66);
					background-color: var(--theme-color);
					color: var(--auxiliary-color);
					border-radius: 40upx;

					&.active {
						background: rgba(204, 204, 204, 1);
						color: #ffffff;
					}
				}

				.go-draw-style-204 {
					background-color: rgb(204, 204, 204) !important;
				}
			}

			.sales-num {
				.num {
					font-size: 28upx;
					color: #999;
				}

				// 				.progress {
				// 					width: 100upx;
				// 					height: 20upx;
				// 					border-radius: 20upx;
				// 					line-height: 20upx;
				// 					background: rgb(242, 242, 242);
				// 
				// 					.progress-num {
				// 						display: inline-block;
				// 						background: #fd463e;
				// 						width: 40%;
				// 						height: 20upx;
				// 						border-radius: 10px;
				// 					}
				// 				}
			}
		}
	}

	text {
		font-size: 14px;
	}

	.styleFour {

		background-color: #FFFFFF;
		padding: 20rpx;
		border-radius: 10rpx;
		margin: 16rpx;

		.storeLogo {
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			margin-right: 23rpx;
		}

		.goodsImg {
			width: 200rpx;
			height: 200rpx;
			border-radius: 8rpx;
		}

		.flexContent {
			display: flex;
			justify-content: space-between;
			width: 100%;
			
		}

		.freeBtn {
			background: rgba(255, 217, 64, 1);
			border-radius: 4px;
			padding: 0  12rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 40rpx;
			color: #333333;
		}

		.lotteryTips {
			background: linear-gradient(50deg, rgba(251, 203, 23, 1) 0%, rgba(255, 234, 114, 1) 100%);
			border-radius: 4rpx 0rpx 16rpx 0rpx;
			padding: 0 13rpx;
			color: #743C02;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 3;
		}

		.headTitle {
			margin: 25rpx 0;
			height: 50rpx;

			overflow: hidden;
		}

		.storeContent {
			display: flex;
		}

		.peridos {
			background: rgba(246, 210, 70, 1);
			padding: 0 6rpx;
			margin-right: 10rpx;
			color: #333333;
			border-radius: 4rpx;
			font-size: 10px;
		}

		.goodsTitle {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.bigTime {
			display: flex;
			justify-content: space-between;
			background: rgba(0, 0, 0, 0.5);
			color: #FFFFFF;
			padding: 0 21rpx;
			position: absolute;
			width: 100%;
			box-sizing:border-box;
			bottom: 10rpx;
			border-radius: 4rpx;
		}

		.contentWrap {
			padding: 21rpx;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			height: 160rpx;
		}
	}
</style>
